/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

const IS_EXEC_BUILD = process.env.gatsby_executing_command === 'build'
const IS_PROD = process.env.PRODUCTION === 'true' ||
                process.env.NODE_ENV === 'production' ||
                process.env.RENDER === 'true'

/**
 * 根据条件生成配置，需要展开
 * @param cond boolean 条件
 * @param v any 配置
 * @returns {[v]} 返回 [v] 或 []
 */
const needPlugin = (cond, v) => (cond ? [v] : [])

// 提供一些警告
if (IS_PROD && !IS_EXEC_BUILD) {
  console.warn('Using production configurations in non-build environment')
} else if (!IS_PROD && process.env.CI === 'true') {
  console.warn('Using development configurations in build environment')
}

const fontURL = 'https://cdn.jsdelivr.net/npm/mathjax@3.0.5/es5/output/chtml/fonts/woff-v2'
const mathRehype = IS_EXEC_BUILD
  ? [require('rehype-mathjax/chtml'), { fontURL }]
  : [require('rehype-mathjax/browser')]

module.exports = {
  siteMetadata: {
    title: 'OI Wiki',
    description: 'OI Wiki 是一个编程竞赛知识整合站点，提供有趣又实用的编程竞赛知识以及其他有帮助的内容，帮助广大编程竞赛爱好者更快更深入地学习编程竞赛',
    author: 'OI Wiki Team',
    siteUrl: 'https://ng.oi-wiki.org',
  },
  plugins: [
    {
      resolve: 'gatsby-source-local-git',
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: './docs',
        path: path.resolve('./docs'),
      },
    },
    ...needPlugin(IS_PROD, 'gatsby-plugin-sharp'),
    {
      resolve: 'gatsby-transformer-sharp',
    },
    {
      resolve: 'gatsby-transformer-remark-rehype',
      options: {
        plugins: [
          ...needPlugin(IS_PROD, {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 900,
              withWebp: true,
              tracedSVG: false,
              linkImagesToOriginal: false,
              disableBgImageOnAlpha: true,
            },
          }),
          {
            resolve: 'gatsby-remark-copy-linked-files',
            options: {
              ignoreFileExtensions: ['md'],
            },
          },
          /** {
              resolve: `gatsby-remark-autolink-headers`,
              options: {
                isIconAfterHeader: true,
              },
            }, */
          {
            resolve: 'gatsby-local-autolink-headers',
            options: {
              isIconAfterHeader: true,
            },
          },
        ],
        remarkPlugins: [
          require('remark-math'),
          require('remark-details'),
          [require('@mgtd/remark-shiki'), {
            semantic: false,
            theme: 'light-plus',
            skipInline: true,
          }],
        ],
        rehypePlugins: [
          require('rehype-details'),
          require('./plugins/rehype-pseudocodejs'),
          mathRehype,
        ],
        extensions: ['.mdx', '.md'],
      },
    },
    {
      resolve: 'gatsby-plugin-material-ui',
      options: {
        stylesProvider: {
          injectFirst: true,
        },
      },
    },
    {
      resolve: 'gatsby-plugin-catch-links',
    },
    {
      resolve: 'gatsby-plugin-react-helmet',
    },
    ...needPlugin(IS_PROD, {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'OI Wiki',
        short_name: 'OI Wiki',
        start_url: '/',
        display: 'standalone',
        icon: require.resolve('./icon/favicon_512x512.png'),
      },
    }),
    {
      resolve: 'gatsby-plugin-offline',
      options: {
        precachePages: [],
        workboxConfig: {
          importWorkboxFrom: 'local',
          globPatterns: ['*.js'],
          runtimeCaching: [
            {
              urlPattern: /(\.js$|\.css$)/, // js and css
              handler: 'CacheFirst',
            },
            {
              urlPattern: /^https?:.*\.(json)$/, // page-data
              handler: 'NetworkFirst',
            },
            {
              urlPattern: /^https?:.*\.(woff|woff2)$/, // mathjax fonts
              handler: 'StaleWhileRevalidate',
            },
            {
              urlPattern: /^https?:.*\.(png|jpg|jpeg|webp|svg|gif|tiff)$/, // do not cache images
              handler: 'NetworkOnly',
            },
          ],
          skipWaiting: true,
          clientsClaim: true,
        },
      },
    },
    {
      resolve: 'gatsby-plugin-typegen',
      options: {
        outputPath: path.resolve(__dirname, 'src/__generated__/gatsby-types.d.ts'),
        emitSchema: {
          [path.resolve(__dirname, 'src/__generated__/gatsby-schema.graphql')]: true,
          [path.resolve(__dirname, 'src/__generated__/gatsby-introspection.json')]: true,
          'src/__generated__/gatsby-schema.graphql': true,
        },
        emitPluginDocuments: {
          [path.resolve(__dirname, 'src/__generated__/gatsby-plugin-documents.graphql')]: true,
        },
      },
    },
    // {
    //   resolve: 'gatsby-plugin-ts',
    //   options: {
    //     tsloader: {
    //       loglevel: 'warn',
    //     },
    //     forktscheckerplugin: {
    //       eslint: true,
    //     },
    //     filename: 'types/graphql-types.ts',
    //     codegen: true,
    //     codegendelay: 250,
    //     alwayscheck: false,
    //   },
    // },
    // {
    //   resolve: 'gatsby-plugin-advanced-sitemap',
    //   options: {
    //     // 1 query for each data type
    //     query: `
    //     {
    //       allMarkdownRemark {
    //         edges {
    //           node {
    //             id
    //             fields{
    //               slug
    //             }
    //           }
    //         }
    //       }
    //     }`,
    //     mapping: {
    //       // Each data type can be mapped to a predefined sitemap
    //       // Routes can be grouped in one of: posts, tags, authors, pages, or a custom name
    //       // The default sitemap - if none is passed - will be pages
    //       allMarkdownRemark: {
    //         sitemap: 'documents',
    //       },
    //     },
    //     exclude: [
    //       '/dev-404-page/',
    //       '/404.tsx/',
    //       '/404.html',
    //       '/offline-plugin-app-shell-fallback/',
    //       //          `/(\/)?hash-\S*/`, // you can also pass valid RegExp to exclude internal tags for example
    //     ],
    //     createLinkInHead: true, // optional: create a link in the `<head>` of your site
    //     addUncaughtPages: true, // optional: will fill up pages that are not caught by queries and mapping and list them under `sitemap-pages.xml`
    //   },
    // },
    'gatsby-plugin-preact',
    // "gatsby-plugin-webpack-bundle-analyser-v2",
    // when you need to analyze bundle size, enable it
  ],
}
