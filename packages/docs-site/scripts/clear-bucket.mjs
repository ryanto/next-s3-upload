import {
  S3Client,
  ListObjectsCommand,
  DeleteObjectsCommand
} from "@aws-sdk/client-s3";

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

let config = configs[process.argv[2]];

if (!config) {
  throw "Missing config";
}

const s3Client = new S3Client({
  credentials: {
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey
  },
  region: config.region,
  endpoint: config.endpoint
});

async function main() {
  let result = await s3Client.send(
    new ListObjectsCommand({ Bucket: config.bucket })
  );

  let objects = result.Contents.map(object => ({ Key: object.Key }));

  await s3Client.send(
    new DeleteObjectsCommand({
      Bucket: config.bucket,
      Delete: { Objects: objects }
    })
  );
}

main();
