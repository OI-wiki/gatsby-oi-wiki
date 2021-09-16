import { CssBaseline, Divider, Grid, Typography } from "@material-ui/core";

import { makeStyles, ThemeProvider, useTheme } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import FormatPaintIcon from "@material-ui/icons/FormatPaint";
import React from "react";
import { Helmet } from "react-helmet";
import { graphql, useStaticQuery } from "gatsby";
import {
	adaptiveTheme,
	AutoCssBaseline,
	CustomCssBaseline,
	DarkCssBaseline,
	LightCssBaseline,
	SecondaryColorCssBaseline,
} from "../theme";
import { scrollbarStyle } from "../styles/scrollbar";
import Comment from "./Comment";
import Toc, { TocItem } from "./Toc";
import BackTop from "./BackTop";
import Footer from "./Footer";
import Meta, { MetaProps } from "./Meta";
import Title from "./Title";
import NavAndDrawer from "./NavAndDrawer";
import { RequiredNonNull } from "../types/common";
import { CSSProperties } from "@material-ui/core/styles/withStyles";

const useStyles = makeStyles((theme) => {
	const flexContainer: CSSProperties = {
		display: "flex",
		flexDirection: "column",
	};
	return {
		toolbar: {
			[theme.breakpoints.down("md")]: {
				minHeight: 64,
			},
			minHeight: 48 + 64,
			alignItems: "flex-start",
		},
		content: {
			flexGrow: 1,
			width: "100%",
			...flexContainer,
		},
		main: {
			padding: theme.spacing(5),
			[theme.breakpoints.down("md")]: {
				padding: theme.spacing(2),
			},
			"& .math-display": scrollbarStyle(theme, {
				overflow: "auto",
			}),
			flexGrow: 1,
			...flexContainer,
		},
		divider: {
			marginTop: theme.spacing(2),
			marginBottom: theme.spacing(2),
		},
		footer: {
			background: theme.palette.footer.background,
			color: theme.palette.footer.text,
			padding: theme.spacing(3),
			[theme.breakpoints.up("lg")]: {
				marginLeft: 250,
			},
		},
		container: {
			[theme.breakpoints.up("lg")]: {
				marginLeft: 250,
			},
			overflow: "hidden",
			flexGrow: 1,
			...flexContainer,
		},
		paragraph: {
			flexGrow: 1,
			...flexContainer,
		},
		wip: {
			margin: `${theme.spacing(2)}px 0px`,
		},
	};
});

interface MyLayoutProps extends Partial<MetaProps> {
	description?: string;
	toc?: TocItem[];
	noTitle?: boolean;
	noMeta?: boolean;
	noComment?: boolean;
	noEdit?: boolean;
	noToc?: boolean;
	overflow?: boolean;
	isWIP?: boolean;
}

const MyLayout: React.FC<MyLayoutProps> = (props) => {
	const theme = useTheme();
	const classes = useStyles();
	const data = useStaticQuery<GatsbyTypes.SiteDescQuery>(graphql`
		query SiteDesc {
			site {
				siteMetadata {
					description
					title
				}
			}
		}
	`);

	const { description: siteDesc, title: siteTitle } = data?.site
		?.siteMetadata as RequiredNonNull<GatsbyTypes.SiteSiteMetadata>;

	const {
		title = "",
		description = "",
		authors = "",
		relativePath = "",
		modifiedTime = "",
		tags = [],
		toc = null,
		noTitle = false,
		noMeta = false,
		noComment = false,
		noEdit = true,
		noToc = !props.toc || props.toc.length == 0,
		overflow = false,
		isWIP = false,
		location = window.location,
		children,
	} = props;
	const titleMetaProps = { title, location, relativePath };
	const metaProps = { tags, modifiedTime, authors };

	const gridWidthMdUp = overflow ? 12 : 10;
	const desc = description || siteDesc;

	const WIPAlert = (
		<Alert
			severity="info"
			icon={<FormatPaintIcon />}
			className={classes.wip}
		>
			本文内容尚不完善，我们正在努力施工中。您可以保存此页链接稍后再看，或者帮助我们修订此页面！
		</Alert>
	);
	return (
		<>
			<Helmet>
				<title>{`${
					!title || title === siteTitle ? "" : `${title} - `
				}${siteTitle}`}</title>
				<meta name="color-scheme" content="dark light" />
				<meta name="description" content={desc} />
			</Helmet>
			<NavAndDrawer pathname={location?.pathname} />
			<div className="maincontentdiv">
				<Grid container style={{ minHeight: "100vh" }}>
					<Grid
						item
						xs={12}
						sm={12}
						md={gridWidthMdUp}
						lg={gridWidthMdUp}
						xl={gridWidthMdUp}
						style={{
							display: "flex",
							flexDirection: "column",
						}}
					>
						<div className={classes.toolbar} />
						<div className={classes.container}>
							<main className={classes.content}>
								<div className={classes.main}>
									{!noTitle && (
										<>
											<Title
												noEdit={noEdit}
												noMeta={noMeta}
												{...titleMetaProps}
											/>
											<Divider
												className={classes.divider}
											/>
										</>
									)}
									{isWIP && WIPAlert}
									<Typography
										className={classes.paragraph}
										variant="body1"
										component="div"
									>
										{children}
									</Typography>
									{!noMeta && (
										<Meta
											{...titleMetaProps}
											{...metaProps}
										/>
									)}
									{!noComment && (
										<div
											style={{
												width: "100%",
												marginTop: theme.spacing(2),
											}}
										>
											<Comment title={title} />
										</div>
									)}
								</div>
							</main>
						</div>
					</Grid>
				</Grid>
				<Divider />
				<div className={classes.footer}>
					<Footer />
				</div>
			</div>
			{!noToc && toc?.length && (
				<Grid item xs>
					<Toc toc={toc} pathname={location.pathname} />
				</Grid>
			)}
			<BackTop />
		</>
	);
};

const StyledLayout: React.FC<MyLayoutProps> = (props) => (
	<ThemeProvider theme={adaptiveTheme}>
		<CssBaseline />
		<CustomCssBaseline />
		<LightCssBaseline />
		<DarkCssBaseline />
		<SecondaryColorCssBaseline />
		<AutoCssBaseline />
		<MyLayout {...props} />
	</ThemeProvider>
);

export default StyledLayout;
