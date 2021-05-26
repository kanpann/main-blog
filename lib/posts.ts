import { GrayMatterFile } from 'gray-matter'
import { getByteLength, removeHtml, substrToByte } from './common-util'
import * as util from './posts-util'
import { Post } from './types'

const getPostByFileName = async (fileName: string): Promise<Post> => {
  const id: string = fileName
    .replace(/\.md$/, '')
    .substr(fileName.lastIndexOf('/'), fileName.length)

  const postData: GrayMatterFile<string> = util.getPostData(fileName)
  const { title, date, image, category, tags } = postData.data

  const content: string = postData.content
  let excerpt: string = substrToByte(removeHtml(await util.getContents(content)), 300)
  excerpt += (getByteLength(excerpt) > 300 ? '...' : '')

  return {
    id,
    title: title,
    content: content,
    excerpt: excerpt,
    tags: tags !== undefined ? tags : [],
    category: category,
    date: date,
    image: image,
  }
}

export const getSortedPostsData = async (): Promise<Post[]> => {
  const fileNames: string[] = util.getFileNames()
  const posts: Array<Post> = new Array()

  for (let i = 0; i < fileNames.length; i++) {
    const fileName = fileNames[i]
    const post: Post = await getPostByFileName(fileName)
    posts.push(post)
  }
  return posts.sort((a: Post, b: Post) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

export const getAllPostIds = () => {
  const fileNames: string[] = util.getFileNames()
  return fileNames.map((fileName: string) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, '').substr(fileName.lastIndexOf('/') + 1, fileName.length),
      },
    }
  })
}

export const getPostData = async (id: string): Promise<Post> => {
  const fileName: string = `${id}.md`

  const { title, date, image, tags, category } = util.getPostData(fileName).data
  const content: string = util.getPostData(fileName).content
  const { contents, toc } = await util.getContentsAndToc(content)

  return {
    id,
    toc: toc,
    content: contents,
    category: category,
    tags: tags !== undefined ? tags : [],
    title: title,
    date: date,
    image: image,
  }
}

export const getAbout = async (): Promise<string> => {
  const content: string = util.getPostData('About.md', process.cwd()).content

  return await util.getContents(content)
}
