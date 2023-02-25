import { useState } from "react";
import { useS3Upload } from "next-s3-upload";

export default function UploadTest() {
  let [headerName, setHeaderName] = useState("");
  let [bodyName, setBodyName] = useState("");
  let [imageUrl, setImageUrl] = useState();

  let { uploadToS3 } = useS3Upload();

  const handleFileChange = async ({ target }) => {
    let file = target.files[0];

    let { url } = await uploadToS3(file, {
      endpoint: {
        request: {
          url: "/api/custom-key-based-on-request",
          headers: {
            "X-Header-Name": headerName
          },
          body: {
            bodyName
          }
        }
      }
    });

    setImageUrl(url);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div>
        <input
          type="text"
          value={headerName}
          onChange={e => setHeaderName(e.target.value)}
          data-test="header-name-input"
        />
      </div>

      <div>
        <input
          type="text"
          value={bodyName}
          onChange={e => setBodyName(e.target.value)}
          data-test="body-name-input"
        />
      </div>

      <div>
        <input
          type="file"
          name="file"
          multiple={true}
          data-test="file-input"
          onChange={handleFileChange}
        />
      </div>

      {imageUrl && (
        <div className="flex space-x-6">
          <div className="w-1/2">
            <img className="object-contain" src={imageUrl} data-test="image" />
          </div>
          <div className="w-1/2">
            <div className="mt-2 text-sm text-gray-500">URL:</div>
            <div data-test="url">{imageUrl}</div>
          </div>
        </div>
      )}
    </div>
  );
}
