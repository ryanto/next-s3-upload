import { useState } from "react";
import { useS3Upload } from "next-s3-upload";
import { useSignedUrl } from "./hooks/use-signed-url";

export default function UploadTest() {
  let [uploads, setUploads] = useState([]);

  let { uploadToS3 } = useS3Upload();

  const handleFileChange = async ({ target }) => {
    let file = target.files[0];
    let { key } = await uploadToS3(file);

    setUploads(current => [...current, { key }]);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div>
        <input
          type="file"
          name="file"
          data-test="file-input"
          onChange={handleFileChange}
        />
      </div>

      {uploads.map(upload => (
        <div className="flex space-x-6" key={upload.key} data-test={upload.key}>
          <div className="w-1/4">
            <div className="mt-2 text-sm text-gray-500">Key:</div>
            <div data-test="key">{upload.key}</div>
          </div>
          <div className="w-1/4">
            <SignedUrl upload={upload} />
          </div>
        </div>
      ))}
    </div>
  );
}

let SignedUrl = ({ upload }) => {
  let url = useSignedUrl(upload.key);

  return (
    <>
      {url && (
        <img className="object-contain" src={url} data-test="signed-image" />
      )}
    </>
  );
};
