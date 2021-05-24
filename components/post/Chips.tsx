import React from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import { DefaultTheme } from '../../theme/Theme'
import { Avatar, Chip, withTheme } from '@material-ui/core'

const MyChip = styled(withTheme(Chip))((props: DefaultTheme) => ({
  '&::after': {
    content: '|',
  },
}))

const TagFrame = styled.div`
  margin-bottom: 20px;
  color: ${(props: DefaultTheme) => props.theme.app.title};
`
type ChipsProps = {
  category: string
  tags: string[]
}
const Chips = ({ category, tags }: ChipsProps) => {
  return (
    <TagFrame>
      <MyChip
        avatar={<Avatar>C</Avatar>}
        key={category}
        style={{ marginRight: '5px', marginBottom: '10px' }}
        label={category}
        color="primary"
        variant="outlined"
      />
      {tags.map((tag, index) => (
        <Link key={index} href={'/tag?tag=' + tag}>
          <MyChip
            avatar={<Avatar>T</Avatar>}
            key={tag}
            style={{ marginRight: '5px', marginBottom: '10px' }}
            label={tag}
            clickable
            color="secondary"
            variant="outlined"
          />
        </Link>
      ))}
    </TagFrame>
  )
}
export default Chips
