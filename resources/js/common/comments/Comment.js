import React from 'react'
import { connect } from 'react-redux'
import dateParse from '../../helpers/dateParse'
import EditComment from './EditComment'
import WriteComment from './WriteComment'
import CommentChildren from './CommentChildren'
import CommentHeader from './comment/CommentHeader'
import CommentBody from './comment/CommentBody'
import CommentFooter from './comment/CommentFooter'
import ButtonCure from '../utils/ButtonCure'
import ButtonSubscription from '../utils/ButtonSubscription'
import iconCount from '../../helpers/iconCount'
import roleParse from '../../helpers/roleParse'
import loader from '../../helpers/loader'
import mapAuth from '../../helpers/mapAuth'

const { log, error } = console

export default connect(mapAuth)(Comment)

function Comment(props) {
  return (
    <section
      id={`recursive-group-${props.comment.id}`}
      className={`recursive-group ${props.depth < 5 ? '' : 'no-border-left'} ${
        props.auth && props.auth.id === props.user.id ? 'auth-comment' : ''
      } ${props.depth > 1 && props.depth < 5 ? 'left-margin' : 'no-left-margin'}`}
    >
      <article className="recursive-subject">
        <CommentHeader {...props} />
        {props.auth &&
        !props.writingParams &&
        props.editingParams &&
        props.auth.id === props.user.id &&
        props.editingParams.authId === props.user.id &&
        props.editingParams.id === props.comment.id ? (
          <EditComment {...props} />
        ) : (
          <React.Fragment>
            <CommentBody {...props} />
            <CommentFooter {...props} />
          </React.Fragment>
        )}
      </article>
      {props.auth &&
        props.writingParams &&
        props.writingParams.parentId === props.comment.id &&
        !props.editingParams && (
          <WriteComment
            handleSave={props.handleSave}
            handleCancel={props.handleCancel}
            handleWriteChange={props.handleWriteChange}
          />
        )}
      <CommentChildren
        isParent={false}
        comment={props.comment}
        parentId={props.comment.id}
        comments={props.comment.children}
        maxPages={props.maxPages}
        showChildren={props.showChildren}
        depth={props.depth}
        handleShowChildren={props.handleShowChildren}
        writingParams={props.writingParams}
        editingParams={props.editingParams}
        handleSave={props.handleSave}
        handleCancel={props.handleCancel}
        handleWriteChange={props.handleWriteChange}
        handleWrite={props.handleWrite}
        handleDelete={props.handleDelete}
        handleEdit={props.handleEdit}
        handleUpdate={props.handleUpdate}
      />
    </section>
  )
}
