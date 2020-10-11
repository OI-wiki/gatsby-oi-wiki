import React, { useState, useEffect } from 'react'
import AV from 'leancloud-storage'
import RcRate from 'rc-rate'
import 'rc-rate/assets/index.css'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

const queryRate = new AV.Query('Rates')
var PID = 0
var queryCount = 0; var queryData = null

const useStyles = makeStyles(() => ({
  rateBar: {
    fontSize: '25px !important',
    textAlign: 'center',
    display: 'block !important',
  },
}))

function change (newValue) {
  var classRate = null
  if (queryCount) {
    classRate = queryData
  } else {
    classRate = new AV.Object('Rates')
    classRate.set('pid', PID)
    classRate.set('totalScore', 0)
    classRate.set('counts', 0)
  }
  classRate.increment('totalScore', newValue)
  classRate.increment('counts', 1)
  classRate.save().then(() => {
    alert('投票成功')
  }).catch((e) => {
    alert(e)
  })
}

function loginOrLogout () {
  if (!AV.User.current()) {
    const username = prompt('UserName:')
    const passwd = prompt('PassWord:')
    AV.User.logIn(username, passwd).then(() => {
      alert('登录成功')
    }).catch((e) => {
      alert(e)
    })
  } else {
    AV.User.logOut().then(() => {
      alert('登出成功')
    }).catch((e) => {
      alert(e)
    })
  }
}

function Rate ({ pid }) {
  const classes = useStyles()
  const appId = 'ndFz7SM4piNM35obq15NGD1E-MdYXbMMI'; const appKey = 'UscWyv1U65BHXOx6JUTvOKaD'
  PID = pid
  const [rateNum, setRateNum] = useState(-1)
  const [rateInfo, setRateInfo] = useState('Loading...')
  AV.init({
    appId: appId,
    appKey: appKey,
  })
  //  AV.debug.enable()
  queryRate.equalTo('pid', pid)
  useEffect(() => {
    const getData = async () => {
      queryCount = await queryRate.count()
      if (queryCount) {
        queryData = await queryRate.first()
        const totalScore = queryData.get('totalScore')
        const counts = queryData.get('counts')
        const result = Math.round(totalScore / counts * 10) / 10
        setRateNum(result)
        setRateInfo(`${result} 分 / ${counts} 票`)
      } else {
        setRateNum(0)
        setRateInfo('-- 分 / 0 票')
      }
    }
    getData()
  }, [])
  return (
    <>
      <RcRate value={rateNum < 0 ? 0 : rateNum} disabled={rateNum < 0} onChange={change} className={classes.rateBar} />
      <br />
      <Typography align='center' color='textSecondary' variant='body2' >{rateInfo}</Typography>
      <br />
      <Button onClick={loginOrLogout}>LOGIN/LOGOUT</Button>
    </>
  )
}

export default Rate
