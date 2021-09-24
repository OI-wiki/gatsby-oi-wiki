import {
	Button,
	ButtonGroup,
	CircularProgress,
	Collapse,
	Fade,
	FormControlLabel,
	Grid,
	Link,
	makeStyles,
	Switch,
} from '@material-ui/core';
import PlayArrow from '@material-ui/icons/PlayArrow';
import type { PageProps } from 'gatsby';
import { graphql, useStaticQuery } from 'gatsby';
import React, { useCallback, useRef, useState } from 'react';
import CodeEditor from '../components/CodeRunner';
import type { IndicatorProps } from '../components/Indicator';
import Indicator from '../components/Indicator';
import CodeLangMenu from '../components/CodeLangMenu';
import Output from '../components/Output';
import Layout from '../components/StyledLayout';
import type { LangType } from '../components/CodeRunner/codeLang';
import type { TransformedResponseData } from '../components/CodeRunner/useRunner';
import { useRunner } from '../components/CodeRunner/useRunner';

const useStyles = makeStyles((theme) => ({
	langMenu: {
		width: 96,
		textTransform: 'none',
	},
	editor: {
		minHeight: 400,
	},
	editorContainer: {
		marginBottom: theme.spacing(2),
	},
	progress: {
		position: 'absolute',
		left: '50%',
		top: '50%',
		marginLeft: -12,
		marginTop: -12,
	},
	footer: {
		textAlign: 'center',
		marginTop: theme.spacing(4),
	},
	footerLink: {
		color: '#FD9F40',
		'& > img': {
			display: 'inline',
			verticalAlign: 'middle',
			marginTop: -4,
		},
		'&:hover': {
			color: '#FC6012',
		},
	},
}));

export type PlaygroundLocationState = Partial<{
	lang: LangType;
	code: string;
	input: string;
}>;

const Playground: React.FC<
	PageProps<unknown, unknown, PlaygroundLocationState>
> = ({ location }) => {
	// state maybe undefined/null in gatsby build
	const locState = location.state ?? {};

	const classes = useStyles();

	const [lang, setLang] = useState<LangType>(locState.lang ?? 'C++');
	const [o2, setO2] = useState(false);

	const [code, setCode] = useState(locState.code ?? '');
	const [input, setInput] = useState(locState.input ?? '');
	const [output, setOutput] = useState<TransformedResponseData | null>(null);

	const [runInfo, setRunInfo] = useState<IndicatorProps | null>(null);

	const outputRef = useRef<HTMLElement>(null);

	const judgeDuckImgUrl: string = useStaticQuery(graphql`
		{
			allFile(filter: { name: { eq: "judgeduck" } }) {
				edges {
					node {
						publicURL
					}
				}
			}
		}
	`).allFile.edges[0].node.publicURL;

	const runCodeCb = useCallback((data: TransformedResponseData) => {
		setOutput(data);
		setRunInfo(
			data.status === 'Run Finished'
				? { type: 'success', msg: 'Success' }
				: { type: 'warning', msg: 'Checkout output for error details' }
		);

		outputRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, []);
	const errorCb = useCallback((msg: string) => {
		setRunInfo({ type: 'error', msg });
	}, []);
	const { sendRunnerReq, waiting } = useRunner(
		{ stdin: input, code, language: lang, flags: o2 ? '-O2' : '' },
		runCodeCb,
		errorCb
	);

	const handleRunClick = useCallback(() => {
		setRunInfo(null);
		sendRunnerReq();
	}, [sendRunnerReq]);

	return (
		<Layout
			location={location}
			title="Playground"
			noComment
			noEdit
			noToc
			noMeta
			overflow
		>
			<Grid container spacing={3} alignItems="center">
				<Grid item>
					<ButtonGroup>
						<CodeLangMenu
							lang={lang}
							setLang={setLang}
							variant="contained"
							className={classes.langMenu}
							aria-label="select language for code running"
						/>
						<Button
							variant="contained"
							color="secondary"
							endIcon={<PlayArrow />}
							onClick={handleRunClick}
							disabled={waiting}
						>
							运行
							{waiting && (
								<CircularProgress
									className={classes.progress}
									color="secondary"
									size={24}
								/>
							)}
						</Button>
					</ButtonGroup>
				</Grid>
				<Grid item>
					<Fade in={!!runInfo}>
						<Indicator type={undefined} msg="" {...runInfo} />
					</Fade>
				</Grid>
				<Grid item style={{ marginLeft: 'auto' }}>
					<FormControlLabel
						checked={o2}
						control={
							<Switch
								size="small"
								checked={o2}
								onChange={(e) => {
									setO2(e.target.checked);
								}}
							/>
						}
						label="开启O2优化"
					/>
				</Grid>
			</Grid>
			<Grid
				container
				spacing={3}
				className={classes.editorContainer}
				alignItems="stretch"
			>
				<Grid xs={12} md={8} className={classes.editor} item>
					<CodeEditor
						lang={lang}
						title="代码"
						value={code}
						onChange={(val) => {
							setCode(val);
						}}
					/>
				</Grid>
				<Grid xs={12} md={4} item container direction="column">
					<Grid className={classes.editor} item>
						<CodeEditor
							title="输入"
							value={input}
							onChange={(val) => {
								setInput(val);
							}}
						/>
					</Grid>
				</Grid>
			</Grid>
			<Collapse in={['success', 'warning'].includes(runInfo?.type ?? '')}>
				<Output ref={outputRef} output={output} />
			</Collapse>
			<div className={classes.footer}>
				<Link
					className={classes.footerLink}
					href="https://duck.ac/"
					underline="none"
					target="_blank"
					variant="h6"
				>
					{'Powered by '}
					<img src={judgeDuckImgUrl} alt="JudgeDuck" height="30" />
				</Link>
			</div>
		</Layout>
	);
};

export default Playground;
