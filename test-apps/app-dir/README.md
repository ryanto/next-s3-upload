This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Setting up B2

1. Create a new bucket in B2
2. Update the CORS rules of the bucket.
   1. You can download [this example rule file](https://github.com/backblaze-b2-samples/b2-browser-upload/blob/main/b2CorsRules.json) and tweak it accordingly.
   2. Once that rule file is ready, execute the command `b2 bucket update --cors-rules "$(cat ~/Downloads/b2CorsRules.json)" <bucketName>`.
3. Update [CORS rules](https://docs.aws.amazon.com/cli/latest/reference/s3api/put-bucket-cors.html) via aws cli.
   
    ```
    aws s3api put-bucket-cors \
    --bucket <MyBucket> \
    --cors-configuration file://cors.json \
    --endpoint-url=https://s3.us-west-004.backblazeb2.com
    ```

## Usage
### Presigned URL
After uploading file to a private bucket, you can generate a presigned URL for that file.

```
aws s3 presign s3://rabrain-upload/next-s3-uploads/f13091a6-dfab-4b64-87b1-0d2845507e00/b2CorsRules.json \
--endpoint-url=https://s3.us-west-004.backblazeb2.com
```

Refer to the [official doc](https://docs.aws.amazon.com/cli/latest/reference/s3/presign.html) for more details.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
