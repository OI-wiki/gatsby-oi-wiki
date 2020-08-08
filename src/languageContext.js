import React from 'react'
import sidebarZh from './sidebar.zh.yaml'
import sidebarEn from './sidebar.en.yaml'
export const languages = {
  zh: {
    sidebarList: sidebarZh,
    nav: {
      language: '中英切换',
      search: '键入以开始搜索',
      setting: '设置页',
      tag: '标签页',
      catalog: '目录页',
      github: 'Github 储存库',
    },
    footer: {
      update: '最近更新',
      contact: '联系方式',
    },
    meta: {
      discribtion: '描述喵喵',
    },
  },
  en: {
    sidebarList: sidebarEn,
    nav: {
      language: 'zh and en switch',
      search: 'tab to search',
      setting: 'setting page',
      tag: 'tag page',
      catalog: 'catalog page',
      github: 'github page',
    },
    footer: {
      update: 'latest update',
      contact: 'contach information',
    },
    meta: {
      discribtion: 'decribtion miao',
    },
  },
}

export const LanguagesContext = React.createContext(
  languages.zh, // 默认值
)
