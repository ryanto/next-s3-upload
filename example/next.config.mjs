import nextMdx from '@next/mdx';
import { withSyntaxHighlighting } from './src/remark/with-syntax-highlighting.mjs';
import { withLayout } from './src/remark/with-layout.mjs';

let withMDX = nextMdx({
  options: {
    remarkPlugins: [withSyntaxHighlighting, withLayout],
  },
});

export default withMDX({
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'mdx'],
});
