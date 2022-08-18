import { useEffect, useState } from "react";
import { useS3Upload } from "next-s3-upload";

export default function UploadTest() {
  let [isPrivate, setIsPrivate] = useState(false);
  let [uploads, setUploads] = useState([]);

  let { uploadToS3 } = useS3Upload({
    endpoint: "/api/private-uploads"
  });

  const handleFileChange = async ({ target }) => {
    let file = target.files[0];

    let { key, url } = await uploadToS3(file, {
      endpoint: {
        request: {
          body: {
            isPrivate
          }
        }
      }
    });

    setUploads(current => [...current, { key, url, isPrivate }]);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div>
        Private:{" "}
        <input
          type="checkbox"
          name="isPrivate"
          data-test="is-private-input"
          checked={isPrivate}
          onChange={e => setIsPrivate(e.target.value)}
        />
      </div>

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
            <div className="mt-2 text-sm text-gray-500">Access:</div>
            <div data-test="access">
              {upload.isPrivate ? "PRIVATE" : "PUBLIC"}
            </div>
          </div>
          <div className="w-1/4">
            <img
              className="object-contain"
              src={upload.url}
              data-test="image"
            />
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

let useSignedUrl = key => {
  let [url, setUrl] = useState();

  useEffect(() => {
    let f = async () => {
      let response = await fetch(`/api/get-signed-url?key=${key}`);
      let json = await response.json();
      setUrl(json.url);
    };

    f();
  }, [key]);

  return url;
};
