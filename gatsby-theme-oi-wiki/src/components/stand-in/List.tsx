import { css } from '@emotion/react'
import styled from '@mui/material/styles/styled'

const listStyle = css`
  padding-inline-start: 0;
  margin-inline-start: 1rem;
`

const UList = styled('ul')(listStyle)

const OList = styled('ol')(listStyle)

const List = {
  ul: UList,
  ol: OList,
}

export default List
