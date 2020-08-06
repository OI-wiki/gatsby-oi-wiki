import React from 'react'
import sidebarZh from './sidebar.zh.yaml'
import sidebarEn from './sidebar.en.yaml'
export const languages = {
  zh: {
    sidebarList: sidebarZh,
    nav: {
      laguage: '中英切换',
      search: '键入以开始搜索',
      setting: '设置页',
      tag: '标签页',
      catalog: '目录页',
      github: 'github储存库',
    },
    meta: {
      update: '最近更新',
      contact: '联系方式',
    },
  },
  en: {
    sidebarList: sidebarEn,
    nav: {
      laguage: 'zh and en switch',
      search: 'tab to search',
      setting: 'setting page',
      tag: 'tag page',
      catalog: 'catalog page',
      github: 'github page',
    },
    meta: {
      update: 'latest update',
      contact: 'contach information',
    },
  },
}

export const LanguagesContext = React.createContext(
  languages.zh, // 默认值
)
