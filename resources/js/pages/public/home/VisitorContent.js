import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

export default connect(({ Auth }) => {
  return {
    isAuthenticated: Auth.isAuthenticated,
  }
})(VisitorContent)

function VisitorContent({ isAuthenticated }) {
  if (isAuthenticated) {
    return <React.Fragment />
  }

  return (
    <div className="home-intro">
      <ul className="home-features">
        <li className="home-feature">
          <h6 className="home-feature-title">Write Articles</h6>
        </li>
        <li className="home-feature">
          <h6 className="home-feature-title">Create Threads</h6>
        </li>
        <li className="home-feature">
          <h6 className="home-feature-title">Archive Resources</h6>
        </li>
        <li className="home-feature">
          <h6 className="home-feature-title">Talk With Others in Threads and Comment Sections</h6>
        </li>
        <li className="home-feature">
          <h6 className="home-feature-title">Repost Your Favorite Posts</h6>
        </li>
        <li className="home-feature">
          <h6 className="home-feature-title">Curate Your Personal Timeline</h6>
        </li>
        <li className="home-feature">
          <h6 className="home-feature-title">Gain "Health Points" And Become a Reputable User</h6>
        </li>
        <li className="home-feature">
          <h6 className="home-feature-title">
            Subscribe and Follow Other Users and Conversations to Stay Informed
          </h6>
        </li>
        <li className="home-feature">
          <h6 className="home-feature-title">Help The Community Grow!</h6>
        </li>
        <li className="home-feature">
          <h6 className="home-feature-title">Spread Useful Information and Experiences...</h6>
        </li>
      </ul>
      <div className="home-links">
        <Link className="home-link md-btn green-btn" to="/register">
          Register <i className="fal fa-sign-in"></i>
        </Link>
        <Link className="home-link md-btn green-btn" to="/login">
          Login <i className="fal fa-user"></i>
        </Link>
      </div>
    </div>
  )
}
