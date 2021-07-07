import { GrayMatterFile } from 'gray-matter'
import { getByteLength, removeHtml, substrToByte } from './common-util'
import * as util from './posts-util'
import { Post } from '../types/post'
import { Category } from '../site.config'
import { CategoryType } from '../types/category'
import { CategoryPath, IdPath, TagPath } from '../types/path'

const getPostByFileName = async (fileName: string): Promise<Post> => {
  const id: string = fileName
    .replace(/\.md$/, '')
    .substr(fileName.lastIndexOf('/'), fileName.length)

  const postData: GrayMatterFile<string> = util.getPostData(fileName)
  const { title, date, image, category, tags } = postData.data

  const content: string = postData.content
  let excerpt: string = substrToByte(removeHtml(await util.getContents(content)), 300)
  excerpt += getByteLength(excerpt) > 300 ? '...' : ''

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
    const fileName: string = fileNames[i]
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

export const getAllPostIds = (): IdPath[] => {
  const fileNames: string[] = util.getFileNames()
  return fileNames.map((fileName: string) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, '').substr(fileName.lastIndexOf('/') + 1, fileName.length),
      },
    }
  })
}
export const getAllTags = async (): Promise<TagPath[]> => {
  const postData: Post[] = await getSortedPostsData()

  const set: Set<string> = new Set()
  postData.map((post: Post) => {
    if (post.tags) {
      post.tags.map((tag: string) => {
        set.add(tag)
      })
    }
  })
  const arr: string[] = Array.from(set)

  return arr.map((tag: string) => {
    return {
      params: {
        tag: tag,
      },
    }
  })
}

export const getAllCategorys = async (): Promise<CategoryPath[]> => {
  const postData: Post[] = await getSortedPostsData()

  const set: Set<string> = new Set()
  postData.map((post: Post) => {
    if (post.category) {
      set.add(post.category)
    }
  })
  const arr: string[] = Array.from(set)

  return arr.map((category: string) => {
    return {
      params: {
        category: category,
      },
    }
  })
}

export const findPostDataById = async (id: string): Promise<Post> => {
  const fileName: string = `${id}.md`

  const { title, date, image, tags, category, isToc = true } = util.getPostData(fileName).data
  const content: string = util.getPostData(fileName).content
  const { contents, toc } = await util.getContentsAndToc(content)

  return {
    id,
    toc: isToc ? toc : '',
    content: contents,
    category: category,
    tags: tags !== undefined ? tags : [],
    title: title,
    date: date,
    image: image,
  }
}
export const findPostDataByTag = async (tag: string): Promise<Post[]> => {
  const postData: Post[] = await getSortedPostsData()

  const arr: Post[] = new Array()
  postData.map((post: Post) => {
    if (post.tags.indexOf(tag) != -1) {
      arr.push(post)
    }
  })
  return arr
}
export const findPostDataByCategory = async (category: string): Promise<Post[]> => {
  const postData: Post[] = await getSortedPostsData()
  const categoryInfo: CategoryType = Category

  const arr: Post[] = []
  postData.map((post: Post) => {
    if (post.category === category) {
      arr.push(post)
    } else if (
      categoryInfo[category] &&
      categoryInfo[category].sub &&
      categoryInfo[category].sub.indexOf(post.category) !== -1
    ) {
      arr.push(post)
    }
  })
  return arr
}

export const getAbout = async (): Promise<string> => {
  const content: string = util.getPostData('About.md', process.cwd()).content

  return await util.getContents(content)
}
