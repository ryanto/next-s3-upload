import { NextApiRequest, NextApiResponse } from 'next';
import {
  STSClient,
  GetFederationTokenCommand,
  STSClientConfig,
} from '@aws-sdk/client-sts';
import { v4 as uuidv4 } from 'uuid';
import { S3Client } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';

type NextRouteHandler = (
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<void>;

type Configure = (options: Options) => Handler;
type Handler = NextRouteHandler & { configure: Configure };

type Options = {
  accessKeyId?: string;
  secretAccessKey?: string;
  bucket?: string;
  region?: string;
  endpoint?: string;
  key?: (req: NextApiRequest, filename: string) => string | Promise<string>;
};

export const uuid = () => uuidv4();

const SAFE_CHARACTERS = /[^0-9a-zA-Z!_\\.\\*'\\(\\)\\\-/]/g;
const safeKey = (value: string) =>
  value.replace(SAFE_CHARACTERS, ' ').replace(/\s+/g, '-');

let makeRouteHandler = (options: Options = {}): Handler => {
  let route: NextRouteHandler = async function(req, res) {
    let config = {
      accessKeyId: options.accessKeyId ?? `${process.env.S3_UPLOAD_KEY}`,
      secretAccessKey:
        options.secretAccessKey ?? `${process.env.S3_UPLOAD_SECRET}`,
      bucket: options.bucket ?? `${process.env.S3_UPLOAD_BUCKET}`,
      region: options.region ?? `${process.env.S3_UPLOAD_REGION}`,
      endpoint: options.endpoint,
    };

    let missing = missingEnvs(config);
    if (missing.length > 0) {
      res
        .status(500)
        .json({ error: `Next S3 Upload: Missing ENVs ${missing.join(', ')}` });
    } else {
      let uploadType = req.body._nextS3?.strategy;
      let filename = req.body.filename;
      let sanitizedFilename = safeKey(filename);

      let key = options.key
        ? await Promise.resolve(options.key(req, filename))
        : `next-s3-uploads/${uuidv4()}/${sanitizedFilename}`;
      let { bucket, region, endpoint } = config;

      if (uploadType === 'presigned') {
        let filetype = req.body.filetype;

        let s3Client = new S3Client({
          credentials: {
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey,
          },
          region,
          ...(config.endpoint ? { endpoint: config.endpoint } : {}),
        });

        let presignedPost = await createPresignedPost(s3Client, {
          Bucket: bucket,
          Key: key,
          Fields: {
            'Content-Type': filetype,
          },
          Expires: 60 * 60, // 1 hour
        });

        res.status(200).json({
          key,
          bucket,
          region,
          endpoint,
          presignedPost,
        });
      } else {
        let stsConfig: STSClientConfig = {
          credentials: {
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey,
          },
          region,
        };

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

        let sts = new STSClient(stsConfig);

        let command = new GetFederationTokenCommand({
          Name: 'S3UploadWebToken',
          Policy: JSON.stringify(policy),
          DurationSeconds: 60 * 60, // 1 hour
        });

        let token = await sts.send(command);

        res.status(200).json({
          token,
          key,
          bucket,
          region,
        });
      }
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
let missingEnvs = (config: Record<string, any>): string[] => {
  let required = ['accessKeyId', 'secretAccessKey', 'bucket', 'region'];

  return required.filter(key => !config[key] || config.key === '');
};

let APIRoute = makeRouteHandler();

export { APIRoute };
