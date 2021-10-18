# gatsby-oiwiki

[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/OI-wiki/gatsby-oi-wiki)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FOI-wiki%2Fgatsby-oi-wiki.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2FOI-wiki%2Fgatsby-oi-wiki?ref=badge_shield)

正在开发中的基于 gatsby 的渲染框架。欢迎您点击下方链接入群并参与项目。

Demo：https://next.oi-wiki.org/

TG 群：https://t.me/joinchat/GaEGzhcWGl8-1CSjdhi9kA

## 如何参与

一般情况下，你需要把本项目先 Fork 一份。

### 在本地开发

准备好 Git 和 NodeJS。注意，NodeJS 版本应当大于等于 14. 请勿使用 taobao 等 npm 镜像。

#### Linux

```shell
git clone https://github.com/{你的 GitHub 用户名}/gatsby-oi-wiki.git # 将仓库克隆至本地
cd gatsby-oi-wiki # 进入仓库文件夹
yarn install --ignore-optional # 安装依赖，如果你可以解决国际联网问题，可以使用 yarn install

```

#### Windows

首先，在安装 NodeJS 时，请确保你选择了“Install Additional Tools for Node.js”这一项，如果没有安装，可以在开始菜单里找到这一项并安装。

然后克隆本项目的仓库，并安装依赖
```shell

git clone https://github.com/{你的 GitHub 用户名}/gatsby-oi-wiki.git
cd gatsby-oi-wiki
yarn install --ignore-optional # 安装依赖，如果你可以解决国际联网问题，可以使用 yarn install
```


至此，准备工作已经完成；接下来，是三种基本操作：

```shell
# 开发环境
yarn develop # 运行开发服务器
yarn build # 构建项目并生成静态文件
# 清除缓存
yarn clean # 当你发现浏览的界面与预期不同时，可以尝试清理缓存
              # Gatsby的缓存存放在两个目录中：public 目录存储静态页面文件，.cache 目录存储临时文件
              # 你也可以通过手动删除这两个文件夹达到清理效果
```

------

## Tips

- 先不用加入 wiki 中大量的文件，sidebar 和子文件夹均测试过已经 work 了
- 由于插件的存在，建议直接使用 jpg/png 图片，插件会自动生成对应的 webp 图片。
- 可以借鉴学习的设计：
  - https://www.tensorflow.org/api_docs/python/tf/keras/layers/ReLU
  - https://source.android.com/
  - http://material.io
  - https://cloud.google.com/vision/docs/quickstart

要加 feature 可以随时提出～


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FOI-wiki%2Fgatsby-oi-wiki.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FOI-wiki%2Fgatsby-oi-wiki?ref=badge_large)

## Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/OI-wiki/gatsby-oi-wiki)

[![Deploy with ZEIT Now](https://zeit.co/button)](https://zeit.co/import/project?template=https://github.com/OI-wiki/gatsby-oi-wiki)
