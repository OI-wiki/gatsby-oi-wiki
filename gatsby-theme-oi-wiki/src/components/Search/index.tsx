import React from 'react'

import SearchResult from './SearchResult'
import { useWindowDimensions } from './hooks'
import Backdrop from '@mui/material/Backdrop'
import styled from '@mui/material/styles/styled'
import Box from '@mui/material/Box'
import { css } from '@emotion/react'
import { Dialog } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'
import { ArrowBack } from '@mui/icons-material'
import Paper from '@mui/material/Paper'
import SearchInput from './SearchInput'
import { observer } from 'mobx-react-lite'
import { searchStore } from './store'


const SearchContainer = styled(Box)(({ theme }) => css`
  position: relative;
  border-radius: ${theme.shape.borderRadius};
  max-width: calc(30vw + 1em + ${theme.spacing(4)});
  margin-left: 0;
  width: 100%;
  z-index: ${theme.zIndex.drawer + 2};

  ${theme.breakpoints.up('md')} {
    margin-left: ${theme.spacing(3)};
    width: auto;
  }
`)

const StyledBackdrop = styled(Backdrop)(({ theme }) => css`
  z-index: ${theme.zIndex.drawer + 1};
`)

const SearchIconWrapper = styled(Box)(({ theme }) => css`
  padding: ${theme.spacing(0, 2)};
  height: 100%;
  position: absolute;
  pointer-events: none;

  display: flex;
  align-items: center;
  justify-content: center;
`)

const SearchIconBlock: React.FC = () => {
  return (
    <SearchIconWrapper>
      <SearchIcon fontSize="small"/>
    </SearchIconWrapper>
  )
}

const SmallScreenSearchIconBtn = styled(IconButton)(({ theme }) => css`
  height: 100%;
  padding: ${theme.spacing(1.5)};
  color: inherit;

  display: flex;
  align-items: center;
  justify-content: center;
`)

const SmallScreenReturnBtn = styled(IconButton)(({ theme }) => css`
  padding: ${theme.spacing(1.5)};
  position: absolute;
  display: flex;
`)

const SmallScreenDialogHeaderPaper = styled(Paper)`
  align-items: center;
  border-radius: 0;
`

const Search: React.FC = observer(() => {
  const { width } = useWindowDimensions()

  // 600px is sm
  if (width > 600) {
    return <>
      <SearchContainer>
        <SearchIconBlock/>
        <SearchInput/>
        <SearchResult/>
      </SearchContainer>
      <StyledBackdrop open={searchStore.open} onClick={searchStore.disableSearch}/>
    </>
  } else {
    return <>
      <SmallScreenSearchIconBtn onClick={searchStore.enableSearch}>
        <SearchIcon/>
      </SmallScreenSearchIconBtn>
      <Dialog
        open={searchStore.open}
        onClose={searchStore.disableSearch}
        fullWidth={true}
        fullScreen={true}
      >
        <SmallScreenDialogHeaderPaper>
          <SmallScreenReturnBtn onClick={searchStore.disableSearch}>
            <ArrowBack/>
          </SmallScreenReturnBtn>
          <SearchInput isSmallScreen={true} autoFocus={true}/>
        </SmallScreenDialogHeaderPaper>
        <SearchResult/>
      </Dialog>
    </>
  }
})

export default Search
