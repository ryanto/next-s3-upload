export const Heading = ({ children, slug, level }) => {
  let Tag = `h${level}`;
  return <Tag id={slug}>{children}</Tag>;
};
