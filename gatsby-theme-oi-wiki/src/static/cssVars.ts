import { VarsStore } from '../stores/cssVarsStore'

const cssVars = (): void => {
  const DB = 'persist-info'
  const STORE = 'keyvaluepairs'
  const KEY = 'css-vars'

  const mapToStr = (map: Map<string, string>): string =>
    Array.from(map).map(([k, v]) => `${k}: ${v};`).join(' ')

  const dbOpenReq = window.indexedDB.open(DB)
  const styleEl = document.getElementById(KEY)
  dbOpenReq.onsuccess = () => {
    const db = dbOpenReq.result
    const trans = db.transaction([STORE], 'readonly')
    const query = trans.objectStore(STORE).get(KEY)

    query.onsuccess = () => {
      const res = query.result as VarsStore

      const style = `
        :root {
          color-scheme: light;
          ${mapToStr(res.light)}
        }

        :root[data-theme="dark"] {
          color-scheme: dark;
          ${mapToStr(res.dark)}
        }
      `

      if (styleEl) {
        styleEl.innerHTML = style
      }
    }
  }
}

export default cssVars
