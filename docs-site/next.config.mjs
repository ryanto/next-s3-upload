import nextMdx from '@next/mdx';
import { syntaxHighlighting } from './src/remark/syntax-highlighting.mjs';
import { layout } from './src/remark/layout.mjs';
import { images } from './src/remark/images.mjs';
import { links } from './src/remark/links.mjs';
import { toc } from './src/remark/toc.mjs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

let withMDX = nextMdx({
  options: {
    remarkPlugins: [toc, syntaxHighlighting, images, links, layout],
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
