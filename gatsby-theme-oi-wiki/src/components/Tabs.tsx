import { makeStyles } from '@material-ui/core/styles'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import React from 'react'

const useStyles = makeStyles((theme) => ({
  tab: {
    paddingLeft: theme.spacing(2.5),
    paddingRight: theme.spacing(2.5),
    minWidth: '0',
    '&:hover': {
      // eslint-disable-next-line
      //@ts-ignore
      color: theme.palette.tab.colorOnHover,
      opacity: '1',
    },
  },
}))

const useIndicatorStyles = makeStyles(() => ({
  indicator: {
    height: '3px',
  },
}))

interface Props{
  tabID: number;
  pathList: any;
}

const NavTabs: React.FC<Props> = (props) => {
  const classes = useStyles()
  const indicatorClasses = useIndicatorStyles()

  const { tabID, pathList } = props
  const newTabs = []
  for (const curTab of pathList.values()) {
    const curTitle = Object.keys(curTab)[0]
    const curLocation = (typeof Object.values(curTab)[0] === 'string')
      ? Object.values(curTab)[0]
      /*
        - 测试: /test/
      */
      : Object.values(Object.values(curTab)[0][0])[0]
      /*
        - 测试:
          - 测试: /test/
      */

    newTabs.push({ title: curTitle, link: curLocation })
  }
  const state = (() => {
    return tabID
  })()

  const [value, setValue] = React.useState(state)
  const handleChange = function (event, newValue) {
    setValue(newValue)
  }
  return (
    <Tabs value={value} onChange={handleChange} classes={indicatorClasses}>
      {newTabs.map(({ title, link }) => (
        <Tab
          disableRipple
          key={title}
          label={title}
          component="a"
          className={classes.tab}
          href={link || '.'}
        />
      ))}
    </Tabs>
  )
}

export default React.memo(NavTabs, (prev, next) => prev.tabID === next.tabID)
