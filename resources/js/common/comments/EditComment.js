import React from 'react'
import JoditEditor from 'jodit-react'
import joditConfig from '../../helpers/joditConfig'
import CommentFooter from './comment/CommentFooter'

export default props => {
  return (
    <React.Fragment>
      <JoditEditor
        ref={null}
        value={props.editingParams.content}
        config={joditConfig.comment}
        tabIndex={1}
        onBlur={props.handleEditChange}
        onChange={null}
      />
      <CommentFooter type="EDIT" {...props} />
    </React.Fragment>
  )
}
