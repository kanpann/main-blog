import fs from 'fs'
import path from 'path'
import matter, { GrayMatterFile } from 'gray-matter'
import md from './markdown-util'
import { RenderResult } from '../types/post'

const postsDirectory: string = path.join(process.cwd(), 'posts')

const generateComponents = (dir: string): string[] => {
  let arr: string[] = []
  fs.readdirSync(dir).forEach((file: string) => {
    const fullPath: string = path.join(dir, file)

    if (fs.lstatSync(fullPath).isDirectory()) {
      arr = arr.concat(generateComponents(fullPath))
    } else {
      arr.push(fullPath)
    }
  })
  return arr
}

export const getFileNames = (): string[] => {
  return generateComponents(postsDirectory).map((fullPath: string) =>
    fullPath.substr(fullPath.lastIndexOf('\\') + 1),
  )
}

export const getPostData = (
  fileName: string,
  dir: string = postsDirectory,
): GrayMatterFile<string> => {
  const fullPath: string = generateComponents(dir).find(
    (savedFile: string) => savedFile.indexOf(fileName) != -1,
  )!!
  const fileContents: string = fs.readFileSync(fullPath, 'utf8')

  return matter(fileContents)
}
export const getContents = async (content: string): Promise<string> => {
  return md.render(content)
}

export const getContentsAndToc = async (content: string): Promise<RenderResult> => {
  const parserResult: string = md
    .render('@[toc](목차) \n@@Feel Good!@@' + content)
    .replace('<p><h3>', '<div class="toc"><h3>')
    .replace('@@Feel Good!@@', '</div>@@Feel Good!@@')

  const [toc, contents] = parserResult.split('@@Feel Good!@@')
  return {
    toc: toc.length == 35 ? '' : toc,
    contents: contents,
  }
}
