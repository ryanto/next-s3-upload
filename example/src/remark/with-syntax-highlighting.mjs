import { visit } from 'unist-util-visit';
import { addImport } from './helpers.js';
import { highlightCode } from '../lib/highlight.js';
import { is } from 'vfile-is';

export const withSyntaxHighlighting = () => {
  return (tree, file) => {
    let Code = addImport(tree, '@/components/code', 'Code');
    let isPage = is(file, '**/pages/**/*.mdx');
    let isSnippet = is(file, '**/snippets/**/*.mdx');

    let source = isPage ? 'page' : isSnippet ? 'snippet' : 'unknown';

    visit(tree, 'code', node => {
      if (node.lang !== null) {
        let html = highlightCode(node.value, node.lang, node.meta);
        let safeHtml = html.replace(/[`$\\]/g, '\\$&');

        node.type = 'jsx';
        node.value = `<${Code} language="${node.lang}" html={\`${safeHtml}\`} source="${source}" />`;
      }
    });
  };
};
