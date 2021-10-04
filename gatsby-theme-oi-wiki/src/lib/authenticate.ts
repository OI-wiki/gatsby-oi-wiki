import 'basic-type-extensions'
import { Octokit } from '@octokit/rest'
import type { RequestError } from '@octokit/types'
import { createOAuthAppAuth } from '@octokit/auth-oauth-app'
import Axios from 'axios'
import type { PromiseValue } from '../utils/common'

export interface User {
  username: string
  avatar?: string
  homepage?: string
}

export const anonymousUser: User = { username: '未登录用户' }

type OAuthApp = Record<'id' | 'secret', string>
const defaultApp: OAuthApp = {
  id: process.env.GATSBY_GITHUB_CLIENT_ID as string,
  secret: process.env.GATSBY_GITHUB_CLIENT_SECRET as string,
}

export async function verifyAccessToken(
  accessToken: string,
  app?: OAuthApp
): Promise<false | PromiseValue<ReturnType<Octokit['rest']['apps']['checkToken']>>['data']> {
  app ??= defaultApp
  return new Octokit({
    authStrategy: createOAuthAppAuth,
    auth: {
      clientType: 'oauth-app',
      clientId: app.id,
      clientSecret: app.secret,
    },
  }).rest.apps
    .checkToken({
      client_id: app.id,
      access_token: accessToken,
    })
    .then(
      ({ data }) => data,
      error => {
        if ((error as RequestError).status == 404) return false
        throw error
      }
    )
}

export default async function authenticate(
  app?: OAuthApp,
  checkExisting = true,
  requestIfNotExisted = true
): Promise<string | [string, User]> {
  let accessToken = localStorage.getItem('github-access-token') as string | null
  let user = JSON.parse(localStorage.getItem('github-user') ?? 'null') as User | null
  async function setUser() {
    const github = new Octokit({ auth: accessToken })
    user = await github.rest.users.getAuthenticated().then(({ data }) => ({
      username: data.login,
      avatar: data.avatar_url,
      homepage: data.html_url,
    }))
    localStorage.setItem('github-user', JSON.stringify(user))
  }
  app ??= defaultApp
  if (!String.isNullOrEmpty(accessToken)) {
    if (checkExisting && (await verifyAccessToken(accessToken!, app)) === false) {
      accessToken = null
      user = null
      localStorage.removeItem('github-access-token')
      localStorage.removeItem('github-user')
    } else {
      if (user == null) await setUser()
      return [accessToken!, user!]
    }
  }
  const params = new URL(window.location.href).searchParams
  const authError = params.get('error')
  if (!String.isNullOrEmpty(authError)) return authError!
  const authCode = params.get('code')
  if (String.isNullOrEmpty(authCode)) {
    if (requestIfNotExisted) {
      window.location.href = `https://github.com/login/oauth/authorize?client_id=${
        app.id
      }&scope=public_repo&redirect_uri=${encodeURIComponent(window.location.href)}`
    } else return 'No identities found'
  } else {
    const authResp = await Axios.post<Record<'access_token' | 'scope' | 'token_type', string>>(
      'https://cors-anywhere.mgt.workers.dev/?https://github.com/login/oauth/access_token',
      {
        client_id: app.id,
        client_secret: app.secret,
        code: authCode,
      },
      {
        headers: {
          Accept: 'application/json',
        },
      }
    )
    accessToken = authResp.data.access_token
    localStorage.setItem('github-access-token', accessToken)
    await setUser()
  }
  return [accessToken!, user!]
}
