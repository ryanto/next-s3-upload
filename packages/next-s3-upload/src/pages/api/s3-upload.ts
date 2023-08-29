import { NextApiRequest, NextApiResponse } from 'next';
import { S3Config } from '../../utils/config';
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
  const nextPageRoute: NextRouteHandler = async function(req, res) {
    const { status, body } = await route({
      body: req.body,
      options: options, // Needs to be abstracted into RouteOptions still
    });

    res.status(status).json(body);
  };

  let configure = (options: Options) => makeRouteHandler(options);

  return Object.assign(nextPageRoute, { configure });
};

let APIRoute = makeRouteHandler();

export { APIRoute };
