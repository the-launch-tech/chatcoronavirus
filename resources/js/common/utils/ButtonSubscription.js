import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import mapAuth from '../../helpers/mapAuth'
import SocialsService from '../../services/SocialsService'
import * as actions from '../../store/actions'
import iconCount from '../../helpers/iconCount'

const { log, error } = console

export default connect(mapAuth)(ButtonSubscription)

function ButtonSubscription({
  auth,
  isAuthenticated,
  classNames,
  itemId,
  type,
  currentSubscriptions,
  authSubscribed,
  subscriptionStore,
  dispatch,
}) {
  const [isSubscribed, setIsSubscribed] = useState(false)

  useEffect(() => {
    dispatch(
      actions.auxUpdateSubscriptionStore({
        itemId,
        initial: subscriptionStore[itemId] ? subscriptionStore[itemId] : currentSubscriptions,
      })
    )
    setIsSubscribed(validateSubscribed())
  }, [])

  useEffect(() => {
    dispatch(
      actions.auxUpdateSubscriptionStore({
        itemId,
        initial: subscriptionStore[itemId] ? subscriptionStore[itemId] : currentSubscriptions,
      })
    )
    setIsSubscribed(validateSubscribed())
  }, [itemId, currentSubscriptions, type, auth])

  useEffect(() => {
    setIsSubscribed(validateSubscribed())
  }, [authSubscribed])

  function handleSubscribe(event) {
    event.preventDefault()
    if (!auth) {
      alert('You must be logged in to subscribe or follow!')
      return
    }
    SocialsService.increment({ social: 'subscriptions', authId: auth.id, itemId, type })
      .then(({ subscribed }) => {
        const newCount = subscribed
          ? (subscriptionStore[itemId] || 0) + 1
          : (subscriptionStore[itemId] || 0) - 1
        dispatch(actions.authSetSubscribed({ subscribed, auth, itemId }))
        dispatch(actions.auxUpdateSubscriptionStore({ subscribed, newCount, itemId }))
      })
      .catch(error)
  }

  function validateSubscribed() {
    return authSubscribed.indexOf(itemId) > -1
  }

  return (
    <span
      className={classNames.join(' ')}
      onClick={handleSubscribe}
      style={{ opacity: isAuthenticated && isSubscribed ? 0.3 : 1 }}
    >
      <i
        className={`fal fa-user-plus ${
          isAuthenticated && isSubscribed ? 'is-stored' : 'is-not-stored'
        }`}
      ></i>
      {iconCount(subscriptionStore[itemId])}
    </span>
  )
}
