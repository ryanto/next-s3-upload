import { NextApiRequest, NextApiResponse } from 'next';
import {
  STSClient,
  GetFederationTokenCommand,
  STSClientConfig,
} from '@aws-sdk/client-sts';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getConfig, S3Config } from '../../utils/config';
import { getClient } from '../../utils/client';
import { sanitizeKey, uuid } from '../../utils/keys';

type NextRouteHandler = (
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<void>;

type Configure = (options: Options) => Handler;
type Handler = NextRouteHandler & { configure: Configure };

type Options = S3Config & {
  key?: (req: NextApiRequest, filename: string) => string | Promise<string>;
};

let makeRouteHandler = (options: Options = {}): Handler => {
  let route: NextRouteHandler = async function(req, res) {
    let config = getConfig({
      accessKeyId: options.accessKeyId,
      secretAccessKey: options.secretAccessKey,
      bucket: options.bucket,
      region: options.region,
      forcePathStyle: options.forcePathStyle,
      endpoint: options.endpoint,
    });

    let missing = missingEnvs(config);
    if (missing.length > 0) {
      res
        .status(500)
        .json({ error: `Next S3 Upload: Missing ENVs ${missing.join(', ')}` });
    } else {
      let uploadType = req.body._nextS3?.strategy;
      let filename = req.body.filename;

      let key = options.key
        ? await Promise.resolve(options.key(req, filename))
        : `next-s3-uploads/${uuid()}/${sanitizeKey(filename)}`;
      let { bucket, region, endpoint } = config;

      if (uploadType === 'presigned') {
        let filetype = req.body.filetype;
        let client = getClient(config);
        let params = {
          Bucket: bucket,
          Key: key,
          ContentType: filetype,
          CacheControl: 'max-age=630720000',
        };

        const url = await getSignedUrl(client, new PutObjectCommand(params), {
          expiresIn: 60 * 60,
        });

        res.status(200).json({
          key,
          bucket,
          region,
          endpoint,
          url,
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

let missingEnvs = (config: Record<string, any>): string[] => {
  let required = ['accessKeyId', 'secretAccessKey', 'bucket', 'region'];

  return required.filter(key => !config[key] || config.key === '');
};

let APIRoute = makeRouteHandler();

export { APIRoute };
