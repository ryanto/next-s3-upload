import React, { ChangeEvent } from 'react';
import { useRef, useState } from 'react';
import { forwardRef } from 'react';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

type FileInputProps = {
  onChange: (
    file: File | undefined,
    event: ChangeEvent<HTMLInputElement>
  ) => void;
  [index: string]: any; // Indexer to spread props
};

let FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  ({ onChange = () => { }, ...restOfProps }, forwardedRef) => {
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

export const useS3Upload = () => {
  let ref = useRef<HTMLInputElement>();
  let [files, setFiles] = useState<TrackedFile[]>([]);

  let openFileDialog = () => {
    if (ref.current) {
      ref.current.value = '';
      ref.current?.click();
    }
  };

  let uploadToS3 = async (file: File) => {
    let filename = encodeURIComponent(file.name);
    let res = await fetch(`/api/s3-upload?filename=${filename}`);
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

      let s3Upload = new Upload({
        client,
        params
      });

      setFiles(files => [
        ...files,
        { file, progress: 0, uploaded: 0, size: file.size },
      ]);

      s3Upload.on('httpUploadProgress', (event: any) => {
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

      await s3Upload.done();

      const location = `https://s3.amazonaws.com/${data.bucket}/${data.key}`;

      return {
        url: location,
        bucket: data.bucket,
        key: data.key,
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
