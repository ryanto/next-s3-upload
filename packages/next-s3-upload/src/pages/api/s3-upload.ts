import { NextApiRequest, NextApiResponse } from 'next';
import {
  STSClient,
  GetFederationTokenCommand,
  STSClientConfig,
} from '@aws-sdk/client-sts';
import { v4 as uuidv4 } from 'uuid';

type NextRouteHandler = (
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<void>;

type Configure = (options: Options) => Handler;
type Handler = NextRouteHandler & { configure: Configure };

type Options = {
  key?: (req: NextApiRequest, filename: string) => string | Promise<string>;
};

let makeRouteHandler = (options: Options = {}): Handler => {
  let route: NextRouteHandler = async function(req, res) {
    let missing = missingEnvs();
    if (missing.length > 0) {
      res
        .status(500)
        .json({ error: `Next S3 Upload: Missing ENVs ${missing.join(', ')}` });
    } else {
      let config: STSClientConfig = {
        credentials: {
          accessKeyId: process.env.S3_UPLOAD_KEY as string,
          secretAccessKey: process.env.S3_UPLOAD_SECRET as string,
        },
        region: process.env.S3_UPLOAD_REGION,
      };

      let bucket = process.env.S3_UPLOAD_BUCKET;

      let filename = req.body.filename;
      let key = options.key
        ? await Promise.resolve(options.key(req, filename))
        : `next-s3-uploads/${uuidv4()}/${filename.replace(/\s/g, '-')}`;

      let policy = {
        Statement: [
          {
            Sid: 'Stmt1S3UploadAssets',
            Effect: 'Allow',
            Action: ['s3:PutObject'],
            Resource: [`arn:aws:s3:::${bucket}/${key}`],
          },
        ],
      };

      let sts = new STSClient(config);

      let command = new GetFederationTokenCommand({
        Name: 'S3UploadWebToken',
        Policy: JSON.stringify(policy),
        DurationSeconds: 60 * 60, // 1 hour
      });

      let token = await sts.send(command);
      res.statusCode = 200;

      res.status(200).json({
        token,
        key,
        bucket,
        region: process.env.S3_UPLOAD_REGION,
      });
    }
  };

  let configure = (options: Options) => makeRouteHandler(options);

  return Object.assign(route, { configure });
};

// This code checks the for missing env vars that this
// API route needs.
//
// Why does this code look like this? See this issue!
// https://github.com/ryanto/next-s3-upload/issues/50
//
let missingEnvs = (): string[] => {
  let keys = [];
  if (!process.env.S3_UPLOAD_KEY) {
    keys.push('S3_UPLOAD_KEY');
  }
  if (!process.env.S3_UPLOAD_SECRET) {
    keys.push('S3_UPLOAD_SECRET');
  }
  if (!process.env.S3_UPLOAD_REGION) {
    keys.push('S3_UPLOAD_REGION');
  }
  if (!process.env.S3_UPLOAD_BUCKET) {
    keys.push('S3_UPLOAD_BUCKET');
  }
  return keys;
};

let APIRoute = makeRouteHandler();

export { APIRoute };
