import find from 'unist-util-find';
import { is } from 'vfile-is';
import { addDefaultImport } from './helpers.js';

export const withLayout = () => {
  return (tree, file) => {
    let isSnippet = is(file, '**/snippets/**/*.mdx');
    let hasDefaultExport = find(tree, { type: 'export', default: true });
    let addLayout = !isSnippet && !hasDefaultExport;

    if (addLayout) {
      let layout = addDefaultImport(tree, '@/layouts/docs', 'DocsLayout');
      let toc =
        tree.data && tree.data.tableOfContents ? tree.data.tableOfContents : [];

      let layoutJsx = `<${layout} tableOfContents={${JSON.stringify(
        toc
      )}} {...props} />`;

      tree.children.push({
        type: 'export',
        default: true,
        value: `export default function WithLayout(props) { return (${layoutJsx}); };`,
      });
    }
  };
};
