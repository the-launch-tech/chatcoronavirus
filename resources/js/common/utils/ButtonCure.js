import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import mapAuth from '../../helpers/mapAuth'
import SocialsService from '../../services/SocialsService'
import * as actions from '../../store/actions'
import iconCount from '../../helpers/iconCount'

const { log, error } = console

export default connect(mapAuth)(ButtonCure)

function ButtonCure({
  auth,
  isAuthenticated,
  classNames,
  itemId,
  type,
  currentCures,
  authPostCured,
  authCommentCured,
  postCureStore,
  commentCureStore,
  dispatch,
}) {
  const [isCured, setIsCured] = useState(false)

  useEffect(() => {
    if (type === 'comment') {
      dispatch(
        actions.auxUpdateCommentCureStore({
          itemId,
          initial: commentCureStore[itemId] ? commentCureStore[itemId] : currentCures,
        })
      )
    } else {
      dispatch(
        actions.auxUpdatePostCureStore({
          itemId,
          initial: postCureStore[itemId] ? postCureStore[itemId] : currentCures,
        })
      )
    }
    setIsCured(validateCured())
  }, [])

  useEffect(() => {
    if (type === 'comment') {
      dispatch(
        actions.auxUpdateCommentCureStore({
          itemId,
          initial: commentCureStore[itemId] ? commentCureStore[itemId] : currentCures,
        })
      )
    } else {
      dispatch(
        actions.auxUpdatePostCureStore({
          itemId,
          initial: postCureStore[itemId] ? postCureStore[itemId] : currentCures,
        })
      )
    }
    setIsCured(validateCured())
  }, [itemId, currentCures, type, auth])

  useEffect(() => {
    setIsCured(validateCured())
  }, [authPostCured, authCommentCured])

  function handleCure(event) {
    if (!auth) {
      alert('You must be logged in to add cures!')
      return
    }
    SocialsService.increment({ social: 'cures', authId: auth.id, itemId, type })
      .then(({ cured }) => {
        if (type === 'comment') {
          const newCount = cured
            ? (commentCureStore[itemId] || 0) + 1
            : (commentCureStore[itemId] || 0) - 1
          dispatch(actions.authSetCommentCured({ auth, commentCured: cured, itemId }))
          dispatch(actions.auxUpdateCommentCureStore({ newCount, itemId }))
        } else {
          const newCount = cured
            ? (postCureStore[itemId] || 0) + 1
            : (postCureStore[itemId] || 0) - 1
          dispatch(actions.authSetPostCured({ auth, postCured: cured, itemId }))
          dispatch(actions.auxUpdatePostCureStore({ newCount, itemId }))
        }
      })
      .catch(error)
  }

  function validateCured() {
    if (type === 'comment') {
      return authCommentCured.indexOf(itemId) > -1
    } else {
      return authPostCured.indexOf(itemId) > -1
    }
  }

  return (
    <span
      className={classNames.join(' ')}
      onClick={handleCure}
      style={{ opacity: isAuthenticated && isCured ? 0.3 : 1 }}
    >
      <i
        className={`fal fa-capsules ${isAuthenticated && isCured ? 'is-stored' : 'is-not-stored'}`}
      ></i>{' '}
      {type === 'comment' ? (
        <React.Fragment>{iconCount(commentCureStore[itemId])}</React.Fragment>
      ) : (
        <React.Fragment>{iconCount(postCureStore[itemId])}</React.Fragment>
      )}
    </span>
  )
}
