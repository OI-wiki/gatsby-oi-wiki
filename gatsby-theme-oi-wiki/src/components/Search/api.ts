import { ResultItem } from './SearchResult'

/**
 * 从 API 获取搜索数据
 * @param str 要搜索的内容
 */
const fetchResult = (str: string): Promise<ResultItem[]> =>
  fetch(`https://search.oi-wiki.org:8443/?s=${encodeURIComponent(str)}`)
    .then((response) => response.json())


export { fetchResult }
