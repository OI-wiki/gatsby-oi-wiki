import { InputBaseProps } from '@mui/material/InputBase'
import React from 'react'
import { InputBase } from '@mui/material'
import { searchStore } from './store'
import { observer } from 'mobx-react-lite'
import styled from '@mui/material/styles/styled'
import { theme } from '../../theme'
import clsx from 'clsx'

interface SearchInputProps extends InputBaseProps {
  isSmallScreen?: boolean
}

const StyledInputBase = styled(InputBase)`
  color: inherit;
  display: block;
  margin-left: calc(1em + ${theme.spacing(4)});
  margin-top: 2px;
  margin-bottom: 2px;

  &.small-screen {
    margin-top: 9px;
    margin-bottom: 6px;
  }

  &.wide-input {
    ${theme.breakpoints.up('md')} {
      transition: ${theme.transitions.create('width')};
      width: 30vw;
    }
  }

  .MuiInputBase-input {
    ${theme.breakpoints.up('md')} {
      transition: ${theme.transitions.create('width')};
      width: 15vw;

      &:focus {
        width: 30vw;
      }
    }

    &::-webkit-search-cancel-button,
    &::-webkit-search-decoration,
    &::-webkit-search-results-button,
    &::-webkit-search-results-decoration {
      display: none;
    }
  }
`

const SearchInput: React.FC<SearchInputProps> = observer((props) => {
  const { isSmallScreen = false, ...others } = props

  return (
    <StyledInputBase
      className={clsx({
        'wide-input': !!searchStore.searchKey,
        'small-screen': isSmallScreen,
      })}
      type="search"
      placeholder="键入以开始搜索"
      onFocus={searchStore.enableSearch}
      onChange={(event => {
        searchStore.setSearchKey(event.target.value)
      })}
      defaultValue={searchStore.searchKey}
      {...others}
    />
  )
})

export default SearchInput
