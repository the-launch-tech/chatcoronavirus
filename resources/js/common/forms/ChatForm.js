import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import JoditEditor from 'jodit-react'
import PostsService from '../../services/PostsService'
import actions from '../../store/actions'
import getUrl from '../../helpers/getUrl'
import joditConfig from '../../helpers/joditConfig'

const { log, error } = console

export default connect(({ Auth }) => {
  return {
    auth: Auth.auth,
  }
})(ChatForm)

function ChatForm({ auth, dispatch }) {
  const jodit = useRef(null)
  const [blur, setBlur] = useState(true)

  useEffect(() => {
    if (jodit.current) {
      jodit.current.parentElement.addEventListener('click', e => {
        event.preventDefault()
        setBlur(false)
      })
    }
  }, [jodit])

  function joditBlur(event) {
    if (jodit.current.value.length < 1) {
      setBlur(true)
    }
  }

  function handleSave(event) {
    if (!auth) {
      dispatch(
        actions.AUX.toggleSimpleDialog({
          active: true,
          content:
            '<p>"Chat" is a new feature in development.</p><p>You must be <a href="' +
            getUrl('/login') +
            '">logged in</a> to Chat.</p>',
        })
      )
    } else if (jodit.current.value.length < 1) {
      dispatch(
        actions.AUX.toggleSimpleDialog({
          active: true,
          content: '<p>Your chat must have some content!</p>',
        })
      )
    } else {
      PostsService.save({ authId: auth.id, data: { content: jodit.current.value }, format: 'chat' })
        .then(data => dispatch(actions.POST.setSavedPost(data.post)))
        .then(data => {
          handleCancel()
        })
        .catch(err => {
          handleCancel()
          error(err)
        })
    }
  }

  function handleCancel() {
    jodit.current.value = ''
    document.querySelector('.jodit_wysiwyg').innerHTML = ''
    setBlur(true)
  }

  return (
    <div className="chat-form form-wrapper">
      <div className="form-content">
        <div className={`chat-form-auth ${blur ? 'jodit-blur' : ''}`}>
          <img
            className="chat-form-avatar"
            src={getUrl('/storage/' + auth.avatar)}
            alt={auth.username}
            title={auth.username}
          />
          <h5 className="chat-form-username">{auth.username}</h5>
        </div>
        <div className="form-block">
          <div className={`form-row ${blur ? 'jodit-blur' : ''}`}>
            <div className="form-cell w-100">
              <JoditEditor
                ref={jodit}
                value={jodit && jodit.current ? jodit.current.value : ''}
                config={joditConfig.chat}
                onBlur={joditBlur}
              />
            </div>
          </div>
          <div className="form-row" style={{ padding: `0 1rem` }}>
            <button
              type="button"
              className="tiny-btn green-btn"
              onClick={handleSave}
              disabled={blur}
            >
              <i className="fal fa-comment-alt"></i> Chat
            </button>
            {!blur && (
              <button type="button" className="tiny-btn green-btn" onClick={handleCancel}>
                <i className="fal fa-undo"></i> Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
