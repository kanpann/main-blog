import React from 'react'
import { DefaultTheme } from '../../theme/Theme'
import styled from 'styled-components'
import { useRouter } from 'next/dist/client/router'

const SearchItem = styled.input`
  border: none;
  font-size: 1rem;
  &:focus {
    outline: none;
  }
  background: none;
  color: ${(props: DefaultTheme) => props.theme.app.title};
  border-bottom: ${(props: DefaultTheme) => `1px solid ${props.theme.app.title}`};
  text-align: center;
  padding: 10px;
  width: 80%;
`

const SearchForm = () => {
  const router = useRouter()

  const onKeyPress = (e: any) => {
    if (e.key == 'Enter') {
      const value = e.target.value

      router.push(`/search?keyword=${value}`)
    }
  }
  return <SearchItem placeholder="검색어를 입력해주세요." onKeyPress={onKeyPress} />
}

export default SearchForm
