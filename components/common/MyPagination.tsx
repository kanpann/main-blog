import React from 'react'
import { Pagination } from '@material-ui/lab'
import { useRouter } from 'next/dist/client/router'
import { Box } from '@material-ui/core'

type PaginationProps = {
  target?: string
  page: number
  totalPage: number
  queryStr?: string
}
const MyPagination = ({ target = '', page, totalPage, queryStr }: PaginationProps) => {
  const { replace } = useRouter()
  const handleChange = (event: object, page: number) => {
    let query: string = `?page=${page}`

    if (queryStr) {
      query += '&' + queryStr
    }
    if (target) {
      query = `${target}` + query
    }
    replace(query)
  }
  return (
    <Box display="flex" justifyContent="center" m={1} p={1}>
      <Pagination
        count={totalPage}
        page={page}
        onChange={handleChange}
        variant="outlined"
        shape="rounded"
      />
    </Box>
  )
}
export default MyPagination
