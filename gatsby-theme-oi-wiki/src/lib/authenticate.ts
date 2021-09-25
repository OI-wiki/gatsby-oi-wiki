import 'basic-type-extensions';
import { createOAuthAppAuth } from '@octokit/auth-oauth-app';
import { Octokit } from '@octokit/rest';

export interface User {
	username: string;
	avatar?: string;
	homepage?: string;
}

export const anonymousUser: User = { username: '未登录用户' };

export default async function authenticate(client?: Record<'id' | 'secret', string>): Promise<string | [string, User]> {
	let accessToken = localStorage.getItem('github-access-token') as string | null;
	let user = JSON.parse(localStorage.getItem('github-user') ?? 'null') as User | null;
	async function setUser() {
		const github = new Octokit({ auth: accessToken });
		user = await github.rest.users.getAuthenticated().then(({ data }) => ({
			username: data.login,
			avatar: data.avatar_url,
			homepage: data.url,
		}));
		localStorage.setItem('github-user', JSON.stringify(user));
	}
	if (!String.isNullOrEmpty(accessToken)) {
		if (user == null) await setUser();
		return [accessToken!, user!];
	}
	client ??= {
		id: process.env.GATSBY_GITHUB_CLIENT_ID as string,
		secret: process.env.GATSBY_GITHUB_CLIENT_SECRET as string,
	};
	const params = new URL(window.location.href).searchParams;
	const authError = params.get('error');
	if (!String.isNullOrEmpty(authError)) return authError!;
	const authCode = params.get('code');
	if (String.isNullOrEmpty(authCode))
		window.location.href = `https://github.com/login/oauth/authorize?client_id=${
			client.id
		}&scope=public_repo&redirect_uri=${encodeURIComponent(window.location.href)}`;
	else {
		const auth = createOAuthAppAuth({
			clientType: 'oauth-app',
			clientId: client.id,
			clientSecret: client.secret,
		});
		const result = await auth({
			type: 'oauth-user',
			code: authCode!,
			state: 'oiwiki',
		});
		accessToken = result.token;
		localStorage.setItem('github-access-token', result.token);
		await setUser();
	}
	return [accessToken!, user!];
}
