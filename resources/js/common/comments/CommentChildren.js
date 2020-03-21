import React from 'react'
import { connect } from 'react-redux'
import RenderComments from './RenderComments'
import ShowChildrenButton from './buttons/ShowChildrenButton'

const { log, error } = console

const mapStateToProps = ({ Comment }) => {
  return {
    emptyCommentChildren: Comment.emptyCommentChildren,
  }
}

export default connect(mapStateToProps)(CommentChildren)

function CommentChildren(props) {
  return (
    <section id={`subject-children-${props.parentId}`} className="subject-children">
      {props.showChildren[props.parentId]
        ? props.comments && (
            <RenderComments
              parentId={props.parentId}
              comments={props.comments}
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
          )
        : ''}
      {!(props.emptyCommentChildren.indexOf(props.parentId) > -1) &&
      props.comment.recursive_children_count > 0 ? (
        <ShowChildrenButton
          parentId={props.parentId}
          handleShowChildren={props.handleShowChildren}
          isParent={props.isParent}
          postComments={props.postComments}
          comment={props.comment}
        />
      ) : (
        ''
      )}
    </section>
  )
}
