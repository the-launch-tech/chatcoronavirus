import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import actions from '../../store/actions'
import loader from '../../helpers/loader'
import iconCount from '../../helpers/iconCount'
import getUrl from '../../helpers/getUrl'
import roleParse from '../../helpers/roleParse'
import dateParse from '../../helpers/dateParse'
import ButtonSubscription from '../utils/ButtonSubscription'
import ButtonPin from '../utils/ButtonPin'
import ButtonCure from '../utils/ButtonCure'

const { log, error } = console

export default connect(({ Post }) => {
  return {
    expandedPost: Post.expandedPost,
  }
})(ChatExpansion)

function ChatExpansion({ expandedPost, dispatch }) {
  const [expand, setExpand] = useState(false)

  useEffect(() => {
    if (expandedPost) {
      setTimeout(() => setExpand(true), 200)
    }
  }, [expandedPost])

  useEffect(() => {
    if (!expand) {
      setTimeout(() => {
        dispatch(actions.POST.setExpandedPost(false))
      }, 500)
    }
  }, [expand])

  function closeModal(event) {
    event.preventDefault()
    setExpand(false)
  }

  function handleReply(event) {
    event.preventDefault()
  }

  if (expandedPost || expand) {
    return (
      <div className={`expansion-overlay ${expand ? 'active-expansion' : ''}`}>
        <div className="expansion-wrapper">
          <div className="expansion-connector"></div>
          {expandedPost.chat_id ? (
            <div className="expansion-superframe">
              <div className="expansion-parents"></div>
            </div>
          ) : (
            ''
          )}
          <div className="expansion-frame">
            {expandedPost ? (
              <article className="expansion-item">
                <header className="expansion-header">
                  <div className="expansion-user">
                    <Link
                      className="expansion-user-anchor"
                      to={`/profile/${expandedPost.user.username}`}
                      onClick={() => loader(dispatch, true)}
                    >
                      <img
                        id="expansion-avatar"
                        className="expansion-avatar"
                        src={getUrl('/storage/' + expandedPost.user.avatar)}
                        alt={expandedPost.user.username}
                        title={expandedPost.user.username}
                      />
                      <h6 className="expansion-username">{expandedPost.user.username}</h6>
                    </Link>
                  </div>
                  <div className="expansion-user-meta">
                    <ButtonSubscription
                      classNames={['expansion-icon', 'hoverable']}
                      itemId={expandedPost.user.id}
                      currentSubscriptions={expandedPost.user.subscribers_count}
                      type="user"
                    />
                    <span className="expansion-icon hoverable">
                      <i className="fal fa-user-md"></i>{' '}
                      {iconCount(expandedPost.user.health_points)}
                    </span>
                    <span className="expansion-access">
                      {roleParse(expandedPost.user.role, screen)}
                    </span>
                  </div>
                  <i className="fal fa-times expansion-icon hoverable" onClick={closeModal}></i>
                </header>
                <main className="expansion-body">
                  <div
                    className="expansion-content"
                    dangerouslySetInnerHTML={{ __html: expandedPost.content }}
                  ></div>
                </main>
                <footer className="expansion-footer">
                  <div className="expansion-meta-left">
                    <div className="expansion-details">
                      <ButtonPin
                        classNames={['expansion-icon', 'hoverable']}
                        itemId={expandedPost.id}
                        currentPins={expandedPost.pins_count}
                        type="post"
                      />
                      <ButtonCure
                        classNames={['expansion-icon', 'hoverable']}
                        itemId={expandedPost.id}
                        currentCures={expandedPost.cures_count}
                        type="post"
                      />
                      <span className="expansion-icon">
                        <i className="fal fa-comments"></i> {iconCount(expandedPost.comments_count)}
                      </span>
                    </div>
                  </div>
                  <div className="expansion-meta-right">
                    <span className="expansion-icon">
                      <i className="fal fa-clock"></i> {dateParse(expandedPost.created_at)}
                    </span>
                  </div>
                </footer>
              </article>
            ) : (
              ''
            )}
          </div>
          <div className="expansion-subframe">
            <div className="expansion-children">
              {expandedPost.chats_count > 0 ? (
                <React.Fragment></React.Fragment>
              ) : (
                <button type="button" className="tiny-btn green-btn" onClick={handleReply}>
                  Respond
                </button>
              )}
              <div className="expansion-response-form">
                <div className="form-wrapper">
                  <div className="form-content">
                    <div className="form-block">
                      <div className="form-row">
                        <div className="form-cell w-100">
                          <JoditEditor />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-cell w-50 form-start">
                          <button type="button" className="tiny-btn green-btn">
                            Chat
                          </button>
                        </div>
                        <div className="form-cell w-50 form-end">
                          <button type="button" className="tiny-btn orange-btn">
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    return <React.Fragment />
  }
}
