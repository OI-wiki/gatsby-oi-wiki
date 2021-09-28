import React from 'react'
import { css } from '@emotion/react'
import MTable, { TableProps } from '@mui/material/Table'
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import styled from '@mui/material/styles/styled'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

const StyledTable: React.FC<TableProps> = (props) => {
  const { sx, ...others } = props

  return (
    <TableContainer component={Paper} sx={{
      display: 'inline-block',
      maxWidth: '100%',
      width: 'auto',
    }}>
      <MTable sx={{
        maxWidth: '100%',
        width: 'auto',
        lineHeight: '1.4rem',
        ...sx,
      }} {...others}/>
    </TableContainer>
  )
}

const StyledTd = styled(TableCell)`
  padding: 14px 20px;
`

const StyledTh = styled(StyledTd)(({ theme }) => css`
  font-weight: ${theme.typography.fontWeightBold};
  background-color: ${theme.palette.grey.A700};
  color: white;
  min-width: 0;
  vertical-align: center;
  padding: 12px 20px;
`)

const StyledTr = styled(TableRow)(({ theme }) => css`
  transition: background-color ${theme.transitions.duration.shortest}ms;

  &:hover {
    background-color: ${theme.palette.grey.A100};
  }
`)

const Table = {
  table: StyledTable,
  thead: TableHead,
  tbody: TableBody,
  tr: StyledTr,
  th: StyledTh,
  td: StyledTd,
}

export default Table
