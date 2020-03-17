import React, { useState } from 'react'
import { withRouter } from 'react-router'
import { NavLink, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import * as actions from '../store/actions'
import loader from '../helpers/loader'
import currentNav from '../helpers/currentNav'
import Http from '../Http'

const { log } = console

const mapStateToProps = ({ Auth, Topic, Realm, Aux }) => {
  return {
    isAuthenticated: Auth.isAuthenticated,
    access: Auth.access,
    auth: Auth.auth,
    topics: Topic.primaryTopics,
    realms: Realm.realms,
    theme: Aux.theme,
  }
}

export default withRouter(connect(mapStateToProps)(Header))

function Header({
  topics,
  realms,
  isAuthenticated,
  access,
  auth,
  dispatch,
  match,
  location,
  desktop,
  theme,
}) {
  const [toggled, setToggled] = useState(false)

  function handleLogout(event) {
    event.preventDefault()
    Http.post('/api/auth/logout')
      .then(res => dispatch(actions.authLogout()))
      .catch(console.error)
  }

  function load(path) {
    if (location.pathname !== path) {
      loader(dispatch, true)
    }
  }

  function toggleNav(event) {
    event.preventDefault()
    setToggled(!toggled)
  }

  return (
    <React.Fragment>
      <div className="logo-margin">
        <span className="logo">{desktop ? 'Chat Coronavirus' : 'CC'}</span>
      </div>
      <nav className="left-nav">
        <div className={`left-nav-toggle ${toggled ? 'toggled-nav' : ''}`} onClick={toggleNav}>
          <i className="fal fa-bars"></i> Menu
        </div>
        <ul className={`nav-menu left-menu ${toggled ? 'toggled-nav' : ''}`}>
          <li className="nav-menu-item">
            <Link
              className={`nav-menu-anchor ${currentNav(location, ['/'], 'green')}`}
              to="/"
              onClick={e => load('/')}
            >
              <i className="fal fa-home-lg-alt"></i> home
            </Link>
          </li>
          <li className="nav-menu-item sub-menu-parent">
            <span
              className={`sub-menu-label ${currentNav(
                location,
                ['/threads', '/articles', '/resources'],
                'green'
              )}`}
            >
              Formats
            </span>
            <ul className="sub-menu">
              <li className="sub-menu-item">
                <Link
                  className={`sub-menu-anchor ${currentNav(location, ['/threads'], 'green')}`}
                  to={`/threads`}
                  onClick={e => load('/threads')}
                >
                  <i className="fal fa-comments-alt"></i> Threads
                </Link>
                <small className="sub-menu-text">
                  Conversational threads on a range of topics.
                </small>
              </li>
              <li className="sub-menu-item">
                <Link
                  className={`sub-menu-anchor ${currentNav(location, ['/articles'], 'green')}`}
                  to={`/articles`}
                  onClick={e => load('/articles')}
                >
                  <i className="fal fa-newspaper"></i> Articles
                </Link>
                <small className="sub-menu-text">Formal and informal blog-like articles.</small>
              </li>
              <li className="sub-menu-item">
                <Link
                  className={`sub-menu-anchor ${currentNav(location, ['/resources'], 'green')}`}
                  to={`/resources`}
                  onClick={e => load('/resources')}
                >
                  <i className="fal fa-file-medical-alt"></i> Resources
                </Link>
                <small className="sub-menu-text">
                  Archival of documents, reports and other multimedia resources.
                </small>
              </li>
            </ul>
          </li>
          <li className="nav-menu-item sub-menu-parent">
            <span
              className={`sub-menu-label ${currentNav(
                location,
                realms.map(realm => `/realms/${realm.slug}`),
                'green'
              )}`}
            >
              Realms
            </span>
            <ul className="sub-menu">
              {realms.map((realm, i) => (
                <li key={i} className="sub-menu-item">
                  <Link
                    className={`sub-menu-anchor ${currentNav(
                      location,
                      [`/realms/${realm.slug}`],
                      'green'
                    )}`}
                    to={`/realms/${realm.slug}`}
                    onClick={e => load(`/realms/${realm.slug}`)}
                  >
                    {realm.label}
                  </Link>
                  <small className="sub-menu-text">{realm.description}</small>
                </li>
              ))}
            </ul>
          </li>
          <li className="nav-menu-item sub-menu-parent">
            <span
              className={`sub-menu-label ${currentNav(
                location,
                topics.map(topic => `/topics/${topic.slug}`),
                'green'
              )}`}
            >
              Topics
            </span>
            <ul className="sub-menu">
              {topics.map((topic, i) => (
                <li key={i} className="sub-menu-item">
                  <Link
                    className={`sub-menu-anchor ${currentNav(
                      location,
                      [`/topics/${topic.slug}`],
                      'green'
                    )}`}
                    to={`/topics/${topic.slug}`}
                    onClick={e => load(`/topics/${topic.slug}`)}
                  >
                    {topic.label}
                  </Link>
                  <small className="sub-menu-text">{topic.description}</small>
                </li>
              ))}
              <li className="sub-menu-item">
                <Link
                  className={`sub-menu-anchor ${currentNav(location, [`/topics`], 'green')}`}
                  to="/topics"
                  onClick={e => load('/topics')}
                >
                  More...
                </Link>
                <small className="sub-menu-text">Other Popular Topics!</small>
              </li>
            </ul>
          </li>
          <li className="nav-menu-item">
            <Link
              className={`nav-menu-anchor ${currentNav(location, ['/search'], 'green')}`}
              to="/search"
              onClick={e => load('/search')}
            >
              Search
            </Link>
          </li>
        </ul>
      </nav>
      <nav className="right-nav">
        <div className="toggleWrapper">
          <input
            type="checkbox"
            className="dn"
            id="dn"
            defaultChecked={theme === 'nighttime' || localStorage.getItem('theme') === 'nighttime'}
            onClick={e => dispatch(actions.auxTheme(theme === 'daytime' ? 'nighttime' : 'daytime'))}
          />
          <label htmlFor="dn" className="toggle">
            <span className="toggle__handler">
              <span className="crater crater--1"></span>
              <span className="crater crater--2"></span>
              <span className="crater crater--3"></span>
            </span>
            <span className="star star--1"></span>
            <span className="star star--2"></span>
            <span className="star star--3"></span>
            <span className="star star--4"></span>
            <span className="star star--5"></span>
            <span className="star star--6"></span>
          </label>
        </div>
        <ul className="nav-menu right-menu">
          {isAuthenticated ? (
            <li className="nav-menu-item sub-menu-parent">
              <span
                className={`sub-menu-label ${currentNav(
                  location,
                  [
                    `/profile/${auth ? auth.username : ''}`,
                    `/dashboard/${auth ? auth.id : ''}`,
                    `/dashboard/${auth ? auth.id : ''}/articles/write`,
                    `/dashboard/${auth ? auth.id : ''}/threads/write`,
                    `/dashboard/${auth ? auth.id : ''}/resources/write`,
                    `/dashboard/${auth ? auth.id : ''}/articles`,
                    `/dashboard/${auth ? auth.id : ''}/threads`,
                    `/dashboard/${auth ? auth.id : ''}/resources`,
                  ],
                  'green'
                )}`}
              >
                {auth ? auth.username : 'Dashboard'}
              </span>
              <ul className="sub-menu" style={{ width: 160 }}>
                <li className="sub-menu-item">
                  <Link
                    className={`sub-menu-anchor nav-white ${currentNav(
                      location,
                      [`/profile/${auth ? auth.username : ''}`],
                      'green'
                    )}`}
                    to={auth ? `/profile/${auth.username}` : '/login'}
                    onClick={e => load(auth ? `/profile/${auth ? auth.username : ''}` : '/login')}
                  >
                    <i className="fal fa-user"></i> User Profile
                  </Link>
                </li>
                <li className="sub-menu-item">
                  <Link
                    className={`sub-menu-anchor nav-white ${currentNav(
                      location,
                      [
                        `/dashboard/${auth ? auth.id : ''}`,
                        `/dashboard/${auth ? auth.id : ''}/articles/write`,
                        `/dashboard/${auth ? auth.id : ''}/threads/write`,
                        `/dashboard/${auth ? auth.id : ''}/resources/write`,
                        `/dashboard/${auth ? auth.id : ''}/articles`,
                        `/dashboard/${auth ? auth.id : ''}/threads`,
                        `/dashboard/${auth ? auth.id : ''}/resources`,
                      ],
                      'green'
                    )}`}
                    to={auth ? `/dashboard/${auth.id}` : '/login'}
                    onClick={e => load(auth ? `/dashboard/${auth ? auth.id : ''}` : '/login')}
                  >
                    <i className="fal fa-user-cog"></i> User Settings
                  </Link>
                </li>
                <li className="sub-menu-item">
                  <a className="sub-menu-anchor nav-white" onClick={handleLogout}>
                    <i className="fal fa-sign-out-alt"></i> Logout
                  </a>
                </li>
              </ul>
            </li>
          ) : (
            <React.Fragment>
              <li className="nav-menu-item login">
                <Link
                  className={`nav-menu-anchor ${currentNav(location, ['/login'], 'red')}`}
                  to="/login"
                  onClick={e => load('/login')}
                >
                  <i className="fal fa-user"></i> Login
                </Link>
              </li>
              <li className="nav-menu-item register">
                <Link
                  className={`nav-menu-anchor ${currentNav(location, ['/register'], 'red')}`}
                  to="/register"
                  onClick={e => load('/register')}
                >
                  <i className="fal fa-sign-in"></i> Register
                </Link>
              </li>
            </React.Fragment>
          )}
          <li className="nav-menu-item">
            <Link
              className={`nav-menu-anchor ${currentNav(location, ['/search'], 'green')}`}
              to="/donate"
              onClick={e => load('/donate')}
            >
              donate
            </Link>
          </li>
        </ul>
      </nav>
    </React.Fragment>
  )
}
