import { visit } from 'unist-util-visit';
import { addDefaultImport } from './helpers.js';
import sizeOf from 'image-size';

let nextPublic = `${process.cwd()}/public/`;

export const images = () => {
  return tree => {
    let Image = addDefaultImport(tree, 'next/image', 'Image');

    visit(tree, 'image', node => {
      if (node.url.startsWith('/')) {
        let { height, width } = sizeOf(`${nextPublic}/${node.url}`);
        node.type = 'jsx';
        node.value = `<${Image} 
          src="${node.url}"
          alt="${node.alt}"
          height={${height}}
          width={${width}}
        />`;
      }
    });
  };
};
