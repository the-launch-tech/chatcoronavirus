import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import mapAuth from '../../helpers/mapAuth'
import SocialsService from '../../services/SocialsService'
import actions from '../../store/actions'
import iconCount from '../../helpers/iconCount'
import getUrl from '../../helpers/getUrl'

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
      actions.AUX.updateSubscriptionStore({
        itemId,
        initial: subscriptionStore[itemId] ? subscriptionStore[itemId] : currentSubscriptions,
      })
    )
    setIsSubscribed(validateSubscribed())
  }, [])

  useEffect(() => {
    dispatch(
      actions.AUX.updateSubscriptionStore({
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
      dispatch(
        actions.AUX.toggleSimpleDialog({
          active: true,
          content:
            '<p>You must be <a href="' +
            getUrl('/login') +
            '">logged in</a> or <a href="' +
            getUrl('/register') +
            '">registered</a> to subscribe or follow!</p>',
        })
      )
      return
    }
    SocialsService.increment({ social: 'subscriptions', authId: auth.id, itemId, type })
      .then(({ subscribed }) => {
        const newCount = subscribed
          ? (subscriptionStore[itemId] || 0) + 1
          : (subscriptionStore[itemId] || 0) - 1
        dispatch(actions.AUTH.setSubscribed({ subscribed, auth, itemId }))
        dispatch(actions.AUX.updateSubscriptionStore({ subscribed, newCount, itemId }))
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
