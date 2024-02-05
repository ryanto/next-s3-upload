import { Uploader, useUploader } from './use-uploader';

let upload: Uploader = async (file, params, { onProgress }) => {
  let { url, key, bucket, region, endpoint, fields } = params;
  let form = new FormData();
  Object.keys(fields).forEach((key) => form.append(key, fields[key]));
  form.append('file', file)

  await new Promise<void>((resolve, reject) => {
    let xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (event: ProgressEvent) => {
      onProgress(event.loaded);
    };

    xhr.open('POST', url, true);

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject();
        }
      }
    };

    xhr.send(form);
  });

  let resultUrl = endpoint
    ? `${endpoint}/${bucket}/${key}`
    : `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

  return {
    url: resultUrl,
    bucket,
    key,
  };
};

export const usePresignedPostUpload = () => {
  let hook = useUploader('presigned-post', upload);
  return hook;
};
