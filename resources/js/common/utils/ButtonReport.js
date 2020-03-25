import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import SocialsService from '../../services/SocialsService'
import actions from '../../store/actions'
import iconCount from '../../helpers/iconCount'

const { log, error } = console

export default connect(({ Auth }) => {
  return {
    auth: Auth.auth,
    isAuthenticated: Auth.isAuthenticated,
    authReported: Auth.authReported,
  }
})(ButtonReport)

function ButtonReport({ auth, isAuthenticated, classNames, itemId, type, authReported, dispatch }) {
  const [isReported, setIsReported] = useState(false)

  useEffect(() => {
    setIsReported(validateReported())
  }, [])

  useEffect(() => {
    setIsReported(validateReported())
  }, [authReported])

  function handleReport(event) {
    event.preventDefault()
    if (!auth || auth.access < 2) {
      dispatch(
        actions.AUX.toggleSimpleDialog({
          active: true,
          content: '<p>You must be a Doctor or Medical Official to report a malpractice!</p>',
        })
      )
      return
    }
    SocialsService.increment({ social: 'reports', authId: auth.id, itemId, type })
      .then(({ reported }) => dispatch(actions.AUTH.setReported({ reported, auth, itemId })))
      .catch(error)
  }

  function validateReported() {
    return authReported.indexOf(itemId) > -1
  }

  return (
    <span
      className={classNames.join(' ')}
      onClick={handleReport}
      style={{ opacity: isAuthenticated && isReported ? 0.3 : 1 }}
    >
      <i
        className={`fal fa-cancel ${isAuthenticated && isReported ? 'is-stored' : 'is-not-stored'}`}
      ></i>{' '}
      Report
    </span>
  )
}
