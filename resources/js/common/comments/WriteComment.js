import React from 'react'
import JoditEditor from 'jodit-react'
import joditConfig from '../../helpers/joditConfig'
import CommentFooter from './comment/CommentFooter'

export default props => {
  return (
    <article className="recursion-proposal">
      <JoditEditor
        ref={null}
        value={''}
        config={joditConfig.comment}
        tabIndex={1}
        onBlur={props.handleWriteChange}
        onChange={null}
      />
      <CommentFooter type="WRITE" {...props} />
    </article>
  )
}
