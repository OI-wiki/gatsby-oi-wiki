import { Link } from 'gatsby'
import React, { useEffect, useMemo, useState } from 'react'
import styled from '@mui/material/styles/styled'
import Paper from '@mui/material/Paper'
import { css } from '@emotion/react'
import scrollbarStyle from '../../theme/scrollbarStyle'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import FindInPage from '@mui/icons-material/FindInPage'
import ListItemText from '@mui/material/ListItemText'
import { searchStore } from './store'
import { observer } from 'mobx-react-lite'
import { reaction } from 'mobx'
import { fetchResult } from './api'

export interface ResultItem {
  url: string;
  title: string;
  highlight: string
}

export interface SearchResultListProps {
  result: ResultItem[];
}

const StyledPaper = styled(Paper)(({ theme }) => css`
  ${scrollbarStyle};

  min-width: calc(30vw + 1em + ${theme.spacing(4)});
  max-width: 50vw;
  max-height: 80vh;
  margin-top: 12px;

  position: absolute;
  top: 100%;
  right: 0 !important;

  overflow-y: auto;
  overflow-x: hidden;
  z-index: ${theme.zIndex.drawer + 2};
`)

const StyledTyp = styled(Typography)`
  padding: 8px 8px 8px 20px;
  background: #f5f5f5;
` as typeof Typography

const SearchResultPrimaryTyp = styled(Typography)(({ theme }) => css`
  margin: 0;

  & em {
    font-style: normal;
    color: ${theme.palette.secondary.main};
    background-color: rgba(143, 187, 237, 1);
  }
`)

const SearchResultSecondaryBox = styled(Box)(({ theme }) => css`
  & em {
    font-style: normal;
    padding: 0 0 2px;
    // 使用 box shadow 模拟下划线
    box-shadow: inset 0 -2px 0 0 ${theme.palette.secondary.main};
  }
`)

const SearchMessage: React.FC = (props) => {
  const { children } = props

  return (
    <StyledTyp variant="body1">
      {children}
    </StyledTyp>
  )
}

const SearchResultList: React.FC<SearchResultListProps> = observer((props) => {
  const { result } = props
  return (
    <List>
      {result.map((item) =>
        <ListItem
          key={item.url}
          button={true}
          divider={true}
          component={Link}
          to={item.url}
          state={{ searchKey: searchStore.searchKey }}
        >
          <ListItemIcon>
            <FindInPage/>
          </ListItemIcon>
          <ListItemText
            disableTypography={true}
            primary={
              <SearchResultPrimaryTyp
                variant="h6"
                dangerouslySetInnerHTML={{
                  __html: item.title.replace(
                    searchStore.searchKey,
                    `<em>${searchStore.searchKey}</em>`,
                  ),
                }}
              />
            }
            secondary={
              <SearchResultSecondaryBox
                dangerouslySetInnerHTML={{
                  __html: item.highlight || '',
                }}
              />
            }
          />
        </ListItem>)
      }
    </List>
  )
})


const SearchResult: React.FC = observer(() => {
  const [result, setResult] = useState<ResultItem[]>([])
  const resultCount = useMemo(() => result.length, [result])

  useEffect(() => {
    const fetchReactionDispose = reaction(() => searchStore.searchKey,
      (curVal, prevVal) => {
        if (curVal === '') {
          setResult([])
        } else if (curVal !== prevVal) {
          // the order is tricky here
          // set result after set isFirstRun
          // so when there's no result on first run
          // the user is prompted with the notice
          fetchResult(curVal).then((value => {
            searchStore.setIsFirstRun(false)
            setResult(value)
          }))
        }
      }, {
        delay: 500,
      })

    return () => {
      fetchReactionDispose()
    }
  }, [])

  return (
    <StyledPaper>
      {(!searchStore.open || searchStore.isFirstRun)
        ? <></>
        : resultCount === 0
          ? <SearchMessage>没有找到符合条件的结果</SearchMessage>
          : <>
            <SearchMessage>共找到 {resultCount} 条搜索结果：</SearchMessage>
            <SearchResultList result={result}/>
          </>
      }
    </StyledPaper>
  )
})

export default SearchResult
