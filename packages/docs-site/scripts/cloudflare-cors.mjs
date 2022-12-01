import { PutBucketCorsCommand, S3Client } from "@aws-sdk/client-s3";

let accountId = `${process.env.R2_ACCOUNT_ID}`;

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: `${process.env.R2_ACCESS_KEY_ID}`,
    secretAccessKey: `${process.env.R2_SECRET_ACCESS_KEY}`
  }
});

async function main() {
  let response = await s3Client.send(
    new PutBucketCorsCommand({
      Bucket: `${process.env.R2_BUCKET}`,
      CORSConfiguration: {
        CORSRules: new Array({
          AllowedHeaders: ["*"],
          // AllowedHeaders: ["*"],
          // AllowedHeaders: ["Content-Type"],
          AllowedMethods: ["GET", "PUT", "POST", "HEAD"],
          AllowedOrigins: ["*"],
          ExposeHeaders: [],
          MaxAgeSeconds: 3000
        })
      }
    })
  );

  console.dir(response);
}

main();
