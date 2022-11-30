import React, { ChangeEvent, ReactElement } from 'react';
import { useRef, useState } from 'react';
import { forwardRef } from 'react';
import {
  CompleteMultipartUploadCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

type FileInputProps = {
  onChange: (
    file: File | undefined,
    event: ChangeEvent<HTMLInputElement>
  ) => void;
  [index: string]: any; // Indexer to spread props
};

let FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  ({ onChange = () => {}, ...restOfProps }, forwardedRef) => {
    let handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
      let file = event.target?.files?.[0];
      onChange(file, event);
    };

    return (
      <input
        onChange={handleChange}
        {...restOfProps}
        ref={forwardedRef}
        type="file"
      />
    );
  }
);

type TrackedFile = {
  file: File;
  progress: number;
  uploaded: number;
  size: number;
};

type UseS3UploadOptions = {
  endpoint?: string;
};

type UploadResult = {
  url: string;
  bucket: string;
  key: string;
};

type RequestOptions = {
  body: Record<string, any>;
  headers: HeadersInit;
};

type EndpointOptions = {
  request: RequestOptions;
};

type UploadToS3Options = {
  endpoint?: EndpointOptions;
};

type UploadToS3 = (
  file: File,
  options?: UploadToS3Options
) => Promise<UploadResult>;

type UseS3UploadTools = {
  FileInput: (props: any) => ReactElement<HTMLInputElement>;
  openFileDialog: () => void;
  uploadToS3: UploadToS3;
  files: TrackedFile[];
  resetFiles: () => void;
};

type UseS3Upload = (options?: UseS3UploadOptions) => UseS3UploadTools;

export const useS3Upload: UseS3Upload = (options = {}) => {
  let ref = useRef<HTMLInputElement>();
  let [files, setFiles] = useState<TrackedFile[]>([]);

  let openFileDialog = () => {
    if (ref.current) {
      ref.current.value = '';
      ref.current?.click();
    }
  };

  let resetFiles = () => {
    setFiles([]);
  };

  let endpoint = options.endpoint ?? '/api/s3-upload';

  let uploadToS3: UploadToS3 = async (file, options = {}) => {
    let filename = file.name;

    let requestExtras = options?.endpoint?.request ?? {
      headers: {},
      body: {},
    };

    let body = {
      filename,
      _nextS3: {
        strategy: 'aws-sdk',
      },
      ...requestExtras.body,
    };

    let headers = {
      ...requestExtras.headers,
      'Content-Type': 'application/json',
    };

    let res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    let data = await res.json();

    if (data.error) {
      console.error(data.error);
      throw data.error;
    } else {
      let client = new S3Client({
        credentials: {
          accessKeyId: data.token.Credentials.AccessKeyId,
          secretAccessKey: data.token.Credentials.SecretAccessKey,
          sessionToken: data.token.Credentials.SessionToken,
        },
        region: data.region,
      });

      let params = {
        Bucket: data.bucket,
        Key: data.key,
        Body: file,
        CacheControl: 'max-age=630720000, public',
        ContentType: file.type,
      };

      // at some point make this configurable
      // let uploadOptions = {
      //   partSize: 100 * 1024 * 1024,
      //   queueSize: 1,
      // };

      let s3Upload = new Upload({
        client,
        params,
      });

      setFiles(files => [
        ...files,
        { file, progress: 0, uploaded: 0, size: file.size },
      ]);

      s3Upload.on('httpUploadProgress', progress => {
        let uploaded = progress.loaded ?? 0;
        let size = progress.total ?? 0;

        if (uploaded) {
          setFiles(files =>
            files.map(trackedFile =>
              trackedFile.file === file
                ? {
                    file,
                    uploaded,
                    size,
                    progress: size ? (uploaded / size) * 100 : 0,
                  }
                : trackedFile
            )
          );
        }
      });

      let uploadResult = (await s3Upload.done()) as CompleteMultipartUploadCommandOutput;

      let url =
        uploadResult.Bucket && uploadResult.Key
          ? `https://${uploadResult.Bucket}.s3.${data.region}.amazonaws.com/${uploadResult.Key}`
          : '';

      return {
        url,
        bucket: uploadResult.Bucket ?? '',
        key: uploadResult.Key ?? '',
      };
    }
  };

  return {
    FileInput: (props: any) => (
      <FileInput {...props} ref={ref} style={{ display: 'none' }} />
    ),
    openFileDialog,
    uploadToS3,
    files,
    resetFiles,
  };
};
