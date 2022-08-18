import { useS3Upload } from "next-s3-upload";

export default function UploadTest() {
  let { uploadToS3, files, resetFiles } = useS3Upload();

  let handleFileChange = async ({ target }) => {
    let file = target.files[0];
    await uploadToS3(file);
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
        <div>Uploaded files:</div>
        {files.map((file, index) => (
          <div key={index} data-test={`files-${index}`}>
            File: {file.file.name}{" "}
            <span data-test="progress">({file.progress}%)</span>
          </div>
        ))}
        <div>
          <button onClick={resetFiles} data-test="reset-files">
            Reset files
          </button>
        </div>
      </div>
    </div>
  );
}
