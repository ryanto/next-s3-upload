import { visit } from 'unist-util-visit';
import { addImport } from './helpers.js';

export const toc = () => {
  return tree => {
    let Heading = addImport(tree, '@/components/heading', 'Heading');

    let toc = { children: [] };

    visit(tree, { type: 'heading' }, node => {
      node.type = 'jsx';
      node.value = `<${Heading} level="${node.depth}">${title(
        node
      )}</${Heading}>`;

      let list = listForDepth(toc, node.depth);

      if (list) {
        list.push({ title: title(node), children: [] });
      }
    });

    tree.data = tree.data || {};
    tree.data.tableOfContents = toc.children;
  };
};

let title = node => node.children.map(({ value }) => value).join('');

let listForDepth = (node, depth) => {
  if (depth === 1) {
    return node.children;
  } else {
    let lastChild = node.children[node.children.length - 1];
    return listForDepth(lastChild, depth - 1);
  }
};
