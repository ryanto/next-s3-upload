import find from 'unist-util-find';
import { addDefaultImport } from './helpers.js';

export const withLayout = () => {
  return tree => {
    let layout = addDefaultImport(tree, '@/layouts/docs', 'DocsLayout');

    let defaultExport = find(tree, { type: 'export', default: true });
    let toc =
      tree.data && tree.data.tableOfContents ? tree.data.tableOfContents : [];

    if (!defaultExport) {
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
