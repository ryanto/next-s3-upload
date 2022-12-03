import { useState } from "react";
import { useS3Upload, getImageData } from "next-s3-upload";
import Image from "next/image";

export default function UploadTest() {
  let [imageUrl, setImageUrl] = useState();
  let [height, setHeight] = useState();
  let [width, setWidth] = useState();
  let { uploadToS3 } = useS3Upload();

  const handleSubmit = async event => {
    event.preventDefault();
    let file = event.target.image.files[0];
    let { url } = await uploadToS3(file);
    let { height, width } = await getImageData(file);
    setWidth(width);
    setHeight(height);
    setImageUrl(url);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          name="image"
          data-test="file-input"
          className="block"
        />

        <button>Start upload</button>
      </form>

      {imageUrl && (
        <div className="flex space-x-6">
          <div className="w-1/2">
            <Image
              src={imageUrl}
              width={width}
              height={height}
              data-test="image"
            />
          </div>
          <div className="w-1/2">
            <div className="mt-2 text-sm text-gray-500">URL:</div>
            <div>{imageUrl}</div>

            <div className="mt-2 text-sm text-gray-500">Height</div>
            <div data-test="height">{height}</div>

            <div className="mt-2 text-sm text-gray-500">Width</div>
            <div data-test="width">{width}</div>
          </div>
        </div>
      )}
    </div>
  );
}
