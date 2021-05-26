import hljs from 'highlight.js'

const md = require('markdown-it')({
    html: true,
    xhtmlOut: false,
    breaks: false,
    langPrefix: 'language-',
    linkify: true,
    typographer: true,
    quotes: '“”‘’',
    highlight: function (str: string | HighlightOptions, lang: string) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return '<pre class="hljs"><code>' + hljs.highlight(lang, str, true).value + '</code></pre>'
        } catch (__) {}
      }
      return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>'
    },
}).use(require('markdown-it-toc'))

export default md