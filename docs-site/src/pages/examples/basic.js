import { useS3Upload } from "next-s3-upload";
import { useState } from "react";

export default function UploadTest() {
  let [imageUrl, setImageUrl] = useState();
  let { uploadToS3 } = useS3Upload();

  let handleSubmit = async event => {
    event.preventDefault();
    let file = event.target.image.files[0];
    let { url } = await uploadToS3(file);
    setImageUrl(url);
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
        <button data-test="start-upload" className="inline-block bg-blue-600">
          Start upload
        </button>
      </form>
      <div className="flex flex-1 pt-8 overflow-hidden">
        {imageUrl && (
          <img className="object-contain" src={imageUrl} data-test="image" />
        )}
      </div>
    </div>
  );
}
