import React, { useState, useEffect } from 'react'
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
export const LanguageProvider = (props) => {
  const [locale, setLocale] = useState(languages.zh)
  const [language, setLanguage] = useState('zh')
  useEffect(() => {
    const storageLanguage = JSON.parse(localStorage.getItem('language'))
    let localInit = languages.zh
    if (storageLanguage && storageLanguage === 'en') {
      localInit = languages.en
    }
    setLocale(localInit)
    setLanguage(storageLanguage || 'zh')
  }, [])
  // const [locale, setLocale] = useState(localInit)
  // const [language, setLanguage] = useState(storageLanguage || 'zh')
  // useEffect(() => {
  //   localStorage.setItem('language', JSON.stringify(language))
  // }, [language, locale])
  const contextProps = { locale, setLocale, language, setLanguage }
  return (
    <LanguagesContext.Provider value={contextProps}>
      {props.children}
    </LanguagesContext.Provider>
  )
}
