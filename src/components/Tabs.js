import { makeStyles } from "@material-ui/core/styles"
import Tab from "@material-ui/core/Tab"
import Tabs from "@material-ui/core/Tabs"
import React from "react"

const useStyles = makeStyles((theme) => ({
  tabs: {
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
    width: "6em",
    minWidth: "6em",
  },
}))

export default function(props) {
  const classes = useStyles()
  const [value, setValue] = React.useState(0)
  const { tabs } = props
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  return (
    <Tabs value={value} onChange={handleChange}>
      {tabs.map(({ title, link }) => (
        <Tab
          key={title}
          label={title}
          component="a"
          className={classes.tabs}
          href={link ? link : "."}
        />
      ))}
    </Tabs>
  )
}
