import { POST as handler } from "next-s3-upload/route";

// import { APIRoute } from "next-s3-upload";

export const POST = handler.configure({
  accessKeyId: process.env.S3_UPLOAD_KEY,
  secretAccessKey: process.env.S3_UPLOAD_SECRET,
  bucket: process.env.S3_UPLOAD_BUCKET,
  region: process.env.S3_UPLOAD_REGION ?? "us-east-1",
  endpoint: "https://s3.us-west-004.backblazeb2.com"
})
