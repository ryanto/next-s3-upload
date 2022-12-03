import { useUploadFiles } from './use-upload-files';

type UploadResult = {
  url: string;
  bucket: string;
  key: string;
};

type RequestOptions = {
  url?: string;
  body?: Record<string, any>;
  headers?: HeadersInit;
};

type UploadToS3Options = {
  endpoint?: {
    request: RequestOptions;
  };
};

type Strategy = 'presigned' | 'aws-sdk';

export type Uploader = (
  file: File,
  params: Record<string, any>,
  eventHandlers: {
    onProgress: (uploaded: number) => void;
  }
) => Promise<UploadResult>;

export const useUploader = (strategy: Strategy, uploader: Uploader) => {
  let {
    addFile,
    updateFileProgress,
    FileInput,
    openFileDialog,
    files,
    resetFiles,
  } = useUploadFiles();

  let uploadToS3 = async (file: File, options: UploadToS3Options = {}) => {
    let params = await getUploadParams(
      strategy,
      file,
      options.endpoint?.request
    );

    if (params.error) {
      console.error(params.error);
      throw params.error;
    }

    addFile(file);

    let result = await uploader(file, params, {
      onProgress: uploaded => updateFileProgress(file, uploaded),
    });

    return result;
  };

  return {
    FileInput,
    openFileDialog,
    uploadToS3,
    files,
    resetFiles,
  };
};

let getUploadParams = async (
  strategy: 'presigned' | 'aws-sdk',
  file: File,
  requestOptions?: RequestOptions
) => {
  let filename = encodeURIComponent(file.name);

  let additionalBody = requestOptions?.body ?? {};
  let additionalHeaders = requestOptions?.headers ?? {};
  let apiRouteUrl = requestOptions?.url ?? '/api/s3-upload';

  let body = {
    filename,
    filetype: file.type,
    _nextS3: {
      strategy,
    },
    ...additionalBody,
  };

  let headers = {
    ...additionalHeaders,
    'Content-Type': 'application/json',
  };

  let res = await fetch(apiRouteUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  return await res.json();
};
