import React from 'react';
import { FileInput } from '../components/file-input';
import { useRef, useState } from 'react';

type TrackedFile = {
  file: File;
  progress: number;
  uploaded: number;
  size: number;
};

export const useUploadFiles = () => {
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

  let updateFileProgress = (file: File, uploaded: number) => {
    setFiles(files =>
      files.map(trackedFile =>
        trackedFile.file === file
          ? {
              file,
              uploaded,
              size: file.size,
              progress: file.size ? (uploaded / file.size) * 100 : 0,
            }
          : trackedFile
      )
    );
  };

  let addFile = (file: File) => {
    setFiles(files => [
      ...files,
      { file, progress: 0, uploaded: 0, size: file.size },
    ]);
  };

  return {
    FileInput: (props: any) => (
      <FileInput {...props} ref={ref} style={{ display: 'none' }} />
    ),
    openFileDialog,
    files,
    addFile,
    updateFileProgress,
    resetFiles,
  };
};
