import { APIRoute } from "next-s3-upload";

export default APIRoute.configure({
  async key(req, filename) {
    return new Promise(resolve => {
      let path = `another-path/${filename.toUpperCase()}`;

      setTimeout(() => {
        resolve(path);
      }, 1000);
    });
  }
});
