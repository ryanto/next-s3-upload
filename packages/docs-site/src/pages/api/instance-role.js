import { APIRoute } from "next-s3-upload";

export default APIRoute.configure({
  useInstanceRole: true
});
