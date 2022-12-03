import { usePresignedUpload } from "next-s3-upload";
import { useEffect, useState } from "react";

export default function UploadTest() {
  let [key, setKey] = useState();
  let { uploadToS3 } = usePresignedUpload();
  let url = useSignedUrl(key, "digitalOceanSpaces");

  let handleSubmit = async event => {
    event.preventDefault();
    let file = event.target.image.files[0];
    let { key } = await uploadToS3(file, {
      endpoint: {
        request: {
          url: "/api/digital-ocean-spaces"
        }
      }
    });
    setKey(key);
  };

  return (
    <div className="flex flex-col h-screen p-6">
      <form onSubmit={handleSubmit}>
        <input
          name="image"
          type="file"
          data-test="file-input"
          className="block"
        />
        <button>Start upload</button>
      </form>
      <div className="flex flex-1 pt-8 overflow-hidden">
        {url && <img className="object-contain" src={url} data-test="image" />}
      </div>
    </div>
  );
}

let useSignedUrl = (key, config = "aws") => {
  let [url, setUrl] = useState();

  useEffect(() => {
    let f = async () => {
      if (key) {
        let response = await fetch(
          `/api/generate-temporary-url?key=${key}&config=${config}`
        );
        let json = await response.json();
        setUrl(json.temporaryUrl);
      } else {
        setUrl(null);
      }
    };

    f();
  }, [key, config]);

  return url;
};
