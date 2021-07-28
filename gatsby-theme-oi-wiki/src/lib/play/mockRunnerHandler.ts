import { rest } from 'msw'
import { runnerApi } from './useRunner'

export const handlers = [
  rest.post(runnerApi, async (req, res, ctx) => {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    return res(ctx.status(200), ctx.json({ info: 'success' }))
  }),
]
