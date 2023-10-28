import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getConfig, S3Config } from './config';
import { getClient } from './client';

export const generateTemporaryUrl = async (
  key: string,
  s3Config?: S3Config,
  expiresIn: number = 3600
) => {
  let config = getConfig(s3Config);
  let client = getClient(s3Config);

  let command = new GetObjectCommand({
    Bucket: config.bucket,
    Key: key,
  });

  let url = await getSignedUrl(client, command, { expiresIn });

  return url;
};
