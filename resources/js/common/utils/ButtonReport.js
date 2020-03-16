import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import mapAuth from '../../helpers/mapAuth'
import SocialsService from '../../services/SocialsService'
import * as actions from '../../store/actions'
import iconCount from '../../helpers/iconCount'

const { log, error } = console

export default connect(mapAuth)(ButtonReport)

function ButtonReport({ auth, isAuthenticated, classNames, itemId, type, auxReported, dispatch }) {
  const [isReported, setIsReported] = useState(false)

  useEffect(() => {
    setIsReported(validateReported())
  }, [])

  useEffect(() => {
    setIsReported(validateReported())
  }, [auxReported])

  function handleReport(event) {
    event.preventDefault()
    if (!auth || auth.access < 2) {
      alert('You must be a Doctor or Medical Official to report a malpractice!')
      return
    }
    SocialsService.increment({ social: 'reports', authId: auth.id, itemId, type })
      .then(({ reported }) => dispatch(actions.auxSetReported({ reported, auth, itemId })))
      .catch(error)
  }

  function validateReported() {
    return auxReported.indexOf(itemId) > -1
  }

  return (
    <span
      className={classNames.join(' ')}
      onClick={handleReport}
      style={{ opacity: isAuthenticated && isReported ? 0.3 : 1 }}
    >
      <i
        className={`fal fa-cancel ${isAuthenticated && isReported ? 'is-stored' : 'is-not-stored'}`}
      ></i>
    </span>
  )
}
