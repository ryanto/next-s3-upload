# Next.js S3 Upload

The goal of this package is to make it as easy as possible to upload files from a Next.js app to S3.

## Installation

```bash
npm install next-s3-upload

# or

yarn add next-s3-upload
```

## Configuration

### Environment variables

We'll need to setup a couple environment variables for this package to work properly.

```env
S3_UPLOAD_KEY=AAAAAAAAAAAAAAAAAAAA
S3_UPLOAD_SECRET=AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
S3_UPLOAD_BUCKET=name-of-s3-bucket
S3_UPLOAD_REGION=bucket-region-us-east-1
```

Next.js automatically supports [loading environment variables](https://nextjs.org/docs/basic-features/environment-variables) from `.env.local` in the project's root. For development it's best to put these values into `.env.local`.

For production, you'll need to set these variables with your hosting provider. If you're using Vercel you can configure the [build step](https://vercel.com/docs/build-step#environment-variables) to use these variables.

In the next sections we'll go over how to generate values for these variables.

### S3 bucket

Create a new S3 bucket and store the name of the bucket as `S3_UPLOAD_BUCKET` and its region as `S3_UPLOAD_REGION` in your `.env.local` file.

#### Bucket permissions

Once the bucket is created you'll need to go to the permissions tab and make sure that public access is not blocked.

![Bucket public access](https://user-images.githubusercontent.com/89411/99440530-b472a980-28e4-11eb-96e0-9c99005b65ee.png)

You'll also need to add the following permissions in the CORS section.

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

Here's what the CORS permissions will look like once you paste in the above JSON.

![Bucket cors](https://user-images.githubusercontent.com/89411/99424402-9ea6b980-28cf-11eb-8915-3a2001367ec8.png)

These settings are required so users can upload files to your bucket.

### IAM user

Next, we'll need to create API keys that give your Next app access to AWS.

Go to the [IAM](https://console.aws.amazon.com/iam/home) section of AWS and add a new user with **Programmatic access**.

For the permissions step click _Attach existing policies directly_ and then click the _Create policy_ button.

![Create a policy](https://user-images.githubusercontent.com/89411/99429030-715d0a00-28d5-11eb-9494-6b7f08f6b0f5.png)

When the policy editor opens, click on the _JSON_ tab and paste in the following policy.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "STSToken",
      "Effect": "Allow",
      "Action": "sts:GetFederationToken",
      "Resource": ["arn:aws:sts::ACCOUNT_ID:federated-user/S3UploadWebToken"]
    },
    {
      "Sid": "S3UploadAssets",
      "Effect": "Allow",
      "Action": "s3:*",
      "Resource": ["arn:aws:s3:::BUCKET_NAME", "arn:aws:s3:::BUCKET_NAME/*"]
    }
  ]
}
```

🚨 **Important** 🚨 Before saving the policy, you'll need to replace:

|                 |                                                                                                                          |
| --------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **ACCOUNT_ID**  | Your AWS account ID. You can get this number by clicking on your name in the header. It's the number next to My account. |
| **BUCKET_NAME** | The name of the bucket you created in the previous step.                                                                 |

Next, click review policy, and name the policy `next-s3-upload`. The name doesn't matter, so feel free to use anything you'd like. Follow any prompts and create the policy.

Now go back to the tab where you were adding a user. Search for the policy you created and select it. If the policy doesn't show up click the refresh button.

![Refresh policy](https://user-images.githubusercontent.com/89411/99429295-c567ee80-28d5-11eb-8e4d-818f55997a76.png)

Select the policy and continue creating the user. You can just click through the next steps, there's no more configuration.

Once the user is created you'll see a screen with their API keys. Copy these keys to `.env.local` as `S3_UPLOAD_KEY` and `S3_UPLOAD_SECRET`.

![API keys](https://user-images.githubusercontent.com/89411/99429536-25f72b80-28d6-11eb-931a-e88b633be057.png)

That's it! We're done configuring AWS for uploads.

### API Route

In order for our Next app to securely communicate with S3 we'll need to create an API route for `pages/api/s3-upload.js`.

```js
// pages/api/s3-upload.js
export { APIRoute as default } from 'next-s3-upload';
```

## Usage

This package provides a `useS3Upload` hook that gives you all of the pieces needed to coordinate an upload from your application to S3.

Here's an example of the simplest file upload component.

```jsx
import { useState } from 'react';
import { useS3Upload } from 'next-s3-upload';

export default function UploadTest() {
  let [imageUrl, setImageUrl] = useState();
  let { FileInput, openFileDialog, uploadToS3 } = useS3Upload();

  let handleFileChange = async file => {
    let { url } = await uploadToS3(file);
    setImageUrl(url);
  };

  return (
    <div>
      <FileInput onChange={handleFileChange} />

      <button onClick={openFileDialog}>Upload file</button>

      {imageUrl && <img src={imageUrl} />}
    </div>
  );
}
```

The `useS3Upload` hook returns three items needed to coordinate the upload.

|                    |                                                                                                                                  |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `FileInput`        | A component that renders a hidden file input. It needs to be rendered on the page in order to coordinate file access.            |
| `openFileDialog`   | A function that opens the browser's select a file dialog. Once a file is selected the `FileInput`'s `onChange` action will fire. |
| `uploadToS3(file)` | A function that will upload a `File` to your S3 bucket.                                                                          |

### Using next/image

In order to take advantage of [next/image](https://nextjs.org/docs/api-reference/next/image) we'll need to know the image's height and width. For images uploaded by users it's best to capture these dimensions during the upload process.

This package ships with a helper that lets you get the height and width from image files. Here's an example of its usage.

```jsx
import { useState } from 'react';
import { useS3Upload, getImageData } from 'next-s3-upload';
import Image from 'next/image';

export default function UploadTest() {
  let [imageUrl, setImageUrl] = useState();
  let [height, setHeight] = useState();
  let [width, setWidth] = useState();
  let { FileInput, openFileDialog, uploadToS3 } = useS3Upload();

  let handleFileChange = async file => {
    let { url } = await uploadToS3(file);
    let { height, width } = await getImageData(file);
    setWidth(width);
    setHeight(height);
    setImageUrl(url);
  };

  return (
    <div>
      <FileInput onChange={handleFileChange} />

      <button onClick={openFileDialog}>Upload file</button>

      {imageUrl && (
        <div>
          <Image src={imageUrl} width={width} height={height} />
          <div>{imageUrl}</div>
          <div>
            {height}x{width}
          </div>
        </div>
      )}
    </div>
  );
}
```

The `getImageData` is an async function that returns the height and width of the image. This data can be saved to your database alongside the URL of the image.

## Help and questions

This is a new project and I'd love to hear about your experience using it! If you run into any trouble or have any suggestions please open an [issue](https://github.com/ryanto/next-s3-upload/issues) or contact me on [Twitter](https://twitter.com/ryantotweets).
