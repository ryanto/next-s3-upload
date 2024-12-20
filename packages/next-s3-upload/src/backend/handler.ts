import {
  STSClient,
  GetFederationTokenCommand,
  STSClientConfig,
} from '@aws-sdk/client-sts';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Config, getConfig } from '../utils/config';
import { getClient } from '../utils/client';
import { sanitizeKey, uuid } from '../utils/keys';
import { NextApiRequest } from 'next';
import { NextRequest } from 'next/server';

type AppOrPagesRequest = NextApiRequest | NextRequest;

export type Options<R extends AppOrPagesRequest> = S3Config & {
  key?: (req: R, filename: string, body?: any) => string | Promise<string>;
};

export async function handler<R extends NextApiRequest | NextRequest>({
  request,
  options,
}: {
  request: R;
  options: Options<R>;
}) {
  let s3Config = getConfig(options);

  let missing = missingEnvs(s3Config);
  if (missing.length > 0) {
    throw new Error(`Next S3 Upload: Missing ENVs ${missing.join(', ')}`);
  }

  // upgrade typescript and use 'in'
  // @ts-ignore
  let body = request.json ? await request.json() : request.body;
  let { filename } = body;

  const key = options.key
    ? await Promise.resolve(options.key(request, filename, body))
    : `next-s3-uploads/${uuid()}/${sanitizeKey(filename)}`;

  const uploadType = body._nextS3?.strategy;
  const { bucket, region, endpoint } = s3Config;

  if (uploadType === 'presigned') {
    let { filetype } = body;
    let client = getClient(s3Config);
    let params = {
      Bucket: bucket,
      Key: key,
      ContentType: filetype,
      CacheControl: 'max-age=630720000',
    };

    let url = await getSignedUrl(client, new PutObjectCommand(params), {
      expiresIn: 60 * 60,
    });

    return {
      key,
      bucket,
      region,
      endpoint,
      url,
    };
  } else {
    let stsConfig: STSClientConfig = {
      credentials: {
        accessKeyId: s3Config.accessKeyId,
        secretAccessKey: s3Config.secretAccessKey,
      },
      region,
    };

    let policy = {
      Statement: [
        {
          Sid: 'Stmt1S3UploadAssets',
          Effect: 'Allow',
          Action: ['s3:PutObject'],
          Resource: [`arn:aws:s3:::${bucket}/${key}`],
        },
      ],
    };

    let sts = new STSClient(stsConfig);

    let command = new GetFederationTokenCommand({
      Name: 'S3UploadWebToken',
      Policy: JSON.stringify(policy),
      DurationSeconds: 60 * 60, // 1 hour
    });

    let token = await sts.send(command);

    return {
      token,
      key,
      bucket,
      region,
    };
  }
}

const missingEnvs = (config: Record<string, any>): string[] => {
  const required = ['accessKeyId', 'secretAccessKey', 'bucket', 'region'];

  return required.filter(key => !config[key] || config.key === '');
};
