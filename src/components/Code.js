import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined'
import Snackbar from '@material-ui/core/Snackbar'
import clsx from 'clsx'
import scrollbarStyle from '../styles/scrollbar'

const useStyles = makeStyles((theme) => ({
  copyBlock: {
    top: '.3rem',
    right: '.3rem',
    width: '1.4rem',
    height: '1.4rem',
    borderRadius: '.1rem',
    fontSize: '.6rem',
    cursor: 'pointer',
    zIndex: 1,
    margin: 0,
    padding: 0,
    background: 'transparent',
    position: 'absolute',
    border: 0,
  },
  copyButton: {
    backgroundColor: 'transparent',
    color: 'white',
    opacity: 0.2,
    '&:hover': {
      opacity: 1,
    },
  },
  lineWrapper: { display: 'flex' },
  lineNumber: {
    width: '1.5rem',
    color: '#A4A4A4',
    'text-align': 'right',
    'user-select': 'none',
  },
  lineContents: {
    flex: '1 0 auto',
    'white-space': 'pre',
  },
  codeScrollBar: scrollbarStyle(theme, {}),
}))

/*
 * @source https://github.com/gatsbyjs/gatsby/blob/561d33e2e491d3971cb2a404eec9705a5a493602/www/src/utils/copy-to-clipboard.js
 */
const copyToClipboard = (str) => {
  const clipboard = window.navigator.clipboard
  /*
   * fallback to older browsers (including Safari)
   * if clipboard API not supported
   */
  if (!clipboard || typeof clipboard.writeText !== 'function') {
    const textarea = document.createElement('textarea')
    textarea.value = str
    textarea.setAttribute('readonly', true)
    textarea.setAttribute('contenteditable', true)
    textarea.style.position = 'absolute'
    textarea.style.left = '-9999px'
    document.body.appendChild(textarea)
    textarea.select()
    const range = document.createRange()
    const sel = window.getSelection()
    sel.removeAllRanges()
    sel.addRange(range)
    textarea.setSelectionRange(0, textarea.value.length)
    document.execCommand('copy')
    document.body.removeChild(textarea)

    return Promise.resolve(true)
  }

  return clipboard.writeText(str)
}

export default function Code (codeBlocks) {
  const classes = useStyles()
  for (const i of codeBlocks) {
    if (!i.tokenizedLines) {
      // i has no tokenizedLines, which indicates that i is an unrecognizable language,
      // so we simply generate tokenizedLines so as to display it without highlighting.
      i.tokenizedLines = i.text.split('\n').map(t => ({
        className: 'grvsc-line',
        html: `<span class="grvsc-line"><span class="mtk1">${t}</span></span>`,
        text: t,
      }))
    }
  }
  console.log(codeBlocks)
  return function codeRender (props) {
    const index = Number(props['data-index'])
    const codeBlock = codeBlocks[index]
    const CopySnackbar = () => {
      const [open, setOpen] = React.useState(false)

      const handleClick = () => {
        copyToClipboard(codeBlock.text)
        setOpen(true)
      }

      const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return
        }
        setOpen(false)
      }

      return (
        <div className={classes.copyBlock}>
          <IconButton className={classes.copyButton}
            size='small'
            aria-label='copy'
            onClick={handleClick}
          >
            <FileCopyOutlinedIcon fontSize='small' />
          </IconButton>
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            open={open}
            autoHideDuration={1000}
            onClose={handleClose}
            message='源代码已复制'
          />
        </div>
      )
    }
    if (codeBlock && codeBlock.tokenizedLines) {
      return (
        <div style={{ position: 'relative' }}>
          <CopySnackbar/>
          <pre
            className={clsx(codeBlock.preClassName, classes.codeScrollBar)}
          >
            <code className={codeBlock.codeClassName}>
              {codeBlock.tokenizedLines.map(({ html }, i) => (
                <div className={classes.lineWrapper} key={i}>
                  <div className={classes.lineNumber}>{i + 1}</div>
                  <div
                    className={classes.lineContents}
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                </div>
              ))}
            </code>
          </pre>
        </div>
      )
    }
    return <pre {...props}/>
  }
}
