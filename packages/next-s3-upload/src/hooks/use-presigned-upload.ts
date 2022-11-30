import { Uploader, useUploader } from './use-uploader';

let upload: Uploader = async (file, params, { onProgress }) => {
  let { presignedPost, key, bucket, region } = params;
  let formData = new FormData();

  Object.entries({ ...presignedPost.fields, file }).forEach(
    ([field, value]) => {
      formData.append(field, value as string | Blob);
    }
  );

  await new Promise<void>((resolve, reject) => {
    let xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (event: ProgressEvent) => {
      onProgress(event.loaded);
    };

    xhr.open('POST', presignedPost.url, true);

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 || xhr.status < 300) {
          resolve();
        } else {
          reject();
        }
      }
    };

    xhr.send(formData);
  });

  let url = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

  return {
    url,
    bucket,
    key,
  };
};

export const usePresignedUpload = () => {
  let hook = useUploader('presigned', upload);
  return hook;
};
