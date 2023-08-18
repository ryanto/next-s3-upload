export type S3Config = {
  accessKeyId?: string;
  secretAccessKey?: string;
  bucket?: string;
  region?: string;
  endpoint?: string;
  forcePathStyle?: boolean;
};

export function getConfig(s3Config?: S3Config) {
  return {
    accessKeyId: s3Config?.accessKeyId ?? process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey:
      s3Config?.secretAccessKey ?? process.env.AWS_SECRET_ACCESS_KEY,
    bucket: s3Config?.bucket ?? process.env.S3_UPLOAD_BUCKET,
    region: s3Config?.region ?? process.env.AWS_REGION,
    endpoint: s3Config?.endpoint,
    forcePathStyle: s3Config?.forcePathStyle,
  };
}
