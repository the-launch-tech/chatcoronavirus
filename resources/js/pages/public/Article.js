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

export default withRouter(connect(mapAuth)(Article))

function Article({ title, page, dispatch, auth, isAuthenticated, access, match }) {
  const [article, setArticle] = useState({})

  useEffect(() => {
    dispatch(actions.AUX.updatePageTitle({ pageTitle: article.title, showCurrent: false }))
  }, [article])

  useEffect(() => {
    PostsService.get({ route: 'SINGLE', format: 'article', slug: match.params.slug })
      .then(({ post }) => {
        setArticle(post)
        loader(dispatch, false)
        PostsService.incrementView({ postId: post.id })
      })
      .catch(err => {
        loader(dispatch, false)
        error(err)
      })
  }, [])

  return (
    <React.Fragment>
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
      <div className="article-banner-overlay"></div>
      <article className="article-single">
        <header className="article-header">
          <h1 className="article-title">Article: {article.title}</h1>
          <div className="article-details">
            <div className="article-meta">
              {article.user && (
                <div className="article-meta-content">
                  <div className="article-user">
                    <Link
                      className="article-user-anchor"
                      to={`/profile/${article.user.username}`}
                      onClick={e => loader(dispatch, true)}
                    >
                      <img
                        className="article-user-avatar"
                        src={`/storage/${article.user.avatar}`}
                        alt={article.user.username}
                        title={article.user.username}
                      />
                      <h6 className="article-username">{article.user.username}</h6>
                    </Link>
                    <div className="article-usermeta">
                      <ButtonSubscription
                        classNames={['article-subscribe']}
                        itemId={article.user.id}
                        currentSubscriptions={article.user.subscribers_count}
                        type="user"
                      />
                      <span className="article-health_points">
                        <i className="fal fa-user-md"></i> {iconCount(article.user.health_points)}
                      </span>
                      <span className="article-access">{roleParse(article.user.role, screen)}</span>
                    </div>
                  </div>
                </div>
              )}
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
      {article && article.id ? (
        <Comments postId={article.id} postComments={article.comments_count} />
      ) : (
        ''
      )}
    </React.Fragment>
  )
}
