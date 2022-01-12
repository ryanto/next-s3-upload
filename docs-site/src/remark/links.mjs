import { visit } from 'unist-util-visit';
import { addDefaultImport } from './helpers.js';

export const links = () => {
  return tree => {
    let Link = addDefaultImport(tree, 'next/link', 'Link');

    function walk(root) {
      if (!root.children) return;
      let i = 0;
      while (i < root.children.length) {
        let node = root.children[i];
        if (node.type === 'link' && node.url.startsWith('/')) {
          root.children = [
            ...root.children.slice(0, i),
            {
              type: 'jsx',
              value: `<${Link} href="${node.url}" passHref><a>`,
            },
            ...node.children,
            { type: 'jsx', value: `</a></${Link}>` },
            ...root.children.slice(i + 1),
          ];
          i += node.children.length + 2;
        } else {
          i += 1;
        }
        walk(node);
      }
    }

    walk(tree);
  };
};
