import {
	Button,
	CircularProgress,
	Divider,
	makeStyles,
	Tooltip,
	Typography,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import GithubV3 from '@mgtd/vssue-api-github-v3';
import GithubV4 from '@mgtd/vssue-api-github-v4';
import createPersistedState from 'use-persisted-state';
import CommentCard from './Card';
import CommentInput from './CommentInput';
import { Comments, Issue, User } from './types';
import { InputContentProvider } from './inputContext';
import { getComments } from './api';

const useToken = createPersistedState('github-access-token');
const useUser = createPersistedState('github-user');

interface Props {
	clientID: string;
	clientSecret: string;
	repo: string;
	owner: string;
	admin: Array<string>;
	id: string;
}

const useStyles = makeStyles((theme) => ({
	link: {
		color: theme.palette.text.primary,
	},
}));

const anonymousUser: User = { username: '未登录用户' };

const CommentComponent: React.FC<Props> = (props) => {
	const classes = useStyles();
	const [token, setToken] = useToken<string | undefined>(undefined);
	const revokeToken = (): void => {
		setToken(undefined);
		setUser(anonymousUser);
	};
	const [user, setUser] = useUser<User>(anonymousUser);
	const [comments, setComments] = useState<Comments>({
		count: 0,
		page: 0,
		perPage: 0,
		data: [],
	});
	const [noIssue, setNoIssue] = useState(false);
	const filteredComments = comments.data.filter(
		(comment) => !comment.isMinimized
	);
	const [issue, setIssue] = useState<Issue | null>(null);
	const [createIssueLoading, setCreateIssueLoading] = useState(false);
	const authorized =
		user.username !== anonymousUser.username && token != null && !noIssue;
	const isAdmin = props.admin.indexOf(user.username) >= 0;
	const githubApiProps = {
		baseURL: 'https://github.com',
		owner: props.owner,
		repo: props.repo,
		labels: ['gitalk'],
		clientId: props.clientID,
		clientSecret: props.clientSecret,
		state: '123',
		proxy: (url: string) => `https://cors-anywhere.mgt.workers.dev/?${url}`,
	};
	const [githubApi3, githubApi4] = [
		new GithubV3(githubApiProps),
		new GithubV4(githubApiProps),
	];
	useEffect(() => {
		const asyncFunc = async (): Promise<void> => {
			let tk = token;
			if (!tk) {
				tk = await githubApi3.handleAuth();
				if (tk !== null) {
					setToken(tk);
				}
			}
			const result = await getComments(
				githubApi3,
				githubApi4,
				props.id,
				revokeToken,
				tk
			);
			if (result === 'noIssue') {
				setNoIssue(true);
			} else if (result !== 'invalidToken') {
				const [i, c] = result;
				setComments(c);
				setIssue(i);
			}
			const u: User = await githubApi3.getUser({ accessToken: tk });
			setUser(u);
		};

		asyncFunc().catch((reject) => {
			console.log(reject);
		});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.clientID, props.clientSecret, props.id]);
	const updateComments = async (): Promise<void> => {
		const result = await getComments(
			githubApi3,
			githubApi4,
			props.id,
			revokeToken,
			token
		);
		if (result !== 'invalidToken' && result !== 'noIssue') {
			const [, c] = result;
			setComments(c);
		}
	};
	const NoIssueComponent = (): React.ReactElement => {
		return isAdmin ? (
			<Typography
				variant="body1"
				style={{ padding: '24px', textAlign: 'center' }}
			>
				<Button
					variant="outlined"
					color="primary"
					disabled={createIssueLoading}
					onClick={async () => {
						setCreateIssueLoading(true);
						await githubApi4.postIssue({
							accessToken: token,
							title: props.id,
							content: location.href,
						});
						// sleep 1s, 直接查询会返回无结果，迷惑
						await new Promise((resolve) =>
							setTimeout(resolve, 1000)
						);
						const result = await getComments(
							githubApi3,
							githubApi4,
							props.id,
							revokeToken,
							token
						);
						setCreateIssueLoading(false);
						if (result !== 'invalidToken' && result !== 'noIssue') {
							const [i, c] = result;
							setNoIssue(false);
							setComments(c);
							setIssue(i);
						}
					}}
				>
					为本页面创建 Issue
					{createIssueLoading && (
						<CircularProgress
							size={20}
							style={{ marginLeft: '4px' }}
						/>
					)}
				</Button>
			</Typography>
		) : (
			<Typography
				variant="body1"
				style={{ padding: '24px', textAlign: 'center' }}
			>
				没有找到与本页面相关联的 issue
			</Typography>
		);
	};
	return (
		<InputContentProvider>
			<Typography variant="h6">
				<Tooltip title="在 GitHub 上查看">
					<a
						href={issue?.link}
						className={classes.link}
					>{`${filteredComments.length} 条评论`}</a>
				</Tooltip>
				<Tooltip title={authorized ? '登出' : '登录'}>
					<div
						style={{ float: 'right', cursor: 'pointer' }}
						onClick={() => {
							if (!token) {
								githubApi3.redirectAuth();
							} else {
								setToken(undefined);
								setUser(anonymousUser);
							}
						}}
					>
						{user.username}
					</div>
				</Tooltip>
			</Typography>
			<Divider />
			<CommentInput
				name={user.username}
				avatarLink={user.avatar!}
				authorized={authorized}
				showLogin={token === null}
				handleLogin={() => {
					githubApi3.redirectAuth();
				}}
				sendComment={async (v, setLoading) => {
					setLoading(true);
					try {
						await githubApi3.postComment({
							accessToken: token,
							issueId: issue!.id,
							content: v,
						});
					} catch (e) {
						setLoading(false);
						return;
					}
					updateComments();
					setLoading(false);
				}}
			/>
			{noIssue ? (
				<NoIssueComponent />
			) : (
				filteredComments.map(
					({
						content,
						author,
						createdAt,
						reactions,
						id,
						contentRaw,
					}) => (
						<CommentCard
							avatarLink={author.avatar!}
							disabled={!authorized}
							name={author.username}
							contentHTML={content}
							contentRaw={contentRaw}
							time={createdAt}
							key={id}
							reactions={
								reactions === null ? undefined : reactions
							}
							currentUser={user}
							commentID={id}
							deleteComment={async (
								commentId,
								setDeleteLoading
							) => {
								setDeleteLoading(true);
								await githubApi4.deleteComment({
									accessToken: token,
									commentId,
									issueId: issue!.id,
								});
								updateComments();
								setDeleteLoading(false);
							}}
							addReaction={async (commentId, reaction) => {
								await githubApi4.postCommentReaction({
									accessToken: token,
									commentId,
									reaction,
									issueId: issue!.id,
								});
							}}
							removeReaction={async (commentId, reaction) => {
								await githubApi4.deleteCommentReaction({
									accessToken: token,
									commentId,
									reaction,
									issueId: issue!.id,
								});
							}}
						/>
					)
				)
			)}
		</InputContentProvider>
	);
};

export default CommentComponent;
