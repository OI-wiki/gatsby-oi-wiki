import React from 'react'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ChangeLog = ({ pageContext: { id, slug, changelog }, data, location }) => {
  return (
    <div>
      <p>djsal</p>xw
      <p>{changelog}</p>
      {changelog.all.slice(0, 15).map((item, index) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { hash, data, message, refs, body, author_name: name, author_email: email } = item
        return (
          <div key={index + '/#'}>
            <p>{hash}</p>
            <p>{data}</p>
            <p>{message}</p>
            <p>{refs}</p>
            <p>{name}</p>
          </div>
        )
      })}
    </div>
  )
}

export default ChangeLog
