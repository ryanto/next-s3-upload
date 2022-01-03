import nextMdx from '@next/mdx';
import { withSyntaxHighlighting } from './src/remark/with-syntax-highlighting.mjs';
import { withLayout } from './src/remark/with-layout.mjs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

let withMDX = nextMdx({
  options: {
    remarkPlugins: [withSyntaxHighlighting, withLayout],
  },
});

export default withMDX({
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'mdx'],
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      react: resolve(__dirname, '../node_modules/react/'),
      'react-dom': resolve(__dirname, '../node_modules/react-dom/'),
      'next-s3-upload': resolve(__dirname, '../'),
    };

    return config;
  },
});
