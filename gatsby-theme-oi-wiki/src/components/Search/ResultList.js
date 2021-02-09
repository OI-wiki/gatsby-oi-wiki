import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@material-ui/core'
import { Link } from 'gatsby'
import React from 'react'
import { FindInPage as FindInPageIcon } from '@material-ui/icons'

export function SearchResultList (props) {
  const { result, isFirstRun, searchKey, classes } = props
  const resultCount = result.length
  return resultCount !== 0 ? (
    <>
      <Typography variant="body1" className={classes.searchMessage}>
        共找到 {resultCount} 条搜索结果：
      </Typography>
      <List>
        {result.map((item) => {
          /* Render article */
          return (
            <ListItem
              button
              divider
              component={Link}
              to={item.url}
              state={{ searchKey: searchKey }}
              key={item.url}
            >
              <ListItemIcon>
                <FindInPageIcon />
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
                      __html: item.highlight ? item.highlight : '',
                    }}
                  />
                }
              />
            </ListItem>
          )
        })}
      </List>
    </>
  ) : !isFirstRun.current ? (
    <Typography variant="body1" className={classes.searchMessage}>
      没有找到符合条件的结果
    </Typography>
  ) : (
    ''
  )
}
