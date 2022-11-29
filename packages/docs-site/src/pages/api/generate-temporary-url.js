import { generateTemporaryUrl } from "next-s3-upload";

export default async function GenerateTemporaryUrlHandler(req, res) {
  let key = req.query.key;
  let temporaryUrl = await generateTemporaryUrl(key);

  res.status(200).json({ temporaryUrl });
}
