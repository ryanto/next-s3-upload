import { S3Client } from '@aws-sdk/client-s3';
import { getConfig, S3Config } from './config';

export type credentials = {
  accessKeyId: string;
  secretAccessKey: string;
};
export type configParams = {
  credentials?: credentials
  region: string
};

export function getClient(s3Config?: S3Config) {
  let config = getConfig(s3Config);

  const configParams: configParams = {
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
    region: config.region,
    ...(config.forcePathStyle ? { forcePathStyle: config.forcePathStyle } : {}),
    ...(config.endpoint ? { endpoint: config.endpoint } : {}),
  }

  if(!config.accessKeyId || !config.secretAccessKey) {
    delete configParams.credentials;
  }

  let client = new S3Client(configParams);

  return client;
}
