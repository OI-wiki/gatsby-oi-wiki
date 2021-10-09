import 'basic-type-extensions'
import React, { useState, useEffect, useRef } from 'react'
import { Avatar, Box, TextField, Tooltip } from '@material-ui/core'
import DraftsIcon from '@material-ui/icons/DraftsOutlined'
import PublishIcon from '@material-ui/icons/PublishOutlined'
import CallMergeIcon from '@material-ui/icons/CallMergeOutlined'
import { Octokit } from '@octokit/rest'
import type { RequestError } from '@octokit/types'
import { Buffer } from 'buffer'
import MarkdownEditor from '../components/MarkdownEditor'
import StyledLayout from '../components/StyledLayout'
import Confirm from '../components/Confirm'
import Message from '../components/Message'
import authenticate, { User, anonymousUser } from '../lib/authenticate'
import { PromiseValue, ArrayItem } from '../utils/common'

type Repository = PromiseValue<ReturnType<Octokit['rest']['repos']['get']>>['data']
type PullRequest = ArrayItem<PromiseValue<ReturnType<Octokit['rest']['pulls']['list']>>['data']>
const originRepo = {
  owner: 'OI-wiki',
  repo: 'gatsby-oi-wiki',
}
const EditorPage: React.FC = _ => {
  const [darkTheme, setDarkTheme] = useState<boolean>(false)
  const [user, setUser] = useState<User>(anonymousUser)
  const [content, setContent] = useState<string>('')
  const [curValue, setCurValue] = useState<string>('')
  const [github, setGithub] = useState<Octokit | null>(null)
  const [repo, setRepo] = useState<Repository | null>(null)
  const [sha, setSha] = useState<string | null>(null)
  const [pr, setPr] = useState<PullRequest | null>(null)
  const confirmRef = useRef<Confirm | null>(null)
  const messageRef = useRef<Message | null>(null)
  const handleError = (error: any) => messageRef.current!.error(error.toString())
  let relativePath: string | null = null
  useEffect(() => {
    relativePath = new URL(location.href).searchParams.get('path')
    const dataTheme = document.getElementsByTagName('html').item(0)?.getAttribute('data-theme')
    setDarkTheme(
      dataTheme == 'dark' || (dataTheme == 'auto' && window.matchMedia('(prefers-color-scheme: dark)') != null)
    )
  }, [])
  useEffect(() => {
    if (String.isNullOrEmpty(relativePath)) {
      alert('URL中缺少文档路径参数')
      history.back()
      return
    }
    authenticate().then(async identities => {
      if (typeof identities == 'string') {
        messageRef.current!.error(identities)
        return
      }
      setUser(identities[1])
      setGithub(new Octokit({ auth: identities[0] }))
    }, handleError)
  }, [relativePath])
  useEffect(() => {
    if (!github || !user) return
    ;(async () => {
      const forkedRepos = (
        await github.rest.repos.listForUser({
          username: user.username,
          type: 'owner',
        })
      ).data.filter(repo => repo.fork)
      let found = false
      for (const forkedRepo of forkedRepos) {
        const details = (
          await github.rest.repos.get({
            owner: user.username,
            repo: forkedRepo.name,
          })
        ).data
        if (details.parent!.full_name == `${originRepo.owner}/${originRepo.repo}`) {
          setRepo(details)
          found = true
          break
        }
      }
      if (!found) {
        const result = await confirmRef.current!.show({
          title: 'Fork本项目到您的GitHub仓库',
          message:
            '编辑内容需要先将本项目fork到自己的账号，以方便通过Pull Request提出修改建议。点击确定将会执行fork操作，取消将返回原页面。',
        })
        if (!result) {
          history.back()
          return
        }
        await github!.rest.repos.createFork(originRepo)
        function checkFork(): Promise<boolean> {
          return github!.rest.repos
            .listCommits({
              owner: user.username,
              repo: originRepo.repo,
              per_page: 1,
            })
            .then(
              () => true,
              () => false
            )
        }
        await Promise.wait(checkFork, 500)
        setRepo(
          (
            await github.rest.repos.get({
              owner: user.username,
              repo: originRepo.repo,
            })
          ).data
        )
      }
    })()
  }, [github, user])
  useEffect(() => {
    if (!repo) return
    github!.rest.repos
      .getContent({
        owner: user.username,
        repo: repo!.name,
        path: `example/docs/${relativePath}`,
      })
      .then(
        ({ data }) => {
          setSha((data as { sha: string }).sha)
          const draft = localStorage.getItem(`editor-draft[${relativePath}]`)
          if (!String.isNullOrEmpty(draft)) {
            setContent(draft!)
            messageRef.current!.success('成功加载草稿')
          } else setContent(Buffer.from((data as any).content as string, 'base64').toString('utf8'))
        },
        (error: RequestError) => {
          if (error.status == 404) {
            alert(`路径${relativePath}不存在`)
            history.back()
          } else throw error
        }
      )
    github!.pulls
      .list({
        ...originRepo,
        state: 'all',
        head: `${user.username}:master`,
        page: 1,
        per_page: 1,
      })
      .then(async ({ data: prs }) => {
        if (prs.length > 0) setPr(prs[0])
      }, handleError)
  }, [repo])
  function saveDraft() {
    localStorage.setItem(`editor-draft[${relativePath}]`, curValue)
    messageRef.current!.success('草稿已保存')
  }
  async function submitCommit() {
    let message = `docs: update ${relativePath}`
    const confirmed = await confirmRef.current!.show({
      message: (
        <TextField
          variant="standard"
          label="Commit Message"
          defaultValue={message}
          style={{ minWidth: 300 }}
          onChange={event => (message = event.target.value)}
        />
      ),
    })
    if (!confirmed) return
    await github!.rest.repos
      .createOrUpdateFileContents({
        owner: user.username,
        repo: repo!.name,
        message,
        path: `example/docs/${relativePath}`,
        sha: sha!,
        content: Buffer.from(curValue, 'utf8').toString('base64'),
      })
      .then(({ data: { commit } }) => {
        messageRef.current!.success(`Commit成功，SHA为${commit.sha}`)
        localStorage.removeItem(`editor-draft[${relativePath}]`)
      }, handleError)
  }
  async function createPullRequest() {
    let title = ''
    let body = ''
    const confirmed = await confirmRef.current!.show({
      message: (
        <Box component="form" style={{ display: 'flex', flexDirection: 'column', minWidth: 300 }}>
          <TextField
            variant="outlined"
            label="标题"
            required
            margin="normal"
            onChange={({ target: { value } }) => (title = value)}
          />
          <TextField
            variant="outlined"
            label="内容描述"
            multiline
            rows={4}
            margin="normal"
            onChange={({ target: { value } }) => (body = value)}
          />
        </Box>
      ),
    })
    if (!confirmed) return
    await github!.pulls
      .create({
        ...originRepo,
        title,
        body,
        head: `${user.username}:master`,
        base: 'master',
      })
      .then(({ data }) => {
        messageRef.current!.success(`成功创建PR，编号为${data.number}`)
        setPr(data as any)
      }, handleError)
  }
  function viewPullRequest() {
    window.open(`https://github.com/${originRepo.owner}/${originRepo.repo}/pull/${pr!.number}`, '_blank')?.focus()
  }
  return (
    <StyledLayout noTitle={true} noMeta={true} noComment={true} noToc={true} overflow={true} title="Markdown编辑器">
      <MarkdownEditor theme={darkTheme ? 'dark' : 'light'} value={content} onChange={setCurValue}>
        {repo != null && (
          <>
            <Tooltip title={user.username} placement="top">
              <Avatar alt={user?.username} src={user?.avatar} style={{ width: 24, height: 24 }} />
            </Tooltip>
            <Tooltip title="保存草稿" placement="top">
              <DraftsIcon onClick={saveDraft} />
            </Tooltip>
            <Tooltip title="提交Commit" placement="top">
              <PublishIcon onClick={submitCommit} />
            </Tooltip>
            {(pr == null || pr.state == 'closed') && (
              <Tooltip title="发起PR" placement="top">
                <CallMergeIcon onClick={createPullRequest} />
              </Tooltip>
            )}
            {pr?.state == 'open' && (
              <Tooltip title="查看PR" placement="top">
                <CallMergeIcon onClick={viewPullRequest} />
              </Tooltip>
            )}
          </>
        )}
      </MarkdownEditor>
      <Confirm ref={confirmRef} />
      <Message ref={messageRef} />
    </StyledLayout>
  )
}

export default EditorPage
