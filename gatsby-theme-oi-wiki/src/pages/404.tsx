// Components
import React from 'react'
import StyledLayout from '../components/StyledLayout'

const page: React.FC<{ location: Location }> = ({ location }) => (
  <StyledLayout location={location} noEdit={true} title="404" noComment={false}>
    <div>
      <div>
        <h1>404 is Found!</h1>
        <p>如果你是无意间来到这里的，请在下方告诉我们你是从哪里点进来的哦。</p>
        <br/>
        <br/>
      </div>
    </div>
  </StyledLayout>
)

export default page
