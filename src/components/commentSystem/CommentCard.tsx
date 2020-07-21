import { Avatar, Button, Card, CardActions, CardContent, CardHeader } from '@material-ui/core'
import React from 'react'
import Time from '../Time'
interface Props {
  avatarLink: string,
  name: string,
  contentHTML: string,
  timestamp: number
}

const CommentCard: React.FC<Props> = (props) => {
  return (
    <Card variant="outlined">
      <CardHeader avatar={<Avatar alt={props.name}
        src={props.avatarLink}/>}
      title={props.name}
      subheader={<Time timestamp={props.timestamp}/>}/>
      <CardContent>
        <div dangerouslySetInnerHTML={{ __html: props.contentHTML }}/>
      </CardContent>
      <CardActions>
        <Button color="default" variant="outlined" startIcon="👍">
          3
        </Button>
        <Button color="default" variant="outlined" startIcon="🎉">
          1
        </Button>
        <Button color="default" variant="outlined" startIcon="😕">
          1
        </Button>
        <Button color="default" variant="outlined" startIcon="👎">
          1
        </Button>
      </CardActions>
    </Card>)
}

export default CommentCard
