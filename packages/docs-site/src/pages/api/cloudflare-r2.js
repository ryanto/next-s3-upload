import { APIRoute } from "next-s3-upload";

let accountId = `${process.env.R2_ACCOUNT_ID}`;

export default APIRoute.configure({
  accessKeyId: process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  bucket: process.env.R2_BUCKET,
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`
});
