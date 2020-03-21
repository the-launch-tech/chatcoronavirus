import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import iconCount from '../../../helpers/iconCount'
import dateParse from '../../../helpers/dateParse'
import loader from '../../../helpers/loader'
import ButtonSubscription from '../../utils/ButtonSubscription'
import ButtonCure from '../../utils/ButtonCure'

export default connect()(CommentHeader)

function CommentHeader(props) {
  return (
    <header className="comment-header">
      <div className="comment-user">
        <Link
          className="comment-user-anchor"
          to={`/profile/${props.user.username}`}
          onClick={e => loader(props.dispatch, true)}
        >
          <img
            className="comment-user-avatar"
            src={`/storage/${props.user.avatar}`}
            alt={props.user.username}
            title={props.user.username}
          />
          <h6 className="comment-user-username">{props.user.username}</h6>
        </Link>
        <div className="comment-user-meta">
          <span className="comment-icon">
            <i className="fal fa-user-md"></i> {iconCount(props.user.health_points)}
          </span>
          <ButtonSubscription
            classNames={['comment-icon', 'hoverable']}
            itemId={props.user.id}
            currentCures={props.user.subscription_count}
            type="user"
          />
        </div>
      </div>
      <ButtonCure
        classNames={['comment-icon', 'hoverable']}
        itemId={props.comment.id}
        currentCures={props.comment.cures_count}
        type="comment"
      />
      <span className="comment-icon commented-at">
        <i className="fal fa-clock"></i> {dateParse(props.comment.created_at)}
      </span>
    </header>
  )
}
