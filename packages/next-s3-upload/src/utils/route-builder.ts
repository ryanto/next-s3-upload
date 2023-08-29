import {
  STSClient,
  GetFederationTokenCommand,
  STSClientConfig,
} from '@aws-sdk/client-sts';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getConfig, S3Config } from './config';
import { getClient } from './client';
import { sanitizeKey, uuid } from './keys';

type RouteRequest = {
  _nextS3?: {
    strategy: any;
  };
  filename: string;
  filetype: string;
};

export type RouteOptions = S3Config & {
  key?: (body: RouteRequest, filename: string) => string | Promise<string>;
};

type BaseRouteHandler = ({
  body,
  options,
}: {
  body: RouteRequest;
  options: RouteOptions;
}) => Promise<{
  body: any;
  status: number;
}>;

export const route: BaseRouteHandler = async function({ body, options }) {
  const config = getConfig({
    accessKeyId: options.accessKeyId,
    secretAccessKey: options.secretAccessKey,
    bucket: options.bucket,
    region: options.region,
    forcePathStyle: options.forcePathStyle,
    endpoint: options.endpoint,
  });

  const missing = missingEnvs(config);
  if (missing.length > 0) {
    // changed to NextResponse
    return {
      status: 500,
      body: `Next S3 Upload: Missing ENVs ${missing.join(', ')}`,
    };
  }

  const uploadType = body._nextS3?.strategy;
  const filename = body.filename;

  const key = options.key
    ? await Promise.resolve(options.key(body, filename))
    : `next-s3-uploads/${uuid()}/${sanitizeKey(filename)}`;
  const { bucket, region, endpoint } = config;

  if (uploadType === 'presigned') {
    const filetype = body.filetype;
    const client = getClient(config);
    const params = {
      Bucket: bucket,
      Key: key,
      ContentType: filetype,
      CacheControl: 'max-age=630720000',
    };

    const url = await getSignedUrl(client, new PutObjectCommand(params), {
      expiresIn: 60 * 60,
    });

    // changed to NextResponse
    return {
      status: 200,
      body: {
        key,
        bucket,
        region,
        endpoint,
        url,
      },
    };
  } else {
    const stsConfig: STSClientConfig = {
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      region,
    };

    const policy = {
      Statement: [
        {
          Sid: 'Stmt1S3UploadAssets',
          Effect: 'Allow',
          Action: ['s3:PutObject'],
          Resource: [`arn:aws:s3:::${bucket}/${key}`],
        },
      ],
    };

    const sts = new STSClient(stsConfig);

    const command = new GetFederationTokenCommand({
      Name: 'S3UploadWebToken',
      Policy: JSON.stringify(policy),
      DurationSeconds: 60 * 60, // 1 hour
    });

    const token = await sts.send(command);

    // changed to NextResponse
    return {
      status: 200,
      body: {
        token,
        key,
        bucket,
        region,
      },
    };
  }
};

const missingEnvs = (config: Record<string, any>): string[] => {
  const required = ['accessKeyId', 'secretAccessKey', 'bucket', 'region'];

  return required.filter(key => !config[key] || config.key === '');
};
