import React from 'react'
import { connect } from 'react-redux'
import PostDelegator from './PostDelegator'
import LoadButton from '../utils/LoadButton'
import NoPosts from '../utils/NoPosts'

export default connect(({ Aux }) => {
  return {
    loading: Aux.loading,
  }
})(PostList)

function PostList({ posts = [], loadMore, empty = false, loading }) {
  return (
    <div className="page-list">
      {posts.length ? (
        <div className="page-list-items">
          {posts.map((post, i) => (
            <PostDelegator key={i} post={post} />
          ))}
        </div>
      ) : (
        ''
      )}
      {loading ? <NoPosts text="Fetching posts..." /> : ''}
      {!posts.length && !loading ? <NoPosts text="No Posts..." /> : ''}
      <div className="page-list-base">
        <LoadButton loadMore={loadMore} empty={empty} />
      </div>
    </div>
  )
}
