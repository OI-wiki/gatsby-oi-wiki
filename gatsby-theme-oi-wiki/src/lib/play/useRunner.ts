/* eslint-disable camelcase */
import axios from 'axios'
import type { AxiosResponse } from 'axios'
import _ from 'lodash'
import { useCallback, useState } from 'react'
import type { LangType } from './codeLang'

export interface RunnerApiRequestData {
  code: string
  language: LangType
  flags: '' | '-O2'
  stdin: string
}

interface RunnerApiResponseData {
  message: string
  time_ms?: number
  memory_kb?: number
  status?:
    | 'Compile Error'
    | 'Run Finished'
    | 'Time Limit Exceeded'
    | 'Memory Limit Exceeded'
    | 'Runtime Error'
    | 'Execute Failure'
  stdout?: string
  stderr?: string
  ce_info?: string
}

interface ResponseKeyTransformMapType {
  time_ms: 'time'
  memory_kb: 'memory'
  ce_info: 'ceInfo'
}
const responseKeyTransformMap: ResponseKeyTransformMapType = {
  time_ms: 'time',
  memory_kb: 'memory',
  ce_info: 'ceInfo',
}

export type TransformedResponseData = {
  [K in keyof RunnerApiResponseData as K extends 'message'
    ? never
    : K extends keyof ResponseKeyTransformMapType
    ? ResponseKeyTransformMapType[K]
    : K]-?: RunnerApiResponseData[K]
}

function transformResponseData (
  data: RunnerApiResponseData,
): TransformedResponseData {
  return _.mapKeys(_.omit(data, 'message'), (__, key) =>
    _.has(responseKeyTransformMap, key)
      ? responseKeyTransformMap[key as keyof ResponseKeyTransformMapType]
      : key,
  ) as TransformedResponseData
}

function responseDataGuard (data: any): data is RunnerApiResponseData {
  return typeof data.message === 'string'
}

export const runnerApi = 'https://api2.duck-ac.cn/259ea31bf8ab6b59/duck-api/run'

export function useRunner (
  req: RunnerApiRequestData,
  onResponse?: (res: TransformedResponseData) => void,
  onError?: (msg: string) => void,
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
        if (data.message === 'OK') {
          if (onResponse) onResponse(transformResponseData(data))
        } else {
          throw new Error(data.message)
        }
      })
      .catch((err) => {
        // TODO: mark err as unknown for better type safety
        // https://github.com/microsoft/TypeScript/pull/41013
        let msg = String(err)

        function errResponseGuard(err: unknown): err is { response: AxiosResponse } {
          return _.has(err, 'response')
        }
        if (errResponseGuard(err)) {
          msg = `Server responded ${err.response.data} with code ${err.response.status}`
        } else if (_.has(err, 'request')) msg = 'No response from server'
        else if (err instanceof Error) msg = err.message

        if (onError) onError(msg)
        else if (process.env.NODE_ENV === 'development')
          console.error(`Unhandled exception in code runner: ${err}`)
      })
      .finally(() => {
        setWaiting(false)
      })
  }, [onError, onResponse, req]) // FIXME: req is always changing, the useCallback cache is useless

  return { sendRunnerReq, waiting }
}