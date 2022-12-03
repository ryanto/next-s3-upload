import { generateTemporaryUrl } from "next-s3-upload";

let configs = {
  digitalOceanSpaces: {
    accessKeyId: process.env.SPACES_KEY,
    secretAccessKey: process.env.SPACES_SECRET,
    bucket: process.env.SPACES_BUCKET,
    region: "us-east-1",
    endpoint: "https://nyc3.digitaloceanspaces.com"
  }
};

export default async function GenerateTemporaryUrlHandler(req, res) {
  let key = req.query.key;
  let config = configs[req.query.config];
  let temporaryUrl = await generateTemporaryUrl(key, config);

  res.status(200).json({ temporaryUrl });
}
