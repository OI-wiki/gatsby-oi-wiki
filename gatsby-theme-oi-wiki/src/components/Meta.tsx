import React, { useEffect, useMemo } from 'react'
import Tags, { TagsProps } from './Tags'
import { uniq } from '../utils/common'
import Time from '../components/Time'
import SmartLink, { SmartLinkProps } from './SmartLink'
import styled from '@mui/material/styles/styled'
import { css } from '@emotion/react'
import Typography from '@mui/material/Typography'
import { Copyright, Group, History } from '@mui/icons-material'
import Paper from '@mui/material/Paper'
import { observer } from 'mobx-react-lite'
import Edit from '@mui/icons-material/Edit'
import { editWarnStore } from '../stores/editWarnStore'
import Box from '@mui/material/Box'

interface AuthorsBlockProps {
  authors: string;
}

interface EditBlockProps {
  relativePath: string;
}

export interface MetaProps extends Partial<AuthorsBlockProps & TagsProps>, EditBlockProps {
  modifiedTime: string;
  title: string;
}


const StyledSmartLink = styled(SmartLink)(({ theme }) => css`
  color: ${theme.palette.grey.A700};
  margin-left: ${theme.spacing(1)};
`)

const iconStyle = css`
  vertical-align: sub;
  font-size: 1.25rem;
`

const StyledGroupIcon = styled(Group)(iconStyle)
const StyledHistoryIcon = styled(History)(iconStyle)
const StyledEditIcon = styled(Edit)(iconStyle)
const StyledCopyrightIcon = styled(Copyright)(iconStyle)

const StyledPaper = styled(Paper)(({ theme }) => css`
  padding: ${theme.spacing(2)};
`)

const StyledBox = styled(Box)`
  margin: 20px 0 10px;
  padding-left: .5rem;
  text-decoration: none;
`

const Author: React.FC<{ name: string }> = ({ name }) =>
  <StyledSmartLink href={`https://github.com/${name}`}>
    {`@${name}`}
  </StyledSmartLink>

const AuthorsBlock: React.FC<AuthorsBlockProps> = (props) => {
  const { authors } = props
  const authorArr = useMemo(() => uniq(authors.split(',').map(v => v.trim())), [authors])

  return (
    <Typography gutterBottom={true}>
      <span>
        <StyledGroupIcon/>{' 贡献者：'}
      </span>
      {authorArr.map((v) => <Author key={v} name={v}/>)}
    </Typography>
  )
}

const EditBlock: React.FC<EditBlockProps> = observer((props) => {
  useEffect(() => {
    editWarnStore.setRelativePath(props.relativePath)
  }, [props.relativePath])

  const click: SmartLinkProps['onClick'] = (e) => {
    e.preventDefault()
    editWarnStore.setOpen(true)
  }

  return (
    <Typography gutterBottom={true}>
      <span>
        <StyledEditIcon/>
        {' 发现错误？想一起完善？ '}
        <SmartLink onClick={click} href=".">在 GitHub 上编辑此页！</SmartLink>
      </span>
    </Typography>
  )
})

const Meta: React.FC<MetaProps> = (props) => {
  const { tags, relativePath, modifiedTime, authors, ...rest } = props

  return (
    <StyledPaper variant="outlined">
      {tags && <Tags tags={tags}/>}

      <StyledBox>
        {authors && <AuthorsBlock authors={authors}/>}

        <Typography gutterBottom={true}>
          <span>
            <StyledHistoryIcon fontSize="small"/>
            {' 本页面最近更新：'}
          </span>
          <Time time={modifiedTime} showRelative={false}/>，
          <SmartLink href='./changelog/' {...rest} state={{ ...rest }}>更新历史</SmartLink>
        </Typography>

        <EditBlock relativePath={relativePath}/>

        <Typography>
          <span>
            <StyledCopyrightIcon/>
            {' 本页面的全部内容在 '}
            <strong>
              <SmartLink href="https://creativecommons.org/licenses/by-sa/4.0/deed.zh">CC BY-SA 4.0</SmartLink>
              {' 和 '}
              <SmartLink href="https://github.com/zTrix/sata-license">SATA</SmartLink>
            </strong>
            {' 协议之条款下提供，附加条款亦可能应用'}
          </span>
        </Typography>
      </StyledBox>
    </StyledPaper>
  )
}

export default Meta
