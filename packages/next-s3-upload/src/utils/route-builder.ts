import {
  STSClient,
  GetFederationTokenCommand,
  STSClientConfig,
  GetFederationTokenCommandOutput,
} from '@aws-sdk/client-sts';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getConfig, S3Config } from './config';
import { getClient } from './client';

export class RouteBuilderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RouteBuilderError';
  }
}

type RouteRequest = {
  _nextS3?: {
    strategy: any;
  };
  filename: string;
  filetype: string;
};

type BaseRouteHandler = ({
  body,
  fileKey,
  s3Options,
}: {
  body: RouteRequest;
  fileKey: string;
  s3Options: S3Config;
}) => Promise<
  | {
      fileKey: string;
      bucket: string;
      region: string;
      endpoint?: string;
      url: string;
    }
  | {
      token: GetFederationTokenCommandOutput;
      fileKey: string;
      bucket: string;
      region: string;
    }
>;

export const route: BaseRouteHandler = async function({
  body,
  fileKey,
  s3Options,
}) {
  const config = getConfig(s3Options);

  const missing = missingEnvs(config);
  if (missing.length > 0) {
    throw new RouteBuilderError(
      `Next S3 Upload: Missing ENVs ${missing.join(', ')}`
    );
  }

  const uploadType = body._nextS3?.strategy;
  const { bucket, region, endpoint } = config;

  if (uploadType === 'presigned') {
    const { filetype } = body;
    const client = getClient(config);
    const params = {
      Bucket: bucket,
      Key: fileKey,
      ContentType: filetype,
      CacheControl: 'max-age=630720000',
    };

    const url = await getSignedUrl(client, new PutObjectCommand(params), {
      expiresIn: 60 * 60,
    });

    return {
      fileKey,
      bucket,
      region,
      endpoint,
      url,
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
          Resource: [`arn:aws:s3:::${bucket}/${fileKey}`],
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

    return {
      token,
      fileKey,
      bucket,
      region,
    };
  }
};

const missingEnvs = (config: Record<string, any>): string[] => {
  const required = ['accessKeyId', 'secretAccessKey', 'bucket', 'region'];

  return required.filter(key => !config[key] || config.key === '');
};
