import React from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import loader from '../helpers/loader'
import getUrl from '../helpers/getUrl'
import iconCount from '../helpers/iconCount'
import currentNav from '../helpers/currentNav'
import roleParse from '../helpers/roleParse'
import ButtonSubscription from '../common/utils/ButtonSubscription'

export default withRouter(
  connect(({ Aux }) => {
    return {
      screen: Aux.screen,
    }
  })(UserHeader)
)

function UserHeader({ user, dispatch, screen }) {
  return (
    <div className="user-profile-header">
      <img
        className="user-profile-banner"
        src={getUrl('/storage/' + user.banner)}
        alt={user.username}
        title={user.username}
      />
      <div className="user-profile-wrapper">
        <div className="user-profile-content">
          <div className="user-profile-face">
            <img
              id="user-profile-avatar"
              className="user-profile-avatar"
              src={getUrl('/storage/' + user.avatar)}
              alt={user.username}
              title={user.username}
            />
            <h1 className="user-profile-name">{user.username}</h1>
          </div>
          <div className="user-profile-meta">
            <ButtonSubscription
              classNames={['user-profile-subscribe']}
              itemId={user.id}
              currentSubscriptions={user.subscribers_count}
              type="user"
            />
            <span className="user-profile-health_points">
              <i className="fal fa-user-md"></i> {iconCount(user.health_points)}
            </span>
            <span className="user-profile-access">{roleParse(user.role, screen)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
