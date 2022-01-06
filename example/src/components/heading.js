export const Heading = ({ children, level }) => {
  let Tag = `h${level}`;
  return <Tag>{children}</Tag>;
};
