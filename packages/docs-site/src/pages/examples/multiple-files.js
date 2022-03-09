import { useState } from "react";
import { useS3Upload } from "next-s3-upload";

export default function UploadImages() {
  const [urls, setUrls] = useState([]);
  const { uploadToS3 } = useS3Upload();

  const handleFilesChange = async ({ target }) => {
    const files = Array.from(target.files);

    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      const { url } = await uploadToS3(file);

      setUrls(current => [...current, url]);
    }
  };

  return (
    <div>
      <input
        type="file"
        name="file"
        multiple={true}
        data-test="file-input"
        onChange={handleFilesChange}
      />

      <div className="mt-6">
        {urls.map((url, index) => (
          <div key={url} className="flex items-center w-full mt-2 space-x-6">
            <div className="w-10 text-center">#{index}</div>
            <div>
              <img
                src={url}
                data-test={`image-${index}`}
                className="object-cover w-12 h-12"
              />
            </div>
            <div className="text-sm text-gray-500">{url}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
