import { NextResponse, NextRequest } from 'next/server';
import { Options, handler } from './handler';

type NextAppRouteHandler = (req: NextRequest) => Promise<Response>;

type Configure = (options: Options<NextRequest>) => Handler;
type Handler = NextAppRouteHandler & { configure: Configure };

const makeRouteHandler = (options: Options<NextRequest> = {}): Handler => {
  let nextAppRoute: NextAppRouteHandler = async function(req) {
    try {
      const response = await handler({
        request: req,
        options: options,
      });

      return NextResponse.json(response);
    } catch (e) {
      console.error(e);
      return NextResponse.error();
    }
  };

  const configure = (options: Options<NextRequest>) =>
    makeRouteHandler(options);

  return Object.assign(nextAppRoute, { configure });
};

const POST = makeRouteHandler();

export { POST };
