import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import Header from './common/Header'
import SubHeader from './common/SubHeader'
import LeftBar from './common/LeftBar'
import RightBar from './common/RightBar'
import Footer from './common/Footer'
import SimpleDialog from './common/utils/SimpleDialog'
import mapAuth from './helpers/mapAuth'

const { log, error } = console

const mapStateToProps = ({ Aux }) => {
  return {
    loading: Aux.loading,
  }
}

export default connect(mapStateToProps)(function({ loading, children }) {
  const [pane, setPane] = useState(false)
  const [desktop, setDesktop] = useState(true)

  useEffect(() => {
    checkSize()
    window.addEventListener('resize', () => checkSize())
  }, [])

  function checkSize() {
    if (window.innerWidth > 991) {
      setDesktop(true)
    } else if (window.innerWidth < 992) {
      setDesktop(false)
    }
  }

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
        <Header desktop={desktop} />
      </header>
      <section id="sub-header">
        <SubHeader desktop={desktop} />
      </section>
      <main id="main">
        <section id="left-bar" className={pane ? 'active-bar' : ''}>
          <LeftBar pane={pane} togglePane={togglePane} desktop={desktop} />
        </section>
        <article id="center">{children}</article>
      </main>
      <footer id="footer">
        <Footer desktop={desktop} />
      </footer>
      <SimpleDialog />
    </React.Fragment>
  )
})
