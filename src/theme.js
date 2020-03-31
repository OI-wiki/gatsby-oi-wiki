/**
 * This theme uses `theme-ui` under the hood.
 * @see https://theme-ui.com/
 * @see https://theme-ui.com/gatsby-plugin/
 */

import prism from "@theme-ui/prism/presets/theme-ui"
import { alpha } from "@theme-ui/color"

export default {
  breakpoints: ["768px", "992px", "1200px"],
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  initialColorMode: "light",
  useColorSchemeMediaQuery: true,
  colors: {
    text: "#011627",
    background: "rgba(0,0,0,.06)",
    primary: "#1890ff",
    secondary: "#2EC4B6",
    accent: "#FF9F1C",
    muted: "#FAFAFA",
    toc: "#484848",
    hover: "#1890FF",
    modes: {
      dark: {
        // text: "#FDFFFC",
        // toc: "#D3D3D3",
        // background: "#011627",
      },
    },
  },
  fonts: {
    body:
      '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    heading: "inherit",
    monospace: "SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace",
  },
  fontSizes: [12, 14, 16, 18, 24, 32, 40, 48, 56, 64],
  fontWeights: {
    body: 400,
    heading: 700,
    bold: 700,
  },
  lineHeights: {
    body: 1.5,
    heading: 1.125,
  },
  textStyles: {
    heading: {
      fontFamily: "heading",
      fontWeight: "heading",
      lineHeight: "heading",
    },
  },
  linkStyles: {
    nav: {
      color: "inherit",
      display: "block",
      p: "0.75rem 1.5rem",
      ":hover": {
        color: "primary",
        textDecoration: "none",
      },
      "&.active": {
        color: "primary",
        fontWeight: "bold",
      },
    },
  },
  styles: {
    root: {
      fontFamily: "body",
      fontWeight: "body",
      lineHeight: "body",
      fontSize: [1, 2],
    },
    h1: {
      variant: "textStyles.heading",
      fontSize: [5, 6],
      pt: "3rem",
      mt: "-3rem",
    },
    h2: {
      variant: "textStyles.heading",
      fontSize: [4, 5],
      pt: "3rem",
      mt: "-1.5rem",
    },
    h3: {
      variant: "textStyles.heading",
      fontSize: [3, 4],
      pt: "3rem",
      mt: "-2rem",
    },
    h4: {
      variant: "textStyles.heading",
      fontSize: [2, 3],
      pt: "3rem",
      mt: "-2.5rem",
    },
    h5: {
      variant: "textStyles.heading",
      fontSize: [1, 2],
      pt: "3rem",
      mt: "-2.75rem",
    },
    h6: {
      variant: "textStyles.heading",
      fontSize: [0, 1],
      pt: "3rem",
      mt: "-3rem",
    },
    p: {
      fontSize: [1, 2],
    },
    a: {
      color: "primary",
      textDecoration: "none",
      ":hover": {
        textDecoration: "none",
      },
      "&.active": {
        color: "text",
      },
    },
    pre: {
      marginTop: "0.7rem",
      fontFamily: "monospace",
      overflowX: "auto",
      p: 3,
      borderRadius: "0.5rem",
      bg: "text",
      color: "background",
      ...prism,
      code: {
        color: "inherit",
      },
    },
    code: {
      fontFamily: "monospace",
      fontSize: "inherit",
    },
    table: {
      width: "100%",
      overflow: "auto",
      borderCollapse: "collapse",
      borderSpacing: 0,
    },
    tr: {
      borderTop: "1px solid gray",
    },
    th: {
      border: "1px solid",
      borderColor: alpha("text", 0.25),
      p: "0.25em 0.5em",
    },
    td: {
      border: "1px solid",
      borderColor: alpha("text", 0.25),
      p: "0.25em 0.5em",
    },
    blockquote: {
      pl: ".6rem",
      borderLeft: ".3rem solid rgba(0,0,0,.26)",
      color: "rgba(0,0,0,.54)",
      margin: "1em 0",
      boxSizing: "inherit",
    },
    img: {
      maxWidth: "100%",
    },
  },
  links: {
    color: "#fff",
  },
  layout: {
    global: {
      html: {
        boxSizing: "border-box",
        fontSize: 0,
      },
      [["*", "*:after", "*:before"]]: {
        boxSizing: "inherit",
      },
      body: {
        margin: 0,
      },
      "::selection": {
        color: "background",
        bg: "primary",
      },
    },
    root: {
      minHeight: "100vh",
      maxWidth: "95%",
      mx: "auto",
      overflowX: "hidden",
    },
    sidebar: {
      width: 300,
      height: "100%",
      background: "#fff",
      position: "fixed",
      zIndex: 19,
      // mr: '-100%',
      //left: [theme => -theme.layout.sidebar.width, null, "auto"],
      visibility: [null, null, null, "visible"],
      transition: "left 0.1s",
      outline: 0,
      "&.active": {
        left: "auto",
        visibility: "visible",
      },
      top: "3rem",
      a: {
        ":hover": {
          textDecoration: "none",
        },
      },
    },
    navbar: {
      navList: {
        listStyle: "none",
        m: 0,
        ml: "auto",
        p: 0,
      },
      logo: {
        float: "left",
        fontSize: "large",
        color: "black",
        display: ["none", null, null, "inline"],
      },
      toggleSider: {
        float: "left",
        color: "black",
        display: ["inline", null, null, "none"],
      },
    },
    www: {
      flexDirection: "row",
      background: "#fff",
    },
    main: {
      background: "#fff",
      mt: "4em",
      width: [
        "100%",
        null,
        null,
        (theme) =>
          `calc(100% - ${theme.layout.sidebar.width}px - ${theme.layout.toc.width})`,
      ],
      ml: [null, null, null, (theme) => theme.layout.sidebar.width],
      //float: [null, null, null, "left"],
      transition: "margin-left 0.1s",
      "&.pushed": {
        ml: (theme) => theme.layout.sidebar.width,
      },
      flex: "none",
      minHeight: "100vh",
    },
    container: {
      width: "100%",
      mx: "auto",
      my: 4,
      px: 3,
    },
    toc: {
      visibility: ["hidden", null, null, "visible"],
      right: "0em",
      top: "6em",
      float: "right",
      position: "fixed",
      width: "20%",
      a: {
        color: "toc",
        textDecoration: "none",
        transition: "0.2s",
        ":hover": {
          transition: "0.2s",
          color: "primary",
        },
        "&.active": {
          color: "text",
        },
      },
      ul: {
        listStyleType: "none",
        paddingLeft: "1em",
      },
      ".is-current a": {
        color: "primary",
      },
    },
    footer: {
      width: [
        "100%",
        null,
        null,
        (theme) => `calc(100% - ${theme.layout.sidebar.width}px)`,
      ],
      ml: [null, null, null, (theme) => theme.layout.sidebar.width],
    },
    search: {
      width: 200,
    },
  },
}
