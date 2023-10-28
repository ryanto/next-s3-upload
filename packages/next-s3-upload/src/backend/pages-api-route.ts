import { NextApiRequest, NextApiResponse } from 'next';
import { Options, handler } from './handler';

type NextRouteHandler = (
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<void>;

type Configure = (options: Options<NextApiRequest>) => Handler;
type Handler = NextRouteHandler & { configure: Configure };

let makeRouteHandler = (options: Options<NextApiRequest> = {}): Handler => {
  let nextPageRoute: NextRouteHandler = async function(req, res) {
    try {
      let body = await handler({
        request: req,
        options: options,
      });

      res.status(200).json(body);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  let configure = (options: Options<NextApiRequest>) =>
    makeRouteHandler(options);

  return Object.assign(nextPageRoute, { configure });
};

let APIRoute = makeRouteHandler();

export { APIRoute };
