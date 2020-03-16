import React from 'react'
import JoditEditor from 'jodit-react'

export default ({ handleCancel, handleSave, handleWriteChange }) => {
  return (
    <div className="write-comment">
      <JoditEditor
        ref={null}
        value={''}
        config={{
          readonly: false,
          removeButtons: [
            'source',
            'font',
            'brush',
            'copyformat',
            'symbol',
            'fullsize',
            'print',
            'about',
            'eraser',
            'fontsize',
            'paragraph',
            'file',
            'left',
            'right',
            'center',
            'justify',
            'superscript',
            'subscript',
            'strikethrough',
            'paste',
            'copy',
            'cut',
            'selectall',
            'break',
          ],
        }}
        tabIndex={1}
        onBlur={handleWriteChange}
        onChange={null}
      />
      <div className="write-comment-actions">
        <button type="button" className="link-btn green-link-btn" onClick={handleSave}>
          Save
        </button>
        <button type="button" className="link-btn red-link-btn" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  )
}
