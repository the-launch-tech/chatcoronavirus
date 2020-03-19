import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import WriteComment from './WriteComment'
import RenderComments from './RenderComments'
import CommentsService from '../../services/CommentsService'
import mapAuth from '../../helpers/mapAuth'
import loader from '../../helpers/loader'
import getUrl from '../../helpers/getUrl'
import * as actions from '../../store/actions'
import recursiveSave from './utils/recursiveSave'
import recursiveUpdate from './utils/recursiveUpdate'
import recursiveDelete from './utils/recursiveDelete'

const { log, error } = console

export default connect(mapAuth)(Comments)

let fresh = true
function Comments({
  postId,
  initialComments,
  initialMaxPages,
  auth,
  isAuthenticated,
  access,
  dispatch,
}) {
  const comments_per_page = 2
  const withChilren = false
  const [paged, setPaged] = useState(1)
  const [maxPages, setMaxPages] = useState(initialMaxPages)
  const [empty, setEmpty] = useState(false)
  const [editingParams, setEditingParams] = useState(false)
  const [writingParams, setWritingParams] = useState(false)
  const [comments, setComments] = useState(initialComments)

  useEffect(() => setEmpty(maxPages <= paged), [paged, maxPages])

  function handleCancel(event) {
    setWritingParams(false)
    setEditingParams(false)
  }

  function handleEdit(event, { content, id, commentId }) {
    event.preventDefault()
    setEditingParams({ id, commentId, postId, authId: auth.id, content })
  }

  function handleWrite(event, { commentId }) {
    event.preventDefault()

    if (!auth) {
      dispatch(
        actions.auxSimpleDialog({
          active: true,
          content:
            '<p>You must be <a href="' +
            getUrl('/login') +
            '">logged in</a> or <a href="' +
            getUrl('/register') +
            '">registered</a> to write a comment!</p>',
        })
      )
      return
    }

    setWritingParams({ commentId, postId, authId: auth.id, content: null })
  }

  function handleSave(event) {
    event.preventDefault()
    loader(dispatch, true)
    CommentsService.save(writingParams)
      .then(data => {
        setComments(recursiveSave(data.comment, comments))
        handleCancel()
        loader(dispatch, false)
      })
      .catch(err => {
        loader(dispatch, false)
        error(err)
      })
  }

  function handleUpdate(event) {
    event.preventDefault()
    loader(dispatch, true)
    CommentsService.update(editingParams)
      .then(data => {
        setComments(recursiveUpdate(data.comment, comments))
        handleCancel()
        loader(dispatch, false)
      })
      .catch(err => {
        loader(dispatch, false)
        error(err)
      })
  }

  function handleDelete(event) {
    event.preventDefault()
    loader(dispatch, true)
    CommentsService.delete(editingParams)
      .then(data => {
        setComments(recursiveDelete(data.comment, comments))
        handleCancel()
        setComments(comments.filter(comment => comment.id !== data.id))
        loader(dispatch, false)
      })
      .catch(err => {
        loader(dispatch, false)
        error(err)
      })
  }

  function handleWriteChange(content) {
    writingParams.content = content
    setWritingParams(writingParams)
  }

  function handleEditChange(content) {
    editingParams.content = content
    setEditingParams(editingParams)
  }

  function loadMore() {
    event.preventDefault()
    if (!empty) {
      loader(dispatch, true)
      CommentsService.getComments({
        paged,
        posts_per_page: comments_per_page,
        post_id: postId,
        has_children: withChilren,
        comment_id: null,
      })
        .then(data => {
          setComments([...comments, ...data.comments])
        })
        .then(() => {
          loader(dispatch, false)
          setPaged(paged + 1)
        })
        .catch(err => {
          loader(dispatch, false)
          setEmpty(true)
          error(err)
        })
    }
  }

  return (
    <React.Fragment>
      {auth && writingParams && !writingParams.commentId && !editingParams ? (
        <WriteComment
          handleSave={handleSave}
          handleCancel={handleCancel}
          handleWriteChange={handleWriteChange}
        />
      ) : (
        <button
          type="button"
          className="link-btn blue-link-btn"
          onClick={e => handleWrite(e, { commentId: null })}
        >
          Write Comment
        </button>
      )}
      <RenderComments
        auth={auth}
        comments={comments}
        commentId={null}
        editingParams={editingParams}
        writingParams={writingParams}
        handleWrite={handleWrite}
        handleUpdate={handleUpdate}
        handleCancel={handleCancel}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        handleSave={handleSave}
        handleWriteChange={handleWriteChange}
        handleEditChange={handleEditChange}
        depth={0}
      />
      {(!empty && fresh) || (empty && !fresh) ? (
        <button type="button" onClick={loadMore} className="load-more-button green-btn md-btn">
          <i className="fad fa-spinner"></i> Load More
        </button>
      ) : (
        ''
      )}
    </React.Fragment>
  )
}
