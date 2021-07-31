import { rest } from 'msw'
import { runnerApi } from './useRunner'
import type { RunnerApiRequestData } from './useRunner'

export const handlers = [
  rest.post(runnerApi, async (req, res, ctx) => {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const { code, stdin, language } = req.body as RunnerApiRequestData
    return res(
      // eslint-disable-next-line no-eval
      ctx.json({ message: 'OK', stdout: 'fds' }),
    )
  }),
]
