import { generateTemporaryUrl } from "next-s3-upload";

export default async function GetSignedUrlHandler(req, res) {
  let key = req.query.key;
  let url = await generateTemporaryUrl(key);

  res.statusCode = 200;
  res.send({ url });
}
