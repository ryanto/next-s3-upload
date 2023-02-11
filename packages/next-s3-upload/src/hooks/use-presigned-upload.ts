import { Uploader, useUploader } from './use-uploader';

let upload: Uploader = async (file, params, { onProgress }) => {
  let { url, key, bucket, region, endpoint } = params;
  let buffer = await file.arrayBuffer();

  await new Promise<void>((resolve, reject) => {
    let xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (event: ProgressEvent) => {
      onProgress(event.loaded);
    };

    xhr.open('PUT', url, true);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.setRequestHeader('Cache-Control', 'max-age=630720000');

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject();
        }
      }
    };

    xhr.send(buffer);
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

export const usePresignedUpload = () => {
  let hook = useUploader('presigned', upload);
  return hook;
};
