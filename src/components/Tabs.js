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
      color: '#000',
      opacity: '1',
    },
  },
}))

const useIndicatorStyles = makeStyles(() => ({
  indicator: {
    height: '3px',
  },
}))

export default function NavTabs (props) {
  const classes = useStyles()
  const indicatorClasses = useIndicatorStyles()

  const { pathList, location } = props
  console.log(pathList)
  const newTabs = []
  for (const curTab of pathList.values()) {
    const curTitle = Object.keys(curTab)[0]
    const curLocation = (typeof Object.values(curTab)[0] === 'string') ? Object.values(curTab)[0] : Object.values(Object.values(curTab)[0][0])[0]
    newTabs.push({ title: curTitle, link: curLocation })
    console.log({ title: curTitle, link: curLocation })
  }
  console.log(newTabs)
  const state = (() => {
    for (const tab in newTabs) {
      console.log(tab)
      if (newTabs[tab].link === '/') {
        if (location === (newTabs[tab] || { link: undefined }).link) return +tab
        else continue
      }
      if ((location || '').startsWith(newTabs[tab].link)) return +tab
    }
    return false
  })()

  const [value, setValue] = React.useState(state)
  console.log(value)
  const handleChange = (event, newValue) => {
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
