import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import ButtonPin from '../../common/utils/ButtonPin'
import ButtonCure from '../../common/utils/ButtonCure'
import ButtonSubscription from '../../common/utils/ButtonSubscription'
import TaxonomyList from '../../common/utils/TaxonomyList'
import mapAuth from '../../helpers/mapAuth'
import loader from '../../helpers/loader'
import dateParse from '../../helpers/dateParse'
import PostsService from '../../services/PostsService'
import CommentsService from '../../services/CommentsService'
import Comments from '../../common/comments/index'
import iconCount from '../../helpers/iconCount'
import roleParse from '../../helpers/roleParse'

const { log, error } = console

export default withRouter(connect(mapAuth)(Thread))

function Thread({ title, page, dispatch, auth, isAuthenticated, access, match }) {
  const withChildren = false
  const comments_per_page = 2
  const [thread, setThread] = useState({})
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState([])
  const [maxPages, setMaxPages] = useState(-1)

  useEffect(() => {
    PostsService.getPost('thread', match.params.slug)
      .then(({ post }) => {
        setThread(post)
        loader(dispatch, false)
        PostsService.incrementView(post.id)
      })
      .catch(err => {
        loader(dispatch, false)
        error(err)
      })
  }, [])

  useEffect(() => {
    if (showComments) {
      loader(dispatch, true)
      CommentsService.getComments({
        paged: 0,
        posts_per_page: comments_per_page,
        post_id: thread.id,
        has_children: withChildren,
        comment_id: null,
      })
        .then(data => {
          setComments([...comments, ...data.comments])
          setMaxPages(data.total)
          loader(dispatch, false)
        })
        .catch(err => {
          loader(dispatch, false)
          error(err)
        })
    }
  }, [showComments])

  function handleShowComments(event) {
    setShowComments(true)
  }

  return (
    <div id="page-wrapper" className={`page-wrapper ${page}`}>
      <div id="page-content" className={`page-content ${page}`}>
        <div className="thread-single">
          <header className="thread-header">
            <h1 className="thread-title">Thread: {thread.title}</h1>
          </header>
          <section className="thread-subheader">
            <div className="thread-user">
              {thread.users &&
                thread.users.map((user, i) => (
                  <React.Fragment key={i}>
                    <Link
                      className="thread-user-anchor"
                      to={`/profile/${user.username}`}
                      onClick={e => loader(dispatch, true)}
                    >
                      <img
                        className="thread-user-avatar"
                        src={`/storage/${user.avatar}`}
                        alt={user.username}
                        title={user.username}
                      />
                      <h6 className="thread-username">{user.username}</h6>
                    </Link>
                    <div className="thread-usermeta">
                      <ButtonSubscription
                        classNames={['thread-subscribe']}
                        itemId={user.id}
                        currentSubscriptions={user.subscribers_count}
                        type="user"
                      />
                      <span className="thread-health_points">
                        <i className="fal fa-user-md"></i> {iconCount(user.health_points)}
                      </span>
                      <span className="thread-access">{roleParse(user.role, screen)}</span>
                    </div>
                  </React.Fragment>
                ))}
            </div>
            <div className="thread-details">
              <div className="thread-icons">
                <ButtonPin
                  classNames={['thread-icon', 'hoverable']}
                  itemId={thread.id}
                  currentPins={thread.pins_count}
                  type="post"
                />
                <ButtonCure
                  classNames={['thread-icon', 'hoverable']}
                  itemId={thread.id}
                  currentCures={thread.cures_count}
                  type="post"
                />
                <span className="thread-icon">
                  <i className="fal fa-eye"></i> {iconCount(thread.views)}
                </span>
                <span className="thread-icon">
                  <i className="fal fa-comments"></i> {iconCount(thread.comments_count)}
                </span>
              </div>
              <span className="thread-created">
                <i className="fal fa-clock"></i> {dateParse(thread.created_at)}
              </span>
            </div>
          </section>
          <article
            className="thread-body"
            dangerouslySetInnerHTML={{ __html: thread.content }}
          ></article>
          <footer className="thread-footer">
            <TaxonomyList
              classNames={{ wrapper: ['thread-footer-item'], link: ['thread-footer-anchor'] }}
              terms={thread.topics}
              slug="topics"
            />
            <TaxonomyList
              classNames={{ wrapper: ['thread-footer-item'], link: ['thread-footer-anchor'] }}
              terms={thread.realms}
              slug="realms"
            />
          </footer>
        </div>
        <section className="comments">
          {showComments && maxPages >= 0 ? (
            <Comments initialComments={comments} initialMaxPages={maxPages} postId={thread.id} />
          ) : (
            <button type="button" onClick={handleShowComments} className="md-btn green-btn">
              <i className="fal fa-comments"></i> Show Comments
            </button>
          )}
        </section>
      </div>
    </div>
  )
}
