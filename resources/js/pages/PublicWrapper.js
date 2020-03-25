import React from 'react'
import BackButton from '../common/utils/BackButton'
import ForwardButton from '../common/utils/ForwardButton'
import PageTitle from '../common/utils/PageTitle'

const { log, error } = console

export default PublicWrapper

function PublicWrapper({ children }) {
  return (
    <div id="page-wrapper" className="page-wrapper">
      <PageTitle />
      <BackButton />
      <ForwardButton />
      {children}
    </div>
  )
}
