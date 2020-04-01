/** @jsx jsx */
import { jsx } from "theme-ui"
import { makeStyles } from "@material-ui/core/styles"
import Chip from "@material-ui/core/Chip"
import kebabCase from "lodash/kebabCase"

const useStyles = makeStyles((theme) => ({
  chip: {
    margin: theme.spacing(0.5),
  },
}))

function Header({ num }) {
  if (num <= 0) return <span>本页面没有标签</span>
  return <span>标签：</span>
}

function Tags({ tags }) {
  const arr = tags
  const classes = useStyles()
  return (
    <div>
      <Header num={arr ? arr.length : 0}/>
      <div>
        {arr && arr.map((tag) => (
          <Chip label={` ${tag} `}
                href={"/tags/" + kebabCase(tag)}
                key={`tag-${tag}`}
                component={"a"}
                variant="outlined"
                clickable
                className={classes.chip}
          />
        ))}
      </div>
    </div>)
}

export default Tags
