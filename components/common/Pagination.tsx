import Link from 'next/link'
import React from 'react'
import styled, { DefaultTheme } from 'styled-components'

const Frame = styled.div`
  .left {
    float: left;
    border-bottom: 3px solid #318023;
    border-left: 4px solid #cecece;
    border-radius: 5px;
    padding: 5px;
  }
  .right {
    float: right;
    border-bottom: 3px solid #318023;
    border-right: 4px solid #cecece;
    border-radius: 3px;
    padding: 5px;
  }
  a {
    color: ${(props: DefaultTheme) => props.theme.app.title};
  }
  font-size: 2rem;
  margin: 20px 0px;
`

type PaginationProps = {
  isPrev: boolean
  isNext: boolean
  page: number
  menu?: string
  topMenu?: string
}
const Pagination = ({ isPrev, isNext, menu, topMenu, page }: PaginationProps) => {
  let query
  if (menu) {
    query = { menu: menu, topMenu: topMenu }
  }
  return (
    <Frame>
      {isPrev && (
        <Link href={{ pathname: '', query: { ...query, page: page - 1 } }}>
          <a className="left">Previous</a>
        </Link>
      )}
      {isNext && (
        <Link href={{ pathname: '', query: { ...query, page: page + 1 } }}>
          <a className="right">Next</a>
        </Link>
      )}
    </Frame>
  )
}
export default Pagination
