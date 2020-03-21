import React from 'react'
import JoditEditor from 'jodit-react'
import joditConfig from './utils/joditConfig'
import CommentFooter from './comment/CommentFooter'

export default props => {
  return (
    <article className="recursion-proposal">
      <JoditEditor
        ref={null}
        value={''}
        config={joditConfig}
        tabIndex={1}
        onBlur={props.handleWriteChange}
        onChange={null}
      />
      <CommentFooter type="WRITE" {...props} />
    </article>
  )
}
