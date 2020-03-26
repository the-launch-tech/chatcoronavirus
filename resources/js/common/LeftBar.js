import React from 'react'
import { connect } from 'react-redux'
import UpdateSnippet from './snippets/UpdateSnippet'
import UserSnippet from './snippets/UserSnippet'
import PostSnippet from './snippets/PostSnippet'
import CommentSnippet from './snippets/CommentSnippet'

const { log, error } = console

const mapStateToProps = ({ User, Post, Comment }) => {
  return {
    topUsers: User.topUsers,
    trendingPosts: Post.trendingPosts,
  }
}

export default connect(mapStateToProps)(LeftBar)

function LeftBar({ topUsers, trendingPosts, recentComments, togglePane, pane }) {
  return (
    <div className="left-bar-container">
      <div className={`left-bar-toggle ${pane ? 'active-bar' : ''}`} onClick={togglePane}>
        <i className="fad fa-th-list"></i>
      </div>
      <div className="left-bar-stats">
        <ul className="left-bar-stat-alerts">
          <li className="left-bar-stat-alert w-100">Code</li>
          <li className="left-bar-stat-alert w-50">
            <span className="blue">
              <i className="fal fa-notes-medical"></i> 521,202
            </span>
            <span className="yellow">
              <i className="fal fa-procedures"></i> 383,101
            </span>
          </li>
          <li className="left-bar-stat-alert w-50">
            <span className="red">
              <i className="fal fa-crosshairs"></i> 23,607
            </span>
            <span className="green">
              <i className="fal fa-shield-check"></i> 114,494
            </span>
          </li>
        </ul>
      </div>
      <div className="left-bar-groups">
        <div className="left-bar-group">
          <h5 className="left-bar-group-title">Top Users</h5>
          <div className="left-bar-group-list">
            {topUsers && topUsers.map((user, i) => <UserSnippet key={i} user={user} />)}
          </div>
        </div>
        <div className="left-bar-group">
          <h5 className="left-bar-group-title">Trending Items</h5>
          <div className="left-bar-group-list">
            {trendingPosts && trendingPosts.map((post, i) => <PostSnippet key={i} post={post} />)}
          </div>
        </div>
      </div>
    </div>
  )
}
