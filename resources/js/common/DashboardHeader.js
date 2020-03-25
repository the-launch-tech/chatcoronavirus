import React from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import loader from '../helpers/loader'
import getUrl from '../helpers/getUrl'
import mapAuth from '../helpers/mapAuth'
import iconCount from '../helpers/iconCount'
import currentNav from '../helpers/currentNav'
import roleParse from '../helpers/roleParse'

export default withRouter(connect(mapAuth)(DashboardHeader))

function DashboardHeader({ auth, dispatch, location, screen }) {
  if (!auth) {
    return <React.Fragment />
  }

  function load(path) {
    if (location.pathname !== path) {
      loader(dispatch, true)
    }
  }

  return (
    <header id="dashboard-header">
      {auth && auth.avatar ? (
        <img
          id="dashboard-user-banner"
          className="dashboard-user-banner"
          src={getUrl('/storage/' + auth.banner)}
          alt={auth.username}
          title={auth.username}
        />
      ) : (
        ''
      )}
      <div className="dashboard-button-row">
        <Link
          className={`dashboard-button sm-btn primary-btn ${currentNav(
            location,
            [`/dashboard/${auth.id}/articles/write`],
            'red'
          )}`}
          to={`/dashboard/${auth.id}/articles/write`}
          onClick={() => load(`/dashboard/${auth.id}/articles/write`)}
        >
          Write Article
        </Link>
        <Link
          className={`dashboard-button sm-btn primary-btn ${currentNav(
            location,
            [`/dashboard/${auth.id}/threads/write`],
            'red'
          )}`}
          to={`/dashboard/${auth.id}/threads/write`}
          onClick={() => load(`/dashboard/${auth.id}/threads/write`)}
        >
          Start Thread
        </Link>
        <Link
          className={`dashboard-button sm-btn primary-btn ${currentNav(
            location,
            [`/dashboard/${auth.id}/resources/write`],
            'red'
          )}`}
          to={`/dashboard/${auth.id}/resources/write`}
          onClick={() => load(`/dashboard/${auth.id}/resources/write`)}
        >
          Add Resource
        </Link>
      </div>
      <div className="dashboard-user">
        <div className="dashboard-user-left">
          {auth && auth.avatar ? (
            <img
              id="dashboard-user-avatar"
              className="dashboard-user-avatar"
              src={getUrl('/storage/' + auth.avatar)}
              alt={auth.username}
              title={auth.username}
            />
          ) : (
            ''
          )}
          <div className="dashboard-user-info">
            <h5 id="dashboard-user-name" className="dashboard-user-name">
              {auth ? auth.username : ''}
            </h5>
            <small className="dashboard-user-level">Level: {roleParse(auth.role, screen)}</small>
          </div>
        </div>
        <div className="dashboard-user-right">
          <div className="dashboard-health_points">
            <i className="fal fa-user-md"></i> {iconCount(auth.health_points)}
          </div>
          <div className="dashboard-contributions">
            <h6 className="dashboard-contributions-title">My Contributions</h6>
            <div className="dashboard-contributions-links">
              <Link
                to={`/dashboard/${auth.id}/articles`}
                className={`dashboard-contrubtion-link ${currentNav(
                  location,
                  [`/dashboard/${auth.id}/articles`],
                  'yellow'
                )}`}
                onClick={() => load(`/dashboard/${auth.id}/articles`)}
              >
                Articles
              </Link>
              <Link
                to={`/dashboard/${auth.id}/threads`}
                className={`dashboard-contrubtion-link ${currentNav(
                  location,
                  [`/dashboard/${auth.id}/threads`],
                  'yellow'
                )}`}
                onClick={() => load(`/dashboard/${auth.id}/threads`)}
              >
                Threads
              </Link>
              <Link
                to={`/dashboard/${auth.id}/resources`}
                className={`dashboard-contrubtion-link ${currentNav(
                  location,
                  [`/dashboard/${auth.id}/resources`],
                  'yellow'
                )}`}
                onClick={() => load(`/dashboard/${auth.id}/resources`)}
              >
                Resources
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
