import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { S3Config } from '../types/types';

export const generateTemporaryUrl = async (
  key: string,
  s3Config?: S3Config
) => {
  let config = {
    accessKeyId: s3Config?.accessKeyId ?? `${process.env.S3_UPLOAD_KEY}`,
    secretAccessKey:
      s3Config?.secretAccessKey ?? `${process.env.S3_UPLOAD_SECRET}`,
    bucket: s3Config?.bucket ?? `${process.env.S3_UPLOAD_BUCKET}`,
    region: s3Config?.region ?? `${process.env.S3_UPLOAD_REGION}`,
    endpoint: s3Config?.endpoint,
  };

  let client = new S3Client({
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
    region: config.region,
    ...(config.endpoint ? { endpoint: config.endpoint } : {}),
  });

  let command = new GetObjectCommand({
    Bucket: config.bucket,
    Key: key,
  });

  let url = await getSignedUrl(client, command, { expiresIn: 3600 });

  return url;
};
