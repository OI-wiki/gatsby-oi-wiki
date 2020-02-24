# 为换框架所做出的尝试（

Demo: https://ng.oi-wiki.org/

TG 群：https://t.me/joinchat/GaEGzhcWGl8-1CSjdhi9kA

## 如何参与

`yarn install` 或 `npm install` 安装所需插件

`yarn develop` 或 `npm develop` 本地启动一个 server

去 [插件列表](https://www.gatsbyjs.org/plugins/) 找有趣的功能尝试加入进来

## FAQ

- 先不用加入 wiki 中大量的文件，sidebar 和子文件夹均测试过已经 work 了
- 在点 sidebar 切换页面之后 mathjax 不会重新加载
- 图片不能再放 `./images` 了，目前来看应该得放 `/static`
- `sidebar.mdx`的链接必须是绝对链接（以`/`开头）
- Latex中不能出现`\left<\right>`，否则会gg。要写成`\left\langle\right\rangle`。
- netlify 好像会把 url 最后的 `/` 给自动去掉。检查内链用的页面：https://oi-wiki-ng.netlify.com/math/poly/newton/
- 主题里面有 remark-emoji 和 remark-slug 但是不知道什么原因没有 work。可能我们要在 gatsby-config 里面也加一下

## 关于 gatsby-remark-table-of-contents

魔改的原版，这是一个local的module。

支持作为gatsby-plugin-mdx的remark插件

有一些feature，都写在配置里了。稍微解释一下：

1. exclude：排除一些标题不在TOC中；
2. tight：让生成的toc列表更紧凑
3. every：魔改的。设为true：对每篇文章生成TOC，放在开头。如果没有h1就不生成TOC。设为false：将文章中第一个单独`[TOC]`的段落替换为TOC。
4. fromHeading,toHeading：设置生成TOC的标题大小范围

要加feature可以随时提出～
