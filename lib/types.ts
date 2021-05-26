export interface Post {
    id: string
    title: string
    toc?: string
    excerpt?: string
    category: string
    content: string
    tags: string[]
    date: string
    image: string
}
export interface RenderResult {
    toc: string
    contents: string
}