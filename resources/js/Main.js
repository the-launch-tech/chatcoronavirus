import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import Header from './common/Header'
import SubHeader from './common/SubHeader'
import LeftBar from './common/LeftBar'
import RightBar from './common/RightBar'
import Footer from './common/Footer'
import SimpleDialog from './common/utils/SimpleDialog'
import mapAuth from './helpers/mapAuth'
import getScreenSize from './helpers/getScreenSize'

const { log, error } = console

const mapStateToProps = ({ Aux }) => {
  return {
    loading: Aux.loading,
    screen: Aux.screen,
  }
}

export default connect(mapStateToProps)(function({ loading, children, dispatch }) {
  const [pane, setPane] = useState(false)

  useEffect(() => {
    getScreenSize(dispatch)
    window.addEventListener('resize', () => getScreenSize(dispatch))
  }, [])

  function togglePane() {
    setPane(!pane)
  }

  return (
    <React.Fragment>
      <div
        id="loader-wrapper"
        className={`loader-wrapper ${loading ? 'is-loading' : 'is-not-loading'}`}
      >
        <div id="loader-item" className="loader-item">
          <div></div>
          <div></div>
        </div>
      </div>
      <header id="header">
        <Header />
      </header>
      <section id="sub-header">
        <SubHeader />
      </section>
      <main id="main">
        <section id="left-bar" className={pane ? 'active-bar' : ''}>
          <LeftBar pane={pane} togglePane={togglePane} />
        </section>
        <article id="center">{children}</article>
      </main>
      <footer id="footer">
        <Footer />
      </footer>
      <SimpleDialog />
    </React.Fragment>
  )
})
