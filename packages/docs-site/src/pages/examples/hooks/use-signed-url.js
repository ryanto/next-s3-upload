import { useEffect, useState } from "react";

export let useSignedUrl = (key, config = "aws") => {
  let [url, setUrl] = useState();

  useEffect(() => {
    let f = async () => {
      if (key) {
        let response = await fetch(
          `/api/generate-temporary-url?key=${key}&config=${config}`
        );
        let json = await response.json();
        setUrl(json.temporaryUrl);
      } else {
        setUrl(null);
      }
    };

    f();
  }, [key, config]);

  return url;
};
