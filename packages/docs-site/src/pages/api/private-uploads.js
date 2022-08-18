import { APIRoute, uuid } from "next-s3-upload";

export default APIRoute.configure({
  async key(req, filename) {
    let isPrivate = req.body.isPrivate;
    let key = `next-s3-uploads/${
      isPrivate ? "_private" : "_public"
    }/${uuid()}/${filename}`;

    return key;
  }
});
