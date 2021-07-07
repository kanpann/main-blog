import { Category } from '../../site.config'
import styled from 'styled-components'
import Link from 'next/link'
import { DefaultTheme } from '../../theme/Theme'
import { styled as muiStyled } from '@material-ui/core/styles'
import { Typography, withTheme } from '@material-ui/core'
import { CategoryItem } from '../../types/category'

const List = styled.ul`
  list-style: none;
  padding: 0px;
  margin: 0px;
`
const TopList = styled(List)`
  width: 85%;
  float: right;
`
const Item = styled.li`
  padding-top: 5px;
  padding-left: 20px;
  margin-top: 10px;
  font-weight: bold;

  .parent {
    color: ${(props: DefaultTheme) => props.theme.app.title};
    font-size: 1.3rem;
  }
  .child {
    color: #717171;
  }
  a {
    &:hover {
      color: #a3bcff;
      &::before {
        content: '_';
      }
    }
  }
`
const CategoryName = muiStyled(withTheme(Typography))((props: DefaultTheme) => ({
  marginTop: '30px',
  textAlign: 'center',
  paddingBottom: '10px',
  color: props.theme.app.box,
  fontWeight: 'bold',
  textShadow: `-1px 0 ${props.theme.app.title}, 0 1px ${props.theme.app.title}, 1px 0 ${props.theme.app.title}, 0 -1px ${props.theme.app.title}`,
}))

const Categories = () => {
  const categoryNames: string[] = Object.keys(Category)
  return (
    <>
      <CategoryName variant="h5">Categories</CategoryName>
      {categoryNames.map((categoryName, index) => {
        const mainMenu: CategoryItem = Category[categoryName]

        const { isSub, url }: CategoryItem = mainMenu

        const subMenus: string[] = isSub ? Category[categoryName]['sub'] : []

        return (
          <TopList key={index}>
            <Item>
              <Link href={url ? url : `/categories/${categoryName}`}>
                <a className="parent">{categoryName}</a>
              </Link>
              <List>
                {isSub &&
                  subMenus.map((subMenu, index) => (
                    <Item key={index}>
                      <Link href={`/categories/${subMenu}`}>
                        <a className="child">{subMenu}</a>
                      </Link>
                    </Item>
                  ))}
              </List>
            </Item>
          </TopList>
        )
      })}
    </>
  )
}
export default Categories
