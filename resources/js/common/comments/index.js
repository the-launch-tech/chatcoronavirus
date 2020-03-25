import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import CommentChildren from './CommentChildren'
import WriteButtonEditor from './WriteButtonEditor'
import recursiveReducer from './utils/recursiveReducer'
import CommentsService from '../../services/CommentsService'
import mapAuth from '../../helpers/mapAuth'
import loader from '../../helpers/loader'
import getUrl from '../../helpers/getUrl'
import actions from '../../store/actions'

const { log, error } = console

const mapStateToProps = ({ Comment, Auth }) => {
  return {
    emptyCommentChildren: Comment.emptyCommentChildren,
    auth: Auth.auth,
  }
}

export default connect(mapStateToProps)(Comments)

function Comments({ dispatch, postId, emptyCommentChildren, auth, postComments }) {
  const [maxPages, setMaxPages] = useState({})
  const [paged, setPaged] = useState({})
  const [showChildren, setShowChildren] = useState({})
  const [comments, setComments] = useState([])
  const [editingParams, setEditingParams] = useState(false)
  const [writingParams, setWritingParams] = useState(false)
  const [order, setOrder] = useState('DESC')

  useEffect(() => {
    const initialMaxPages = {}
    const initialPaged = {}
    const initialShowChildren = {}
    initialMaxPages[postId] = -1
    initialPaged[postId] = 0
    initialShowChildren[postId] = false
    setMaxPages(initialMaxPages)
    setPaged(initialPaged)
    setShowChildren(initialShowChildren)
  }, [postId])

  function getComments({ parent_id, has_children, posts_per_page }) {
    if (emptyCommentChildren.indexOf(parent_id) < 0) {
      loader(dispatch, true)
      CommentsService.getComments({
        paged: paged[parent_id] ? parseInt(paged[parent_id]) : 0,
        posts_per_page,
        post_id: postId,
        parent_id,
        has_children,
        order,
      })
        .then(data => {
          const renderData = {
            data,
            parent_id,
            is_top_level: parent_id === postId,
          }
          recursiveMerge('RENDER', renderData)
          const newPaged = paged[parent_id] ? parseInt(paged[parent_id]) + 1 : 1
          handleEmpty(parent_id, data.total, newPaged)
          handleMaxPages(parent_id, data.total)
          handlePaged(parent_id, newPaged)
        })
        .catch(err => {
          loader(dispatch, false)
          handleEmpty(true)
          error(err)
        })
    }
  }

  function handleMaxPages(parentId, total) {
    maxPages[parentId] = parseInt(total)
    setMaxPages(maxPages)
  }

  function handlePaged(parentId, newPaged) {
    paged[parentId] = newPaged
    setPaged(paged)
  }

  function handleShowChildren(event, parentId) {
    event.preventDefault()
    if (showChildren[parentId]) {
      getComments({ parent_id: parentId, has_children: 0, posts_per_page: 5 })
    } else {
      showChildren[parentId] = true
      setShowChildren(showChildren)
      if (showChildren[parentId]) {
        getComments({ parent_id: parentId, has_children: 0, posts_per_page: 5 })
      }
    }
  }

  function handleEmpty(parentId, total, newPaged) {
    if (total > -1 && total <= newPaged) {
      dispatch(actions.COMMENT.updateEmptyChildren(parentId))
    }
  }

  function handleCancel(event) {
    setWritingParams(false)
    setEditingParams(false)
  }

  function handleEdit(event, { content, id }) {
    event.preventDefault()
    setEditingParams({ id, postId, authId: auth.id, content })
  }

  function handleWrite(event, { parentId }) {
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
    setWritingParams({ parentId, postId, authId: auth.id, content: null })
  }

  function handleSave(event) {
    event.preventDefault()
    loader(dispatch, true)
    CommentsService.save(writingParams)
      .then(data => {
        data.is_top_level = postId === writingParams.parentId
        recursiveMerge('SAVE', data)
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
      .then(data => recursiveMerge('UPDATE', data))
      .catch(err => {
        loader(dispatch, false)
        error(err)
      })
  }

  function handleDelete(event, args) {
    event.preventDefault()
    loader(dispatch, true)
    CommentsService.delete({
      id: args.id,
      postId,
      authId: auth.id,
    })
      .then(data => recursiveMerge('DELETE', data))
      .catch(err => {
        loader(dispatch, false)
        error(err)
      })
  }

  function recursiveMerge(actionType, data) {
    const action = recursiveReducer[actionType]
    action(data, comments, mergedComments => {
      setComments(mergedComments)
    })
    handleCancel()
    loader(dispatch, false)
  }

  function handleWriteChange(content) {
    writingParams.content = content
    setWritingParams(writingParams)
  }

  function handleEditChange(content) {
    editingParams.content = content
    setEditingParams(editingParams)
  }

  function handleSelectChange(event) {
    Array.from(event.target.children).map(el => {
      if (el.selected) {
        if (event.target.name === 'order') {
          setOrder(el.value)
        }
      }
    })
  }

  return (
    <div className="comment-section-wrapper">
      <div className="form-wrapper">
        <h6 className="form-title">Filter Discussion</h6>
        <div className="form-content">
          <div className="form-block">
            <div className="form-row">
              <div className="form-cell w-50">
                <label>Display Order</label>
                <select
                  className="form-input"
                  name="order"
                  defaultValue="DESC"
                  onChange={handleSelectChange}
                >
                  <option value="DESC">Most Recent</option>
                  <option value="ASC">Oldest</option>
                  <option value="popularity">Most Popular</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section id={`recursive-tree-${postId}`} className="recursive-tree">
        <WriteButtonEditor
          parentId={postId}
          writingParams={writingParams}
          editingParams={editingParams}
          handleSave={handleSave}
          handleCancel={handleCancel}
          handleWriteChange={handleWriteChange}
          handleWrite={handleWrite}
        />
        <CommentChildren
          isParent={true}
          postComments={postComments}
          comment={{ recursive_children_count: 1 }}
          comments={comments}
          parentId={postId}
          maxPages={maxPages}
          showChildren={showChildren}
          depth={0}
          handleShowChildren={handleShowChildren}
          writingParams={writingParams}
          editingParams={editingParams}
          handleSave={handleSave}
          handleCancel={handleCancel}
          handleWriteChange={handleWriteChange}
          handleWrite={handleWrite}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          handleUpdate={handleUpdate}
        />
      </section>
    </div>
  )
}
