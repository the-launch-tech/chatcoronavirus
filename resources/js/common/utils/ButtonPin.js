import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import mapAuth from '../../helpers/mapAuth'
import SocialsService from '../../services/SocialsService'
import actions from '../../store/actions'
import iconCount from '../../helpers/iconCount'
import getUrl from '../../helpers/getUrl'

const { log, error } = console

export default connect(mapAuth)(ButtonPin)

function ButtonPin({
  auth,
  isAuthenticated,
  classNames,
  itemId,
  type,
  currentPins,
  authPinned,
  pinStore,
  dispatch,
}) {
  const [isPinned, setIsPinned] = useState(false)

  useEffect(() => {
    dispatch(
      actions.AUX.updatePinStore({
        itemId,
        initial: pinStore[itemId] ? pinStore[itemId] : currentPins,
      })
    )
    setIsPinned(validatePinned())
  }, [])

  useEffect(() => {
    dispatch(
      actions.AUX.updatePinStore({
        itemId,
        initial: pinStore[itemId] ? pinStore[itemId] : currentPins,
      })
    )
    setIsPinned(validatePinned())
  }, [itemId, currentPins, type, auth])

  useEffect(() => {
    setIsPinned(validatePinned())
  }, [authPinned])

  function handlePin(event) {
    event.preventDefault()
    if (!auth) {
      dispatch(
        actions.AUX.toggleSimpleDialog({
          active: true,
          content:
            '<p>You must be <a href="' +
            getUrl('/login') +
            '">logged in</a> or <a href="' +
            getUrl('/register') +
            '">registered</a> to pin or repost!</p>',
        })
      )
      return
    }
    SocialsService.increment({ social: 'pins', authId: auth.id, itemId, type })
      .then(({ pinned }) => {
        const newCount = pinned ? (pinStore[itemId] || 0) + 1 : (pinStore[itemId] || 0) - 1
        dispatch(actions.AUTH.setPinned({ auth, pinned, itemId }))
        dispatch(actions.AUX.updatePinStore({ newCount, itemId }))
      })
      .catch(error)
  }

  function validatePinned() {
    return authPinned.indexOf(itemId) > -1
  }

  return (
    <span
      className={classNames.join(' ')}
      onClick={handlePin}
      style={{ opacity: isAuthenticated && isPinned ? 0.3 : 1 }}
    >
      <i
        className={`fal fal fa-thumbtack ${
          isAuthenticated && isPinned ? 'is-stored' : 'is-not-stored'
        }`}
      ></i>
      {iconCount(pinStore[itemId])}
    </span>
  )
}
