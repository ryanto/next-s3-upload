export const Code = ({ language, html, source }) => {
  let isPage = source === "page";

  return (
    <div className={`overflow-auto ${isPage ? "-mx-4 md:mx-0" : ""}`}>
      <pre className={`language-${language} min-w-full py-6 my-0`}>
        <code
          className={`language-${language} !text-white`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </pre>
    </div>
  );
};
