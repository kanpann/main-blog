import fs from 'fs'
import path from 'path'
import matter, { GrayMatterFile } from 'gray-matter'
import { Post } from './posts'
import { getByteLength, substrToByte } from './common-util'
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
})

const postsDirectory: string = path.join(process.cwd(), 'posts')

export const getFileNames = (): string[] => {
  const arr = []
  generateComponents(postsDirectory, arr)
  return arr.map((fullPath: string) => fullPath.substr(fullPath.lastIndexOf('\\') + 1))
}
function generateComponents(dir: string, arr: string[]) {
  fs.readdirSync(dir).forEach((file: string) => {
    const fullPath = path.join(dir, file)

    if (fs.lstatSync(fullPath).isDirectory()) {
      generateComponents(fullPath, arr)
    } else {
      arr.push(fullPath)
    }
  })
}

export const getPostData = (fileName: string, dir: string = postsDirectory): GrayMatterFile<string> => {
  const arr = []
  generateComponents(dir, arr)
  const fullPath: string = arr.find((savedFile: string) => savedFile.indexOf(fileName) != -1)!!
  const fileContents: string = fs.readFileSync(fullPath, 'utf8')

  return matter(fileContents)
}
export const getContents = async (content: string): Promise<string> => {
  return md.render(content)
}
export const sort = (posts: Post[]) => {
  return posts.sort((a: Post, b: Post) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}
export const getExcept = (target: string, maxByte: number): string => {
  const except: string = substrToByte(target, maxByte)
  return except + (getByteLength(target) > maxByte ? '...' : '')
}
