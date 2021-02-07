import GithubV3 from '@mgtd/vssue-api-github-v3'
import GithubV4 from '@mgtd/vssue-api-github-v4'
import { Comments, Issue } from './types'

export async function getComments (ghAPIV3: GithubV3, ghAPIV4: GithubV4, id: string, revokeToken: () => void, token?: string): Promise<[Issue, Comments] | 'noIssue' | 'invalidToken'> {
  let issue: Issue
  try {
    issue = await ghAPIV3.getIssue({ accessToken: token, issueTitle: id })
  } catch (e) {
    revokeToken()
    return 'invalidToken'
  }
  if (issue === null) {
    return 'noIssue'
  }
  let comments: Comments
  if (!token) {
    comments = await ghAPIV3.getComments({ accessToken: token, issueId: issue.id, query: { page: 1, perPage: 100 } })
  } else {
    comments = await ghAPIV4.getComments({ accessToken: token, issueId: issue.id, query: { page: 1, perPage: 100, sort: 'asce' } })
  }
  return [issue, comments]
}