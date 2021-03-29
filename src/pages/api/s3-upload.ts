import { NextApiRequest, NextApiResponse } from 'next';
import aws from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

type NextRouteHandler = (
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<void>;

type Configure = (options: Options) => Handler;
type Handler = NextRouteHandler & { configure: Configure };

type Options = {
  key?: (req: NextApiRequest, filename: string) => string;
};

let makeRouteHandler = (options: Options = {}): Handler => {
  let route: NextRouteHandler = async function(req, res) {
    let config = {
      accessKeyId: process.env.S3_UPLOAD_KEY,
      secretAccessKey: process.env.S3_UPLOAD_SECRET,
      region: process.env.S3_UPLOAD_REGION,
    };

    let bucket = process.env.S3_UPLOAD_BUCKET;

    let filename = req.query.filename as string;
    let key = options.key
      ? options.key(req, filename)
      : `next-s3-uploads/${uuidv4()}/${filename.replace(/\s/g, '-')}`;

    let policy = {
      Statement: [
        {
          Sid: 'Stmt1S3UploadAssets',
          Effect: 'Allow',
          Action: ['s3:PutObject', 's3:PutObjectAcl'],
          Resource: [`arn:aws:s3:::${bucket}/${key}`],
        },
      ],
    };

    let sts = new aws.STS(config);

    let token = await sts
      .getFederationToken({
        Name: 'S3UploadWebToken',
        Policy: JSON.stringify(policy),
        DurationSeconds: 60 * 60, // 1 hour
      })
      .promise();

    res.statusCode = 200;

    res.status(200).json({ token, key, bucket });
  };

  let configure = (options: Options) => makeRouteHandler(options);

  return Object.assign(route, { configure });
};

let APIRoute = makeRouteHandler();

export { APIRoute };
