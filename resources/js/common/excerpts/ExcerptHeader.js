import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import loader from '../../helpers/loader'
import mapAuth from '../../helpers/mapAuth'
import iconCount from '../../helpers/iconCount'
import getUrl from '../../helpers/getUrl'
import roleParse from '../../helpers/roleParse'
import ButtonSubscription from '../utils/ButtonSubscription'

const { log, error } = console

export default connect(mapAuth)(({ post, user, dispatch, screen }) => {
  return (
    <header className="excerpt-header">
      {user && (
        <React.Fragment>
          <Link
            className="excerpt-user-main"
            to={`/profile/${user.username}`}
            onClick={() => loader(dispatch, true)}
          >
            <img
              id="excerpt-avatar"
              className="excerpt-avatar"
              src={getUrl('/storage/' + user.avatar)}
              alt={user.username}
              title={user.username}
            />
            <h6 className="excerpt-username">{user.username}</h6>
          </Link>
          <div className="excerpt-usermeta">
            <ButtonSubscription
              classNames={['excerpt-subscribe', 'hoverable']}
              itemId={user.id}
              currentSubscriptions={user.subscribers_count}
              type="user"
            />
            <span className="excerpt-health_points">
              <i className="fal fa-user-md"></i> {iconCount(user.health_points)}
            </span>
            <span className="excerpt-access">{roleParse(user.role, screen)}</span>
          </div>
        </React.Fragment>
      )}
    </header>
  )
})
