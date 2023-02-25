import { useS3Upload } from "next-s3-upload";
import { useState } from "react";

export default function UploadTest() {
  let [imageUrl, setImageUrl] = useState();
  let { FileInput, openFileDialog, uploadToS3 } = useS3Upload();

  let handleFileChange = async file => {
    let { url } = await uploadToS3(file);
    setImageUrl(url);

    let printUrl = url.replace(/^https:\/\//, "https:‎//");

    console.log(
      `%cSuccessfully uploaded to S3!`,
      "background: #15803d; color: white; padding: 8px 12px"
    );
    console.log(
      `%c${printUrl}`,
      "background: #4f46e5; color: white; padding: 8px 12px"
    );
  };

  return (
    <div className="p-6 flex flex-col h-screen">
      <FileInput onChange={handleFileChange} />
      <div>
        <button
          className="bg-indigo-600 text-white rounded px-3 py-2 text-base font-medium shadow-sm"
          onClick={openFileDialog}
        >
          Upload file
        </button>
      </div>
      <div className="pt-8 flex-1 overflow-hidden flex">
        {imageUrl && <img className="object-contain" src={imageUrl} />}
      </div>
    </div>
  );
}
