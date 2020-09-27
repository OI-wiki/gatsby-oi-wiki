import Chip from '@material-ui/core/Chip'
import { makeStyles } from '@material-ui/core/styles'
import kebabCase from 'lodash/kebabCase'
import React from 'react'

const useStyles = makeStyles((theme) => ({
  chip: {
    margin: theme.spacing(0.5),
  },
}))

interface Props{
  tags: Array<string>
}

const Tags: React.FC<Props> = (props: Props) => {
  const arr = props.tags
  const classes = useStyles()
  return (
    <div>
      {arr &&
        arr.map((tag) => (
          <Chip
            label={` #${tag} `}
            href={'/tags/' + kebabCase(tag)}
            key={`tag-${tag}`}
            component="a"
            variant="outlined"
            clickable
            className={classes.chip}
          />
        ))}
    </div>
  )
}

export default Tags
