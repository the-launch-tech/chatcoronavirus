import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import dateParse from '../../helpers/dateParse'
import EditComment from './EditComment'
import WriteComment from './WriteComment'
import RenderComments from './RenderComments'
import ButtonCure from '../utils/ButtonCure'
import ButtonSubscription from '../utils/ButtonSubscription'
import iconCount from '../../helpers/iconCount'
import roleParse from '../../helpers/roleParse'
import loader from '../../helpers/loader'
import mapAuth from '../../helpers/mapAuth'

const { log, error } = console

export default connect(mapAuth)(Comment)

function Comment({
  editingParams,
  writingParams,
  handleWrite,
  handleUpdate,
  handleCancel,
  handleDelete,
  handleEdit,
  handleSave,
  handleWriteChange,
  handleEditChange,
  comment,
  auth,
  commentId,
  dispatch,
  depth,
  screen,
}) {
  return (
    <div
      className={`recursive-group ${depth < 5 ? '' : 'no-border-left'}`}
      style={{
        marginLeft: depth > 1 && depth < 5 ? '2rem' : 0,
        width: `calc(100% - ${depth > 1 && depth < 5 ? '2rem' : '0px'}`,
      }}
    >
      <div className="recursive-subject">
        {auth &&
        !writingParams &&
        auth.id === comment.user.id &&
        editingParams.commentId === commentId &&
        editingParams.authId === comment.user.id &&
        editingParams.id === comment.id ? (
          <EditComment
            editingParams={editingParams}
            handleUpdate={handleUpdate}
            handleCancel={handleCancel}
            handleDelete={handleDelete}
            handleEditChange={handleEditChange}
          />
        ) : (
          <React.Fragment>
            <header className="comment-header">
              <div className="comment-user">
                <Link
                  className="comment-user-anchor"
                  to={`/profile/${comment.user.username}`}
                  onClick={e => loader(dispatch, true)}
                >
                  <img
                    className="comment-user-avatar"
                    src={`/storage/${comment.user.avatar}`}
                    alt={comment.user.username}
                    title={comment.user.username}
                  />
                  <h6 className="comment-user-username">{comment.user.username}</h6>
                </Link>
                <div className="comment-user-meta">
                  <span className="comment-icon">
                    <i className="fal fa-user-md"></i> {iconCount(comment.user.health_points)}
                  </span>
                  <ButtonSubscription
                    classNames={['comment-icon', 'hoverable']}
                    itemId={comment.user.id}
                    currentCures={comment.user.subscription_count}
                    type="user"
                  />
                </div>
              </div>
              <ButtonCure
                classNames={['comment-icon', 'hoverable']}
                itemId={comment.id}
                currentCures={comment.cures_count}
                type="comment"
              />
              <span className="comment-icon commented-at">
                <i className="fal fa-clock"></i> {dateParse(comment.created_at)}
              </span>
            </header>
            <div
              className="comment-content"
              dangerouslySetInnerHTML={{ __html: comment.content }}
            ></div>
            <div className="comment-actions">
              {auth && !writingParams && !editingParams && auth.id === comment.user.id ? (
                <button
                  type="button"
                  className="link-btn std-link-btn"
                  onClick={e =>
                    handleEdit(e, { id: comment.id, commentId, content: comment.content })
                  }
                >
                  Edit
                </button>
              ) : (
                ''
              )}
              {auth && !writingParams && !editingParams ? (
                <button
                  type="button"
                  className="link-btn std-link-btn"
                  onClick={e => handleWrite(e, { commentId: comment.id, authId: auth.id })}
                >
                  Reply
                </button>
              ) : (
                ''
              )}
            </div>
          </React.Fragment>
        )}
      </div>
      {writingParams.commentId === comment.id && auth && !editingParams ? (
        <WriteComment
          handleSave={handleSave}
          handleCancel={handleCancel}
          handleWriteChange={handleWriteChange}
        />
      ) : (
        ''
      )}
      <RenderComments
        auth={auth}
        commentId={comment.id}
        comments={comment.recursive_children}
        handleSave={handleSave}
        handleWrite={handleWrite}
        handleUpdate={handleUpdate}
        handleCancel={handleCancel}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        handleWriteChange={handleWriteChange}
        handleEditChange={handleEditChange}
        editingParams={editingParams}
        writingParams={writingParams}
        depth={depth}
      />
    </div>
  )
}
