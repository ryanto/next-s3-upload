import { NextResponse, NextRequest } from 'next/server';
import { S3Config } from '../../utils/config';
import { route } from '../../utils/route-builder';

type NextAppRouteHandler = (req: NextRequest) => Promise<Response>;

type Configure = (options: Options) => Handler;
type Handler = NextAppRouteHandler & { configure: Configure };

type Options = S3Config & {
  key?: (req: NextRequest, filename: string) => string | Promise<string>;
};

const makeRouteHandler = (options: Options = {}): Handler => {
  const nextAppRoute: NextAppRouteHandler = async function(req) {
    const response = await route({
      body: await req.json(),
      options: options, // Needs to be abstracted into RouteOptions still
    });

    return NextResponse.json(response);
  };

  const configure = (options: Options) => makeRouteHandler(options);

  return Object.assign(nextAppRoute, { configure });
};

const AppAPIRoute = makeRouteHandler();

export { AppAPIRoute };
