import React, { ChangeEvent, InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';

type FileInputProps = {
  onChange: (
    file: File | undefined,
    event: ChangeEvent<HTMLInputElement>
  ) => void;
} & InputHTMLAttributes<HTMLInputElement>;

export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
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
