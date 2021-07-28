import axios from 'axios'
import { useCallback, useState } from 'react'
import type { LangType } from './codeLang'

export interface RunnerApiRequestData {
  input: string
  output: string
  code: string
  lang: LangType
}

export interface RunnerApiResponseData {
  info: string
}

function responseDataGuard (data: any): data is RunnerApiResponseData {
  return data.info !== undefined
}

export const runnerApi =
  process.env.NODE_ENV === 'development' ? '/runner_api' : 'actual_api'

export function useRunner (
  req: RunnerApiRequestData,
  onResponse?: (data: RunnerApiResponseData) => any,
  onError?: (msg: string) => any,
): {
  sendRunnerReq: () => void
  waiting: boolean
} {
  const [waiting, setWaiting] = useState(false)

  const sendRunnerReq = useCallback(() => {
    setWaiting(true)

    axios
      .request({
        url: runnerApi,
        method: 'POST',
        data: req,
      })
      .then(({ data }) => {
        if (!responseDataGuard(data)) {
          throw Error(`Incompatible response data format: ${data}`)
        }
        if (onResponse) onResponse(data)
      })
      .catch((err) => {
        // TODO: mark err as unknown for better type safety
        // https://github.com/microsoft/TypeScript/pull/41013
        let msg = String(err)
        if (err.response) {
          msg = `Server responded ${err.data} with code ${err.status}`
        } else if (err.request) msg = 'No response from server'
        else if (err.message) msg = err.message

        if (onError) onError(msg)
        if (process.env.NODE_ENV === 'development') console.error(err)
      })
      .finally(() => {
        setWaiting(false)
      })
  }, [onError, onResponse, req])

  return { sendRunnerReq, waiting }
}
