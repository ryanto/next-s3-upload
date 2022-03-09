import React, { ChangeEvent, ReactElement } from 'react';
import { useRef, useState } from 'react';
import { forwardRef } from 'react';
import S3 from 'aws-sdk/clients/s3';

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

type UploadToS3 = (file: File) => Promise<UploadResult>;

type UseS3UploadTools = {
  FileInput: (props: any) => ReactElement<HTMLInputElement>;
  openFileDialog: () => void;
  uploadToS3: UploadToS3;
  files: TrackedFile[];
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

  let endpoint = options.endpoint ?? '/api/s3-upload';

  let uploadToS3: UploadToS3 = async file => {
    let filename = encodeURIComponent(file.name);
    let res = await fetch(`${endpoint}?filename=${filename}`);
    let data = await res.json();

    if (data.error) {
      console.error(data.error);
      throw data.error;
    } else {
      let s3 = new S3({
        accessKeyId: data.token.Credentials.AccessKeyId,
        secretAccessKey: data.token.Credentials.SecretAccessKey,
        sessionToken: data.token.Credentials.SessionToken,
        region: data.region,
      });

      let params = {
        ACL: 'public-read',
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

      let s3Upload = s3.upload(params);

      setFiles(files => [
        ...files,
        { file, progress: 0, uploaded: 0, size: file.size },
      ]);

      s3Upload.on('httpUploadProgress', event => {
        if (event.total) {
          setFiles(files =>
            files.map(trackedFile =>
              trackedFile.file === file
                ? {
                    file,
                    uploaded: event.loaded,
                    size: event.total,
                    progress: (event.loaded / event.total) * 100,
                  }
                : trackedFile
            )
          );
        }
      });

      let uploadResult = await s3Upload.promise();

      return {
        url: uploadResult.Location,
        bucket: uploadResult.Bucket,
        key: uploadResult.Key,
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
  };
};
