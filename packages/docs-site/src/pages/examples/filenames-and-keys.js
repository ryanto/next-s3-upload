import { useState } from "react";
import { useS3Upload } from "next-s3-upload";

export default function UploadTest() {
  let [imageUrl, setImageUrl] = useState();
  let [key, setKey] = useState();
  let { uploadToS3 } = useS3Upload();

  const handleFileChange = async ({ target }) => {
    let file = target.files[0];
    let { url, key } = await uploadToS3(file);
    setImageUrl(url);
    setKey(key);
  };

  return (
    <div>
      <input
        type="file"
        name="file"
        multiple={true}
        data-test="file-input"
        onChange={handleFileChange}
      />

      {imageUrl && (
        <div className="flex flex-col space-y-6">
          <div className="w-1/3">
            <img className="object-contain" src={imageUrl} data-test="image" />
          </div>
          <div>
            <div className="mt-2 text-sm text-gray-500">URL:</div>
            <div data-test="url">{imageUrl}</div>
          </div>
          <div>
            <div className="mt-2 text-sm text-gray-500">Key:</div>
            <div data-test="key">{key}</div>
          </div>
        </div>
      )}
    </div>
  );
}
