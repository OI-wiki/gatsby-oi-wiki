import Chip from '@material-ui/core/Chip'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'

const useStyles = makeStyles((theme) => ({
  chip: {
    margin: theme.spacing(0.5),
  },
}))

const AuthorsArray: React.FC<{authors: string }> = ({ authors }) => {
  const arr = authors && authors.split(',').map((x) => x.trim())
  const classes = useStyles()
  return (
    <div>
      {arr &&
        arr.map((author) => (
          <Chip
            label={` @${author} `}
            key={author}
            clickable
            className={classes.chip}
            component="a"
            variant="outlined"
            href={'https://github.com/' + author.trim()}
            target="_blank"
            rel="noopener noreferrer nofollow"
          />
        ))}
    </div>
  )
}

export default AuthorsArray
