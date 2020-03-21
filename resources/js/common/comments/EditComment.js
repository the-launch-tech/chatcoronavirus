import React from 'react'
import JoditEditor from 'jodit-react'
import joditConfig from './utils/joditConfig'
import CommentFooter from './comment/CommentFooter'

export default props => {
  return (
    <React.Fragment>
      <JoditEditor
        ref={null}
        value={props.editingParams.content}
        config={joditConfig}
        tabIndex={1}
        onBlur={props.handleEditChange}
        onChange={null}
      />
      <CommentFooter type="EDIT" {...props} />
    </React.Fragment>
  )
}
