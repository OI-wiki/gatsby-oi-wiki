import { Reactions, Comment, Comments } from '@mgtd/vssue-api-github-v4/lib/types'
interface User {
  avatar: string,
  homepage: string,
  username: string
}

interface Issue {
  id: string,
  title: string,
  content: string,
  link: string
}

// eslint-disable-next-line no-undef
export { Comments, Issue, Reactions, User, Comment }
