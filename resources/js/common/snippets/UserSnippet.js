import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import ButtonSubscription from '../utils/ButtonSubscription'
import loader from '../../helpers/loader'
import getUrl from '../../helpers/getUrl'
import mapAuth from '../../helpers/mapAuth'
import iconCount from '../../helpers/iconCount'

const { log, error } = console

export default connect(mapAuth)(UserSnippet)

function UserSnippet({ isAuthenticated, auth, user, dispatch }) {
  return (
    <div className="snippet user-snippet">
      <div className="snippet-meta user-snippet">
        <span className="snippet-icon user-snippet">
          <i className="fal fa-user-md"></i> {iconCount(user.health_points)}
        </span>
        <ButtonSubscription
          classNames={['snippet-icon', 'snippet-icon-hover', 'user-snippet']}
          itemId={user.id}
          currentSubscriptions={user.subscribers_count}
          type="user"
        />
      </div>
      {user && user.avatar ? (
        <img
          id="snippet-thumbnail"
          className="snippet-thumbnail"
          src={getUrl('/storage/' + user.avatar)}
          alt={user.username}
          title={user.username}
        />
      ) : (
        ''
      )}
      <div className="snippet-main-wrapper">
        <Link
          className="snippet-title-anchor user-snippet"
          to={`/profile/${user.username}`}
          onClick={() => loader(dispatch, true)}
        >
          <h6 className="snippet-title user-snippet">{user.username}</h6>
        </Link>
        {user.country ||
          (user.state && (
            <div className="snippet-details user-snippet">
              {user.state && !user.country && (
                <span className="snippet-detail user-snippet">{user.state}</span>
              )}
              {user.country && !user.state && (
                <Link
                  className="snippet-detail-anchor user-snippet"
                  to={`/locations/${user.country}`}
                  onClick={() => loader(dispatch, true)}
                >
                  <span className="snippet-detail user-snippet">{user.country}</span>
                </Link>
              )}
              {user.country && user.state && (
                <Link
                  className="snippet-detail-anchor user-snippet"
                  to={`/locations/${user.country}`}
                  onClick={() => loader(dispatch, true)}
                >
                  <span className="snippet-detail user-snippet">
                    {user.state}, {user.country}
                  </span>
                </Link>
              )}
            </div>
          ))}
      </div>
    </div>
  )
}
