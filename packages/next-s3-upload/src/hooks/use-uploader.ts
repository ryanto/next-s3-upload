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

// Outdated options we no longer want support.
type OldOptions = {
  endpoint: string;
};

type Strategy = 'presigned' | 'aws-sdk';

export type Uploader<P = any> = (
  file: File,
  params: P,
  eventHandlers: {
    onProgress: (uploaded: number) => void;
  }
) => Promise<UploadResult>;

export const useUploader = (
  strategy: Strategy,
  uploader: Uploader,
  oldOptions?: OldOptions
) => {
  let {
    addFile,
    updateFileProgress,
    FileInput,
    openFileDialog,
    files,
    resetFiles,
  } = useUploadFiles();

  let uploadToS3 = async (file: File, options: UploadToS3Options = {}) => {
    // combine old options and new options. remove after 1.0
    if (oldOptions?.endpoint) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          '[Next S3 Upload] The `endpoint` option has been replaced by `endpoint.request.url`. For more information see: https://next-s3-upload.codingvalue.com/changes/endpoint'
        );
      }

      if (options.endpoint) {
        options.endpoint.request.url = oldOptions.endpoint;
      } else {
        options.endpoint = {
          request: {
            url: oldOptions.endpoint,
          },
        };
      }
    }

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
  strategy: Strategy,
  file: File,
  requestOptions?: RequestOptions
) => {
  let additionalBody = requestOptions?.body ?? {};
  let additionalHeaders = requestOptions?.headers ?? {};
  let apiRouteUrl = requestOptions?.url ?? '/api/s3-upload';

  let body = {
    filename: file.name,
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
