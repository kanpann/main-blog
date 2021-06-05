import { Post } from "./types";

export default class PagingUtil {
    VIEW_POST = 6   
    result 
    isPrev
    isNext
    constructor(page: number, posts: Post[]) {
        page = page == 0 ? 1: page
        const startNum = (page - 1) * this.VIEW_POST + 1
        const endNum = startNum + this.VIEW_POST - 1
        this.isPrev = page > 1
        this.isNext = Math.ceil(posts.length/this.VIEW_POST) > page
        this.result = posts.slice(startNum - 1, endNum)
    }
}