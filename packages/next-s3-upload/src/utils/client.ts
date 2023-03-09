import { S3Client } from '@aws-sdk/client-s3';
import { getConfig, S3Config } from './config';

export function getClient(s3Config?: S3Config) {
  let config = getConfig(s3Config);

  let clientConfig = {
    ...(config.region ? { region: config.region } : {}),
    ...(config.forcePathStyle ? { forcePathStyle: config.forcePathStyle } : {}),
    ...(config.endpoint ? { endpoint: config.endpoint } : {}),
  }

  if (!config.useInstanceRole) {
    Object.assign(clientConfig,
      {
        credentials: {
          accessKeyId: config.accessKeyId,
          secretAccessKey: config.secretAccessKey,
        }
      }
    );
  }

  let client = new S3Client(clientConfig);

  return client;
}