import React from 'react'
import JoditEditor from 'jodit-react'

export default ({ editingParams, handleUpdate, handleCancel, handleDelete, handleEditChange }) => {
  return (
    <div className="edit-comment">
      <JoditEditor
        ref={null}
        value={editingParams.content}
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
        onBlur={handleEditChange}
        onChange={null}
      />
      <div className="edit-comment-actions">
        <button type="button" className="link-btn green-link-btn" onClick={handleUpdate}>
          Update
        </button>
        <button type="button" className="link-btn blue-link-btn" onClick={handleCancel}>
          Cancel
        </button>
        <button type="button" className="link-btn red-link-btn" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  )
}
