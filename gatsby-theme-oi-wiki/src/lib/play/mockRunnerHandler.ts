import { rest } from 'msw'
import { runnerApi } from './useRunner'
import type { RunnerApiRequestData } from './useRunner'

export const handlers = [
  rest.post(runnerApi, async (req, res, ctx) => {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const { code, stdin, language } = req.body as RunnerApiRequestData

    if (code) {
      return res(
        ctx.json({
          message: 'OK',
          time_ms: 5,
          memory_kb: 12,
          status: 'Run Finished',
          stdout:
            language === 'Javascript'
              // eslint-disable-next-line no-eval
              ? eval(code)
              : 'Hello!\nThis is test stdout.\nYour input is "' +
                stdin +
                '".\n',
          stderr: 'Ops!\nThis is test stderr.\n',
          ce_info:
            'Some compilation message.\nCompiled code is "' + code + '".\n',
        }),
      )
    } else {
      return res(
        ctx.json({
          message: 'No code provided',
        }),
      )
    }
  }),
]
