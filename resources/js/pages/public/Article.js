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
import CommentsService from '../../services/CommentsService'
import Comments from '../../common/comments/index'
import iconCount from '../../helpers/iconCount'

const { log, error } = console

export default withRouter(connect(mapAuth)(Article))

function Article({ title, page, dispatch, auth, isAuthenticated, access, match }) {
  const withChildren = false
  const comments_per_page = 2
  const [article, setArticle] = useState({})
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState([])
  const [maxPages, setMaxPages] = useState(-1)

  useEffect(() => {
    PostsService.getPost('article', match.params.slug)
      .then(({ post }) => {
        setArticle(post)
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
        post_id: article.id,
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
      {article.featured_image ? (
        <img
          className="article-banner"
          src={getUrl('/storage/' + article.featured_image)}
          alt={article.title}
          alt={article.title}
        />
      ) : (
        ' '
      )}
      <div id="page-content" className={`page-content ${page}`}>
        <article className="article-single">
          <header className="article-header">
            <h1 className="article-title">Article: {article.title}</h1>
            <div className="article-details">
              <div className="article-meta">
                <div className="article-meta-content">
                  {article.users &&
                    article.users.map((user, i) => (
                      <div key={i} className="article-user">
                        <Link
                          className="article-user-anchor"
                          to={`/profile/${user.username}`}
                          onClick={e => loader(dispatch, true)}
                        >
                          <img
                            className="article-user-avatar"
                            src={`/storage/${user.avatar}`}
                            alt={user.username}
                            title={user.username}
                          />
                          <h6 className="article-username">{user.username}</h6>
                        </Link>
                        <div className="article-usermeta">
                          <ButtonSubscription
                            classNames={['article-subscribe']}
                            itemId={user.id}
                            currentSubscriptions={user.subscribers_count}
                            type="user"
                          />
                          <span className="article-health_points">
                            <i className="fal fa-user-md"></i> {iconCount(user.health_points)}
                          </span>
                          <span className="article-access">
                            {user.role ? user.role : 'Patient'}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              <div className="article-meta">
                <div className="article-meta-content">
                  <span className="article-created">
                    <i className="fal fa-clock"></i> {dateParse(article.created_at)}
                  </span>
                  <div className="article-icons">
                    <ButtonPin
                      classNames={['article-icon', 'post-excerpt-pin']}
                      itemId={article.id}
                      currentPins={article.pins_count}
                      type="post"
                    />
                    <ButtonCure
                      classNames={['article-icon']}
                      itemId={article.id}
                      currentCures={article.cures_count}
                      type="post"
                    />
                    <span className="article-icon">
                      <i className="fal fa-eye"></i> {iconCount(article.views)}
                    </span>
                    <span className="article-icon">
                      <i className="fal fa-comments"></i> {iconCount(article.comments_count)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <div className="article-body" dangerouslySetInnerHTML={{ __html: article.content }}></div>
          <footer className="article-footer">
            <TaxonomyList
              classNames={{ wrapper: ['article-footer-item'], link: ['article-footer-anchor'] }}
              terms={article.topics}
              slug="topics"
            />
            <TaxonomyList
              classNames={{ wrapper: ['article-footer-item'], link: ['article-footer-anchor'] }}
              terms={article.realms}
              slug="realms"
            />
          </footer>
        </article>
        <section className="comments">
          {showComments && maxPages >= 0 ? (
            <Comments initialComments={comments} initialMaxPages={maxPages} postId={article.id} />
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
