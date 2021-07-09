/* eslint-disa/home/iskyex/projects/summer-2021/gatsby-oi-wiki/gatsby-theme-oi-wikible @typescript-eslint/no-var/home/iskyex/projects/summer-2021/gatsby-oi-wiki/gatsby-theme-oi-wiki-requires */
const path = require('path')
const fs = require('fs')
const yaml = require('js-yaml')

// 清除注释，实现在此处导入配置
// const SITE_CONFIG = yaml.load(fs.readFileSync(path.resolve(__dirname, './config/site.yaml'), 'utf-8'), () => {
//   console.warn('Has no site.yaml under config dir')
// })

module.exports = {
  plugins: [
    {
      resolve: "gatsby-theme-oi-wiki",
      options: {
        // 清除注释，实现在此处导入配置
        // config: SITE_CONFIG
        config: path.resolve(__dirname, './config/site.yaml')
      }
    }
  ]
}
