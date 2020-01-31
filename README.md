# 为换框架所做出的尝试（

Demo: https://oi-wiki-ng.netlify.com/

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
