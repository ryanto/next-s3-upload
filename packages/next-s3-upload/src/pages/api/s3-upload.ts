import { NextApiRequest, NextApiResponse } from 'next';
import { S3Config } from '../../utils/config';
import { sanitizeKey, uuid } from '../../utils/keys';
import { route } from '../../utils/route-builder';

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
  const nextPageRoute: NextRouteHandler = async function (req, res) {
    const { body: reqBody } = req.body;
    const { filename } = reqBody;

    const { key, ...s3Options } = options;

    const fileKey = key
      ? await Promise.resolve(key(req, filename))
      : `next-s3-uploads/${uuid()}/${sanitizeKey(filename)}`;

    const { status, body } = await route({
      body: reqBody,
      s3Options: s3Options,
      fileKey: fileKey,
    });

    res.status(status).json(body);
  };

  let configure = (options: Options) => makeRouteHandler(options);

  return Object.assign(nextPageRoute, { configure });
};

let APIRoute = makeRouteHandler();

export { APIRoute };
