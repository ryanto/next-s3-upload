import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

export const generateTemporaryUrl = async (key: string) => {
  let client = new S3Client({
    credentials: {
      accessKeyId: process.env.S3_UPLOAD_KEY as string,
      secretAccessKey: process.env.S3_UPLOAD_SECRET as string,
    },
    region: process.env.S3_UPLOAD_REGION,
  });

  let command = new GetObjectCommand({
    Bucket: process.env.S3_UPLOAD_BUCKET,
    Key: key,
  });

  let url = await getSignedUrl(client, command, { expiresIn: 3600 });

  return url;
};
