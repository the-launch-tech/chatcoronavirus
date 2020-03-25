import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import moment from 'moment'
import ButtonPin from '../../common/utils/ButtonPin'
import ButtonCure from '../../common/utils/ButtonCure'
import ButtonSubscription from '../../common/utils/ButtonSubscription'
import TaxonomyList from '../../common/utils/TaxonomyList'
import mapAuth from '../../helpers/mapAuth'
import dateParse from '../../helpers/dateParse'
import loader from '../../helpers/loader'
import getUrl from '../../helpers/getUrl'
import PostsService from '../../services/PostsService'
import Comments from '../../common/comments/index'
import iconCount from '../../helpers/iconCount'
import roleParse from '../../helpers/roleParse'
import actions from '../../store/actions'

const { log, error } = console

export default withRouter(connect(mapAuth)(Thread))

function Thread({ title, page, dispatch, auth, isAuthenticated, access, match }) {
  const [thread, setThread] = useState({})

  useEffect(() => {
    PostsService.get({ route: 'SINGLE', format: 'thread', slug: match.params.slug })
      .then(({ post }) => {
        setThread(post)
        loader(dispatch, false)
        PostsService.incrementView({ postId: post.id })
      })
      .catch(err => {
        loader(dispatch, false)
        error(err)
      })
  }, [])

  useEffect(() => {
    dispatch(actions.AUX.updatePageTitle({ pageTitle: `${thread.title}`, showCurrent: false }))
  }, [thread])

  return (
    <React.Fragment>
      <div className="thread-single">
        <header className="thread-header">
          <h1 className="thread-title">Thread: {thread.title}</h1>
        </header>
        <section className="thread-subheader">
          <div className="thread-user">
            {thread.user && (
              <React.Fragment>
                <Link
                  className="thread-user-anchor"
                  to={`/profile/${thread.user.username}`}
                  onClick={e => loader(dispatch, true)}
                >
                  <img
                    className="thread-user-avatar"
                    src={`/storage/${thread.user.avatar}`}
                    alt={thread.user.username}
                    title={thread.user.username}
                  />
                  <h6 className="thread-username">{thread.user.username}</h6>
                </Link>
                <div className="thread-usermeta">
                  <ButtonSubscription
                    classNames={['thread-subscribe']}
                    itemId={thread.user.id}
                    currentSubscriptions={thread.user.subscribers_count}
                    type="user"
                  />
                  <span className="thread-health_points">
                    <i className="fal fa-user-md"></i> {iconCount(thread.user.health_points)}
                  </span>
                  <span className="thread-access">{roleParse(thread.user.role, screen)}</span>
                </div>
              </React.Fragment>
            )}
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
      {thread && thread.id ? (
        <Comments postId={thread.id} postComments={thread.comments_count} />
      ) : (
        ''
      )}
    </React.Fragment>
  )
}
