interface ImageData {
  height: number | undefined;
  width: number | undefined;
}

export const getImageData = (file: File | Blob): Promise<ImageData> => {
  return new Promise(resolve => {
    if (file.type.split('/')?.[0] === 'image') {
      let img = new Image();
      let objectUrl = URL.createObjectURL(file);
      img.onload = (event: Event) => {
        let image = event.target as HTMLImageElement;
        resolve({ height: image.height, width: image.width });
        URL.revokeObjectURL(objectUrl);
      };
      img.src = objectUrl;
    } else {
      resolve({ height: undefined, width: undefined });
    }
  });
};
