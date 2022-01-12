let Prism = require('prismjs');
let loadLanguages = require('prismjs/components/');
loadLanguages();

let linesMeta = /{([\d,-]+)}/;

module.exports.highlightCode = (code, prismLanguage, meta = '') => {
  let isDiff = prismLanguage.startsWith('diff-');
  let language = isDiff ? prismLanguage.substr(5) : prismLanguage;
  if (linesMeta.test(language)) {
    let parts = language.split('{');
    language = parts[0];
    meta = `{${parts[1]}`;
  }
  let grammar = Prism.languages[isDiff ? 'diff' : language];
  if (!grammar) {
    console.warn(`Unrecognised language: ${prismLanguage}`);
    return Prism.util.encode(code);
  }
  let html = Prism.highlight(code, grammar, prismLanguage);

  return linesMeta.test(meta) ? highlightLines(html, meta) : html;
};

// got this idea from gatsby's remark prism line highlighting.
// it closes any span that wraps multiple lines. this will allow
// us to wrap each line in a line highlighting class
const multilineToken = /<span class="token ([^"]+)">[^<]*\n[^<]*<\/span>/g;

let highlightLines = (html, meta) => {
  const lines = linesMeta
    .exec(meta)[1]
    .split(',')
    .map(group => {
      let [start, end] = group.split('-');
      end = end || start;
      return [parseInt(start, 10), parseInt(end, 10)];
    });

  html = html.replace(multilineToken, (match, token) =>
    match.replace(/\n/g, `</span>\n<span class="token ${token}">`)
  );

  highlights = html.split('\n').map((code, index) => {
    let line = index + 1;
    let shouldHighlight = lines.some(
      ([start, end]) => line >= start && line <= end
    );

    return shouldHighlight
      ? `<div class="line-highlight block bg-sky-500 bg-opacity-20 relative"><div class='bg-sky-500 w-[2px] bg-opacity-50 absolute left-0 h-full'></div>${
          code ? code : '&#8203;'
        }</div>`
      : `${code}\n`;
  });

  return highlights.join('');
};
