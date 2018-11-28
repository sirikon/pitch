const fs = require('fs');
const yaml = require('js-yaml');
const unified = require('unified');
const markdown = require('remark-parse');
const frontmatter = require('remark-frontmatter');
const html = require('remark-html');

const markdownProcessor = unified()
    .use(markdown)
    .use(frontmatter, ['yaml'])
    .use(html);

function parseMarkdown(content) {
    let meta = {};

    const ast = markdownProcessor.runSync(markdownProcessor.parse(content));
    
    if (ast.children.length > 0 && ast.children[0].type === 'yaml') {
        meta = yaml.safeLoad(ast.children[0].value);
    }

    const html = markdownProcessor.stringify(ast).trim();

    return { meta, html };
}

module.exports = {
    fileExtension: '.md',
    read(filePath) {
        const content = fs.readFileSync(filePath, { encoding: 'utf8' });
        const document = parseMarkdown(content);
        return {
            text: content,
            html: document.html,
            meta: document.meta
        };
    }
};
