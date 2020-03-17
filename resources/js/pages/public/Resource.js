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
import PostsService from '../../services/PostsService'
import CommentsService from '../../services/CommentsService'
import Comments from '../../common/comments/index'
import iconCount from '../../helpers/iconCount'

const { log, error } = console

export default withRouter(connect(mapAuth)(Resource))

function Resource({ title, page, dispatch, auth, isAuthenticated, access, match }) {
  const withChildren = false
  const comments_per_page = 2
  const [resource, setResource] = useState({})
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState([])
  const [maxPages, setMaxPages] = useState(-1)

  useEffect(() => {
    PostsService.getPost('resource', match.params.slug)
      .then(({ post }) => {
        setResource(post)
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
        post_id: resource.id,
        has_children: withChildren,
        comment_id: null,
      })
        .then(data => {
          setComments(data.comments)
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
        <div className="resource-single">
          <header className="resource-header">
            <h1 className="resource-title">Resource: {resource.title}</h1>
          </header>
          <section className="resource-subheader">
            <div className="resource-user">
              {resource.users &&
                resource.users.map((user, i) => (
                  <React.Fragment>
                    <Link
                      key={i}
                      className="resource-user-anchor"
                      to={`/profile/${user.username}`}
                      onClick={e => loader(dispatch, true)}
                    >
                      <img
                        className="resource-user-avatar"
                        src={`/storage/${user.avatar}`}
                        alt={user.username}
                        title={user.username}
                      />
                      <h6 className="resource-username">{user.username}</h6>
                    </Link>
                    <div className="resource-usermeta">
                      <ButtonSubscription
                        classNames={['resource-subscribe']}
                        itemId={user.id}
                        currentSubscriptions={user.subscribers_count}
                        type="user"
                      />
                      <span className="resource-health_points">
                        <i className="fal fa-user-md"></i> {iconCount(user.health_points)}
                      </span>
                      <span className="resource-access">{user.role ? user.role : 'Patient'}</span>
                    </div>
                  </React.Fragment>
                ))}
            </div>
            <div className="resource-details">
              <div className="resource-icons">
                <ButtonPin
                  classNames={['resource-icon', 'hoverable']}
                  itemId={resource.id}
                  currentPins={resource.pins_count}
                  type="post"
                />
                <ButtonCure
                  classNames={['resource-icon', 'hoverable']}
                  itemId={resource.id}
                  currentCures={resource.cures_count}
                  type="post"
                />
                <span className="resource-icon">
                  <i className="fal fa-eye"></i> {iconCount(resource.views)}
                </span>
                <span className="resource-icon">
                  <i className="fal fa-comments"></i> {iconCount(resource.comments_count)}
                </span>
              </div>
              <span className="resource-created">
                <i className="fal fa-clock"></i> {dateParse(resource.created_at)}
              </span>
            </div>
          </section>
          <article
            className="resource-body"
            dangerouslySetInnerHTML={{ __html: resource.content }}
          ></article>
          <footer className="resource-footer">
            <TaxonomyList
              classNames={{ wrapper: ['resource-footer-item'], link: ['resource-footer-anchor'] }}
              terms={resource.topics}
              slug="topics"
            />
            <TaxonomyList
              classNames={{ wrapper: ['resource-footer-item'], link: ['resource-footer-anchor'] }}
              terms={resource.realms}
              slug="realms"
            />
          </footer>
        </div>
        <section className="comments">
          {showComments && maxPages >= 0 ? (
            <Comments initialComments={comments} initialMaxPages={maxPages} postId={resource.id} />
          ) : (
            <button type="button" onClick={handleShowComments} className="md-btn green-btn">
              Show Comments
            </button>
          )}
        </section>
      </div>
    </div>
  )
}
