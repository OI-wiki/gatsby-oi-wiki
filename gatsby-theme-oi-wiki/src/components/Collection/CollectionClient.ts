/* eslint-disable*/
import axios, { AxiosInstance } from 'axios'
import { sha256 } from 'js-sha256'
import { CollectionItem, GeneralGithubUser, ProposalComment, ProposalMeta, SortMethod } from './types';
import { graphql } from '@octokit/graphql'
import { graphql as TGraphQL } from '@octokit/graphql/dist-types/types';
const LABEL_PROPOSAL = 'collection-proposal'
class CollectionClient {
  private owner: string;
  private repo: string;
  private client: AxiosInstance;
  private gqlclient: TGraphQL;
  private token: string | null;
  // eslint-disable-next-line space-before-function-paren
  constructor(token: string | null, owner: string, repo: string) {
    this.repo = repo
    this.owner = owner
    this.token = token
    this.client = axios.create({
      headers: {
        Authorization: token !== null ? `token ${this.token}` : undefined,
        Accept: 'application/vnd.github.v3+json;application/vnd.github.squirrel-girl-preview'
      },
      baseURL: 'https://api.github.com'
    })
    this.client.interceptors.response.use(r => r, err => {
      console.log(err)
      err.data = null
      return err
    })
    this.gqlclient = graphql.defaults({
      headers: {
        Authorization: token !== null ? `token ${this.token}` : undefined,
      }
    })
  }
  makeRepoPrefix(): string {
    return `/repos/${this.owner}/${this.repo}`
  }
  async checkLabel() {
    if (this.token === null) return
    for (const name of [LABEL_PROPOSAL]) {
      const resp = await this.client.get(`${this.makeRepoPrefix()}/labels/${name}`);
      if (resp.status !== 200) {
        console.log("Creating label", name)
        await this.client.post(`${this.makeRepoPrefix()}/labels`, { name: name })
      }
    }
  }
  async checkData() {
    await this.checkLabel()
  }
  makeSearchPrefix(pageId: string): string {
    return `collection-${sha256(pageId).substr(0, 8)}`
  }
  makeProposalTitle(pageId: string, name: string): string {
    return `collection-${sha256(pageId).substr(0, 8)}-${sha256(name)}`
  }
  async sendComment(issueId: number, text: string): Promise<void> {
    await this.client.post(`/repos/${this.owner}/${this.repo}/issues/${issueId}/comments`, { body: text })
  }
  async getIssueCommentCount(issudId: number): Promise<number> {
    const resp = (await this.client.get(`/repos/${this.owner}/${this.repo}/issues/${issudId}`)).data
    return resp.comments as number
  }
  async deleteProposal(nodeId: string): Promise<{ ok: boolean; message?: string; }> {
    // const title = this.makeProposalTitle(id, name)
    await this.gqlclient(`
    mutation ($input: DeleteIssueInput!) {
      deleteIssue(input: $input) {
        clientMutationId
      }
    }
    `, {
      input: {
        issueId: nodeId
      }
    })
    return { ok: true }
  }
  async sendProposal(id: string, name: string, url: string, description: string): Promise<{ ok: boolean; message: string }> {
    const proposalTitle = this.makeProposalTitle(id, name)
    const searchtext = `${proposalTitle} repo:${this.owner}/${this.repo} in:title`
    {
      const resp = (await this.client.get('/search/issues', { params: { q: searchtext, page: 1 } })).data as { total_count: number }
      if (resp.total_count > 0) return { ok: false, message: '此标题的提案已经存在!' }
    }
    {
      const resp = (await this.client.post(`/repos/${this.owner}/${this.repo}/issues`, {
        title: proposalTitle,
        body: JSON.stringify({ name: name, url: url, description: description }),
        labels: [LABEL_PROPOSAL],
      }))
      if (resp.status !== 201) {
        return { ok: false, message: `${resp.status}: ${resp.statusText}` }
      }
    }

    return { ok: true, message: '' }
  }
  async getUserDetails(username: string): Promise<GeneralGithubUser> {
    return (await this.client.get(`/users/${username}`)).data
  }
  async getComments(issueId: number, page: number = 1, itemsPerPage: number = 20): Promise<ProposalComment[]> {
    const resp = (await this.client.get(`/repos/${this.owner}/${this.repo}/issues/${issueId}/comments`, {
      params: {
        per_page: itemsPerPage,
        page: page
      }
    })).data as ProposalComment[];
    return resp;
  }
  async setSupportState(nodeId: string, state: boolean) {
    if (state) {
      await this.gqlclient(`
      mutation ($data: AddReactionInput!) {
        addReaction(input: $data) {
          reaction {
            content
          }
          subject {
            id
          }
        }
      }      
      `, {
        data: { subjectId: nodeId, content: 'THUMBS_UP' }
      })
    } else {
      await this.gqlclient(`
      mutation ($data: RemoveReactionInput!) {
        removeReaction(input: $data) {
          reaction {
            content
          }
          subject {
            id
          }
        }
      }      
      `, { data: { subjectId: nodeId, content: 'THUMBS_UP' } })
    }
  }
  async getSelfSupported(id: number): Promise<boolean> {
    const { repository } = await this.gqlclient(`
    query repository(
      $owner: String!, 
      $name: String!, 
      $number: Int!) {
      repository(owner: $owner, name: $name) {
        issue(number: $number) {
          reactionGroups {
            content
            # reactors {
            #   totalCount
            # }
            viewerHasReacted
          }
        }
      }
    }
    `, { owner: this.owner, name: this.repo, number: id }) as {
      repository: {
        issue: {
          reactionGroups: {
            content: string;
            // reactors: { totalCount: number; };
            viewerHasReacted: boolean;
          }[]
        }
      }
    }
    for (const reaction of repository.issue.reactionGroups) {
      if (reaction.content === 'THUMBS_UP') {
        return reaction.viewerHasReacted
      }
    }
    return false
  }
  async getCollection(id: string, page: number = 1, itemsPerPage: number = 10, orderBy: SortMethod = 'support'): Promise<{ totalPage: number; proposalCount: number; data: CollectionItem[] }> {
    await this.checkData()
    const query = `${this.makeSearchPrefix(id)} label:${LABEL_PROPOSAL} repo:${this.owner}/${this.repo} in:title`
    const resp = (await this.client.get('/search/issues', {
      params: {
        q: query,
        sort: orderBy === 'support' ? 'reactions-+1' : 'comments',
        order: 'desc',
        page: page,
        per_page: itemsPerPage
      }
    })).data as {
      total_count: number;
      items: {
        comments: number;
        number: number;
        title: string;
        body: string
        reactions: {
          "+1": number;
        }
        user: GeneralGithubUser;
        node_id: string;
      }[]
    }
    const totalPage = Math.ceil(resp.total_count / itemsPerPage)
    return {
      totalPage: totalPage,
      proposalCount: resp.total_count,
      data: resp.items.map(x => {
        const meta = JSON.parse(x.body) as ProposalMeta
        return {
          commentCount: x.comments,
          description: meta.description,
          id: x.number,
          name: meta.name,
          url: meta.url,
          supportCount: x.reactions['+1'],
          user: x.user,
          nodeId: x.node_id,
        }
      })
    }
  }
}

export {
  CollectionClient,
}
