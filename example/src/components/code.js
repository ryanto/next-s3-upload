export const Code = ({ language, html }) => {
  return (
    <div className="overflow-auto">
      <pre className={`language-${language} min-w-full float-left py-6 my-0`}>
        <code
          className={`language-`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </pre>
    </div>
  );
};
