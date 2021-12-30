import { visit } from 'unist-util-visit';
import { addImport } from './helpers.js';
import { highlightCode } from '../lib/highlight.js';

export const withSyntaxHighlighting = () => {
  return tree => {
    let Code = addImport(tree, '@/components/code', 'Code');

    visit(tree, 'code', node => {
      if (node.lang !== null) {
        let html = highlightCode(node.value, node.lang, node.meta);
        let safeHtml = html.replace(/[`$\\]/g, '\\$&');

        node.type = 'jsx';
        node.value = `<${Code} language="${node.lang}" html={\`${safeHtml}\`} />`;
      }
    });
  };
};
