import { useS3Upload } from 'next-s3-upload';
import { useState } from 'react';

export default function UploadTest() {
  let [imageUrl, setImageUrl] = useState();
  let { FileInput, openFileDialog, uploadToS3 } = useS3Upload();

  let handleFileChange = async file => {
    let { url } = await uploadToS3(file);
    setImageUrl(url);
    console.log('Successfully uploaded to S3!', url);
  };

  return (
    <div className="py-3 px-4">
      <FileInput onChange={handleFileChange} />

      <button
        className="bg-indigo-600 text-white rounded px-3 py-2 text-base font-medium shadow-sm"
        onClick={openFileDialog}
      >
        Upload file
      </button>

      {imageUrl && <img src={imageUrl} />}
    </div>
  );
}
