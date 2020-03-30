[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/Ir1d/oi-wiki-ng) 

# 为换框架所做出的尝试（

Demo: https://ng.oi-wiki.org/

TG 群：https://t.me/joinchat/GaEGzhcWGl8-1CSjdhi9kA

## 如何参与

首先，准备好Git和Node.JS（其中包含npm）

```shell
npm install -g windows-build-tools #如果你是Windows用户，请务必在进行下列操作前执行此项；
                                   #该操作将执行20分钟甚至更多，期间可能会出现停在一个页面不动以及CPU飙升的情况，属正常现象
git clone https://github.com/Ir1d/oi-wiki-ng.git #将仓库克隆至本地
cd oi-wiki-ng #进入仓库文件夹
npm install #安装依赖
```

至此，准备工作已经完成；你可能需要一些工具来解决下载慢/下载难问题。

```shell
gatsby develop #运行一个本地服务器，在浏览器输入 http://localhost:8000/ 即可访问
# ---
gatsby build #渲染页面
gatsby serve #为刚刚生成的文件运行一个“服务器”，在浏览器输入 http://localhost:9000/ 即可访问
             #与之前不同的是，前者运行的服务器在运行期间会随着文件的变化而变化，后者则保持不变
# ---
gatsby clean #当你发现浏览的界面与预期不同时，可以尝试清理缓存
             #Gatsby的缓存有两个：/public存储静态页面文件，/.cache存储临时文件
             #你也可以通过手动删除这两个文件夹达到清理效果
```

去 [插件列表](https://www.gatsbyjs.org/plugins/) 找有趣的功能尝试加入进来

## FAQ

- 先不用加入 wiki 中大量的文件，sidebar 和子文件夹均测试过已经 work 了
- 在点 sidebar 切换页面之后 mathjax 不会重新加载
- 图片不能再放 `./images` 了，目前来看应该得放 `/static`
- `sidebar.mdx`的链接必须是绝对链接（以`/`开头）
- Latex中不能出现`\left<\right>`，否则会gg。要写成`\left\langle\right\rangle`。
- netlify 好像会把 url 最后的 `/` 给自动去掉。检查内链用的页面：https://oi-wiki-ng.netlify.com/math/poly/newton/
- 主题里面有 remark-emoji 和 remark-slug 但是不知道什么原因没有 work。可能我们要在 gatsby-config 里面也加一下
- 由于插件的存在，建议直接使用 jpg/png 图片，插件会自动生成对应的 webp 图片。

## 关于 gatsby-remark-table-of-contents

魔改的原版，这是一个local的module。

支持作为gatsby-plugin-mdx的remark插件

有一些feature，都写在配置里了。稍微解释一下：

1. exclude：排除一些标题不在TOC中；
2. tight：让生成的toc列表更紧凑
3. every：魔改的。设为true：对每篇文章生成TOC，放在开头。如果没有h1就不生成TOC。设为false：将文章中第一个单独`[TOC]`的段落替换为TOC。
4. fromHeading,toHeading：设置生成TOC的标题大小范围

要加feature可以随时提出～
