/* eslint-disable no-undef */
/* eslint-disable camelcase */
/* eslint-disable spaced-comment */

type CollectionUser = { login: false; } | { login: true; username: string; avatar: string; homepage: string }

interface GeneralGithubUser {
  login: string;//用户名
  id: number;
  node_id: string;
  avatar_id: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: 'User';
  site_admin: boolean;
}

interface Response_getIssue {
  id: string;
  title: string;
  content: string;
  link: string;
}

type ReturnValue_getIssue = Response_getIssue | null;

interface ProposalMeta {
  name: string;
  url: string;
  description: string;
}
interface CollectionItem extends ProposalMeta {
  id: number;
  commentCount: number;
  supportCount: number;
  user: GeneralGithubUser;
  nodeId: string;
}
type SortMethod = 'support' | 'comment'
export type {
  CollectionUser,
  ReturnValue_getIssue,
  Response_getIssue,
  GeneralGithubUser,
  ProposalMeta,
  CollectionItem,
  SortMethod,
}
