import React from 'react'
import { connect } from 'react-redux'
import WriteComment from './WriteComment'
import WriteButton from './buttons/WriteButton'

const mapStateToProps = ({ Auth }) => {
  return {
    auth: Auth.auth,
  }
}

export default connect(mapStateToProps)(WriteButtonEditor)

function WriteButtonEditor(props) {
  return (
    <div className="recursion-root">
      {props.auth &&
      props.writingParams &&
      props.writingParams.parentId === props.parentId &&
      !props.editingParams ? (
        <WriteComment
          handleSave={props.handleSave}
          handleCancel={props.handleCancel}
          handleWriteChange={props.handleWriteChange}
        />
      ) : (
        <WriteButton {...props} targetId={props.parentId} />
      )}
    </div>
  )
}
