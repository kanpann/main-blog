import { Post } from "./types";

export default class PagingUtil {
    VIEW_POST = 6   
    _page
    result 
    _origin
    startNum
    endNum
    constructor(page: number, posts: Post[]) {
        this._page = page
        this._origin = posts
        this.startNum = (page - 1) * this.VIEW_POST + 1
        this.endNum = this.startNum + this.VIEW_POST - 1
        this.result = posts.slice(this.startNum - 1, this.endNum)
    }
}