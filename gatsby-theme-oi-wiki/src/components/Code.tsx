import { Box, IconButton, makeStyles, Tooltip } from '@material-ui/core';
import AssignmentOutlined from '@material-ui/icons/AssignmentOutlined';
import CodeOutlined from '@material-ui/icons/CodeOutlined';
import clsx from 'clsx';
import { navigate } from 'gatsby';
import has from 'lodash/has';
import React, { useCallback, useRef, useState } from 'react';
import type { LangType } from '../lib/play/codeLang';
import type { PlaygroundLocationState } from '../pages/play';

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'relative',
  },
  btn: {
    top: 8,
    position: 'absolute',
    padding: 4,
  },
  clipboardBtn: {
    right: 8,
  },
  runBtn: {
    right: theme.spacing(4) + 8,
  },
}));

// map to lang defined in codeLang.ts
const mdxLangMap: Readonly<Record<string, LangType>> = Object.freeze({
  cpp: 'C++',
  python: 'Python3',
});

const Code: React.FC<{
  children: React.ReactNode
  className: string
  'data-language': string
}> = ({ children, 'data-language': dataLanguage, className, ...rest }) => {
  const classes = useStyles();

  const boxRef = useRef<HTMLElement>(null);
  const getCode = useCallback(
    () => boxRef.current?.querySelector('pre')?.innerText,
    [],
  );

  const [copyToolTipText, setCopyToolTipText] = useState<'复制' | '已复制'>(
    '复制',
  );

  return (
    <Box
      className={clsx(classes.container, className)}
      {...rest}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ref={boxRef} // see https://github.com/mui-org/material-ui/issues/17010 only fixed in mui v5
    >
      <Tooltip
        title={copyToolTipText}
        onClose={() => {
          // workaround for delay of css transition
          setTimeout(() => {
            setCopyToolTipText('复制');
          }, 250);
        }}
        arrow
      >
        <IconButton
          className={clsx(classes.btn, classes.clipboardBtn)}
          aria-label="copy"
          onClick={() => {
            const code = getCode();
            if (code !== undefined) {
              navigator.clipboard.writeText(code).then(() => {
                setCopyToolTipText('已复制');
              });
            }
          }}
        >
          <AssignmentOutlined />
        </IconButton>
      </Tooltip>
      <Tooltip title="运行" arrow>
        <IconButton
          disabled={!has(mdxLangMap, dataLanguage)}
          className={clsx(classes.btn, classes.runBtn)}
          onClick={() => {
            navigate('/play', {
              state: {
                code: getCode(),
                lang: mdxLangMap[dataLanguage],
              } as PlaygroundLocationState,
            });
          }}
          aria-label="run"
        >
          <CodeOutlined />
        </IconButton>
      </Tooltip>
      {children}
    </Box>
  );
};

export default Code;
