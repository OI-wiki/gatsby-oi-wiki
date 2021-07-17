import { List, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core'
import { Link } from 'gatsby'
import React from 'react'
import { FindInPage as FindInPageIcon } from '@material-ui/icons'
import { useStyles } from './styles'

export interface ResultItem {
  url: string;
  title: string;
  highlight: string
}

export interface SearchResultListProps {
  result: ResultItem[];
  isFirstRun: React.MutableRefObject<boolean>;
  searchKey: string;
  classes: ReturnType<typeof useStyles>;
}

const SearchResultList: React.FC<SearchResultListProps> = props => {
  const { result, isFirstRun, searchKey, classes } = props
  const resultCount = result.length
  return resultCount !== 0
    ? (<>
      <Typography variant="body1" className={classes.searchMessage}>
        共找到 {resultCount} 条搜索结果：
      </Typography>
      <List>
        {result.map((item) =>
          <ListItem
            button
            divider
            component={Link}
            to={item.url}
            state={{ searchKey: searchKey }}
            key={item.url}
          >
            <ListItemIcon>
              <FindInPageIcon/>
            </ListItemIcon>
            <ListItemText
              disableTypography={true}
              primary={
                <Typography
                  variant="h6"
                  className={classes.searchResultPrimary}
                  dangerouslySetInnerHTML={{
                    __html: item.title.replace(
                      searchKey,
                      `<em>${searchKey}</em>`,
                    ),
                  }}
                />
              }
              secondary={
                <div
                  className={classes.searchResultSecondary}
                  dangerouslySetInnerHTML={{
                    __html: item.highlight || '',
                  }}
                />
              }
            />
          </ListItem>)}
      </List>
    </>)
    : (isFirstRun.current
        ? <></>
        : (<Typography variant="body1" className={classes.searchMessage}>
        没有找到符合条件的结果
      </Typography>))
}

export default SearchResultList
