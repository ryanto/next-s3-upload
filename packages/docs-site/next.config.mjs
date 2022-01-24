import nextMdx from "@next/mdx";
import { syntaxHighlighting } from "./src/remark/syntax-highlighting.mjs";
import { layout } from "./src/remark/layout.mjs";
import { images } from "./src/remark/images.mjs";
import { links } from "./src/remark/links.mjs";
import { toc } from "./src/remark/toc.mjs";

let withMDX = nextMdx({
  options: {
    remarkPlugins: [toc, syntaxHighlighting, images, links, layout]
  }
});

export default withMDX({
  reactStrictMode: true,
  pageExtensions: ["js", "jsx", "mdx"]
});
