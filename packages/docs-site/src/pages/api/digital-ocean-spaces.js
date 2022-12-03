import { APIRoute } from "next-s3-upload";

export default APIRoute.configure({
  accessKeyId: process.env.SPACES_KEY,
  secretAccessKey: process.env.SPACES_SECRET,
  bucket: process.env.SPACES_BUCKET,
  region: "us-east-1",
  endpoint: "https://nyc3.digitaloceanspaces.com"
});
