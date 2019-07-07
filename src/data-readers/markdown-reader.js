const fs = require('fs');
const yaml = require('js-yaml');
const unified = require('unified');
const markdown = require('remark-parse');
const frontmatter = require('remark-frontmatter');
const html = require('remark-html');
const highlight = require('remark-highlight.js');

const debug = require('../debug');

const markdownProcessor = unified()
	.use(markdown)
	.use(frontmatter, ['yaml'])
	.use(highlight)
	.use(html);

function fixHtmlEOL(string) {
	if (process.platform !== 'win32') return string;
	return string.replace(/\n/g, '\r\n');
}

class MarkdownResult {
	constructor(filePath) {
		this.filePath = filePath;

		this.internalContent = null;
		this.ast = null;
	}

	getContent() {
		if (!this.internalContent) {
			debug.track('read_file_markdown', this.filePath);
			this.internalContent = fs.readFileSync(this.filePath, { encoding: 'utf8' });
		}
		return this.internalContent;
	}

	getAST() {
		if (!this.ast) {
			this.ast = markdownProcessor.runSync(markdownProcessor.parse(this.content));
		}
		return this.ast;
	}

	get meta() {
		debug.track('request_markdown_meta', this.filePath);
		const ast = this.getAST();
		let meta = {};
		if (ast.children.length > 0 && ast.children[0].type === 'yaml') {
			meta = yaml.safeLoad(ast.children[0].value);
		}
		return meta;
	}

	get html() {
		debug.track('request_markdown_html', this.filePath);
		return fixHtmlEOL(markdownProcessor.stringify(this.getAST()).trim());
	}

	get content() {
		debug.track('request_markdown_content', this.filePath);
		return this.getContent();
	}
}

module.exports = {
	fileExtension: '.md',
	read(filePath) {
		return new MarkdownResult(filePath);
	}
};
