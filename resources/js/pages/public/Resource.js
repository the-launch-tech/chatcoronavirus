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

export default withRouter(connect(mapAuth)(Resource))

function Resource({ title, page, dispatch, auth, isAuthenticated, access, match }) {
  const [resource, setResource] = useState({})

  useEffect(() => {
    PostsService.get({ route: 'SINGLE', format: 'resource', slug: match.params.slug })
      .then(({ post }) => {
        setResource(post)
        loader(dispatch, false)
        PostsService.incrementView({ postId: post.id })
      })
      .catch(err => {
        loader(dispatch, false)
        error(err)
      })
  }, [])

  useEffect(() => {
    dispatch(actions.AUX.updatePageTitle({ pageTitle: `${resource.title}`, showCurrent: false }))
  }, [resource])

  return (
    <React.Fragment>
      <div className="resource-single">
        <header className="resource-header">
          <h1 className="resource-title">Resource: {resource.title}</h1>
        </header>
        <section className="resource-subheader">
          <div className="resource-user">
            {resource.user && (
              <React.Fragment>
                <Link
                  className="resource-user-anchor"
                  to={`/profile/${resource.user.username}`}
                  onClick={e => loader(dispatch, true)}
                >
                  <img
                    className="resource-user-avatar"
                    src={`/storage/${resource.user.avatar}`}
                    alt={resource.user.username}
                    title={resource.user.username}
                  />
                  <h6 className="resource-username">{resource.user.username}</h6>
                </Link>
                <div className="resource-usermeta">
                  <ButtonSubscription
                    classNames={['resource-subscribe']}
                    itemId={resource.user.id}
                    currentSubscriptions={resource.user.subscribers_count}
                    type="user"
                  />
                  <span className="resource-health_points">
                    <i className="fal fa-user-md"></i> {iconCount(resource.user.health_points)}
                  </span>
                  <span className="resource-access">{roleParse(resource.user.role, screen)}</span>
                </div>
              </React.Fragment>
            )}
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
      {resource && resource.id ? (
        <Comments postId={resource.id} postComments={resource.comments_count} />
      ) : (
        ''
      )}
    </React.Fragment>
  )
}
