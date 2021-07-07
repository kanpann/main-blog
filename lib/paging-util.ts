import { Post } from '../types/post'

export default class PagingUtil {
  private _viewPost = 6
  private _result
  private _isPrev
  private _isNext
  private _totalPage

  constructor(page: number, posts: Post[]) {
    page = page == 0 ? 1 : page
    const startNum: number = (page - 1) * this._viewPost + 1
    const endNum: number = startNum + this._viewPost - 1
    this._isPrev = page > 1
    this._isNext = Math.ceil(posts.length / this._viewPost) > page
    this._result = posts.slice(startNum - 1, endNum)
    this._totalPage = Math.ceil(posts.length / this._viewPost)
  }
  public getObj(): { result: Post[]; totalPage: number } {
    return {
      result: this._result,
      totalPage: this._totalPage,
    }
  }

  public get result(): string {
    return this.result
  }
  public get isPrev(): string {
    return this._isPrev
  }
  public get isNext(): string {
    return this._isNext
  }
  public get total(): string {
    return this._totalPage
  }
}
