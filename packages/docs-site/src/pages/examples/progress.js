import { useS3Upload } from "next-s3-upload";
import { useState } from "react";

export default function UploadTest() {
  let [imageUrl, setImageUrl] = useState();
  let { uploadToS3, files } = useS3Upload();

  let handleFileChange = async event => {
    let file = event.target.files[0];
    let { url } = await uploadToS3(file);
    setImageUrl(url);
  };

  return (
    <div className="flex flex-col h-screen p-6">
      <input
        onChange={handleFileChange}
        type="file"
        data-test="file-input"
        className="block"
      />
      <div className="pt-8">
        {files[0]?.progress ? (
          <span data-test="progress">Progress {files[0]?.progress}%</span>
        ) : (
          <span>Upload has not started</span>
        )}
      </div>
      <div className="flex flex-1 pt-8 overflow-hidden">
        {imageUrl && (
          <img className="object-contain" src={imageUrl} data-test="image" />
        )}
      </div>
    </div>
  );
}
