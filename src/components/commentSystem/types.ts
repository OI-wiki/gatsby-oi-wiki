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

interface Reactions {
  like?: number
  unlike?: number
  heart?: number
}
interface SingleComment {
  id: string
  content: string
  contentRaw: string
  author: User
  createdAt: string
  updatedAt: string
  reactions?: Reactions | null
}
interface Comments {
  count: number
  page: number
  perPage: number
  data: Array<SingleComment>
}

// eslint-disable-next-line no-undef
export { Comments, Issue, Reactions, User, SingleComment }
