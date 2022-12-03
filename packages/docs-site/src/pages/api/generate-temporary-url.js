import { generateTemporaryUrl } from "next-s3-upload";

let configs = {
  digitalOceanSpaces: {
    accessKeyId: process.env.SPACES_KEY,
    secretAccessKey: process.env.SPACES_SECRET,
    bucket: process.env.SPACES_BUCKET,
    region: "us-east-1",
    endpoint: "https://nyc3.digitaloceanspaces.com"
  },
  cloudflareR2: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    bucket: process.env.R2_BUCKET,
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
  }
};

export default async function GenerateTemporaryUrlHandler(req, res) {
  let key = req.query.key;
  let config = configs[req.query.config];
  let temporaryUrl = await generateTemporaryUrl(key, config);

  res.status(200).json({ temporaryUrl });
}
