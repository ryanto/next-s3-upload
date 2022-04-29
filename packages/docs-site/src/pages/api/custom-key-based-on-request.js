import { APIRoute } from "next-s3-upload";

export default APIRoute.configure({
  async key(req, filename) {
    return new Promise(resolve => {
      let bodyName = req.body.bodyName;
      let headerName = req.headers["x-header-name"];

      let path = `${headerName}/${bodyName}/${filename}`;

      setTimeout(() => {
        resolve(path);
      }, 1000);
    });
  }
});
