import 'basic-type-extensions';
import React, { useState, useEffect, useRef } from 'react';
import { AppBar, Avatar, Box, Button, Toolbar } from '@material-ui/core';
import { Octokit } from '@octokit/rest';
import type { RequestError } from '@octokit/types';
import { Buffer } from 'buffer';
import MarkdownEditor from '../components/MarkdownEditor';
import StyledLayout from '../components/StyledLayout';
import Confirm from '../components/Confirm';
import authenticate, { User, anonymousUser } from '../lib/authenticate';
import { PromiseValue } from '../utils/common';

type Repository = PromiseValue<ReturnType<Octokit['rest']['repos']['get']>>['data'];
const EditorPage: React.FC = _ => {
	const [token, setToken] = useState<string | undefined>(undefined);
	const [user, setUser] = useState<User>(anonymousUser);
	const [content, setContent] = useState<string>('');
	const [curValue, setCurValue] = useState<string>('');
	const [repo, setRepo] = useState<Repository | null>(null);
	const confirmRef = useRef<Confirm | null>(null);
	let github: Octokit | null = null;
	async function checkFork(owner: string, repo: string): Promise<boolean> {
		return github!.rest.repos
			.listCommits({
				owner,
				repo,
				per_page: 1,
			})
			.then(
				() => true,
				() => false
			);
	}
	async function createFork(
		owner: string,
		repo: string
	): Promise<false | PromiseValue<ReturnType<Octokit['rest']['repos']['createFork']>>['data']> {
		return github!.rest.repos
			.createFork({
				owner,
				repo,
			})
			.then(
				({ data }) => data,
				_ => false
			);
	}
	useEffect(() => {
		authenticate().then(async identities => {
			if (typeof identities == 'string') {
				console.log(identities);
				return;
			}
			setToken(identities[0]);
			setUser(identities[1]);
			github = new Octokit({ auth: token });
			const forkedRepos = (
				await github.rest.repos.listForUser({
					username: identities[1].username,
					type: 'owner',
				})
			).data.filter(repo => repo.fork);
			let target: Repository | null = null;
			for (const forkedRepo of forkedRepos) {
				const details = (
					await github.rest.repos.get({
						owner: identities[1].username,
						repo: forkedRepo.name,
					})
				).data;
				if (details.parent!.full_name == 'OI-wiki/gatsby-oi-wiki') {
					target = details;
					setRepo(target);
					break;
				}
			}
			if (target == null) {
				const result = await confirmRef.current!.show({
					title: 'Fork本项目到您的GitHub仓库',
					message:
						'编辑内容需要先将本项目fork到自己的账号，以方便通过Pull Request提出修改建议。点击确定将会执行fork操作，取消将返回原页面。',
				});
				if (result) {
					await createFork('OI-wiki', 'gatsby-oi-wiki');
					await Promise.wait(() => checkFork(identities[1].username, 'gatsby-oi-wiki'), 500);
					target = (
						await github.rest.repos.get({
							owner: identities[1].username,
							repo: 'gatsby-oi-wiki',
						})
					).data;
					setRepo(target);
				}
			}
			const relativePath = new URL(location.href).searchParams.get('path');
			let docSHA;
			if (!String.isNullOrEmpty(relativePath)) {
				await github.rest.repos
					.getContent({
						owner: identities[1].username,
						repo: target!.name,
						path: `example/docs/${relativePath}`,
					})
					.then(
						({ data }) => {
							docSHA = (data as { sha: string }).sha;
							const doc = Buffer.from((data as any).content as string, 'base64').toString('utf8');
							setContent(doc);
						},
						(error: RequestError) => {
							if (error.status == 404) alert(`路径${relativePath}不存在`);
							else throw error;
						}
					);
			}
		}, console.log);
	}, []);
	return (
		<StyledLayout
			location={location}
			noTitle={true}
			noMeta={true}
			noComment={true}
			noToc={true}
			overflow={true}
			title="Markdown编辑器"
		>
			<Box>
				<AppBar
					position="static"
					style={{
						borderRadius: '3px 3px 0 0',
						borderColor: 'rgba(var(--divider))',
						backgroundColor: 'rgba(var(--background-paper))',
					}}
				>
					<Toolbar>
						<Avatar alt={user?.username} src={user?.avatar} style={{ height: 32, width: 32 }} />
						<Button
							variant="outlined"
							onClick={() =>
								confirmRef
									.current!.show({ title: 'test', message: <Button>Button</Button> })
									.then(console.log)
							}
						>
							TEST
						</Button>
						<Button variant="outlined" onClick={() => console.log(curValue)}>
							保存草稿
						</Button>
						<Button variant="outlined" onClick={() => console.log(curValue)}>
							提交Commit
						</Button>
						<Button variant="outlined" onClick={() => console.log(curValue)}>
							发起Pull Request
						</Button>
					</Toolbar>
				</AppBar>
			</Box>
			<MarkdownEditor value={content} onChange={setCurValue} />
			<Confirm ref={confirmRef} />
		</StyledLayout>
	);
};

export default EditorPage;
