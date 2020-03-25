import React from 'react'
import { connect } from 'react-redux'
import Article from './excerpts/Article'
import Resource from './excerpts/Resource'
import Thread from './excerpts/Thread'
import Chat from './excerpts/Chat'
import actions from '../../store/actions'
import PostsService from '../../services/PostsService'

const { log, error } = console

export default connect()(PostDelegator)

function PostDelegator(props) {
  function expandPost(event, slug) {
    event.preventDefault()

    props.dispatch(
      actions.AUX.toggleSimpleDialog({
        active: true,
        content:
          '<p>"Chat" is a new feature in development.</p><p>Expanded Twitter-style "Chat" threads coming soon...</p>',
      })
    )

    // PostsService.get({ route: 'EXPANSION', slug })
    //   .then(data => props.dispatch(actions.POST.setExpandedPost(data.post)))
    //   .catch(err => error(err))
  }

  if (props.post.format.slug === 'article') {
    return <Article {...props} />
  } else if (props.post.format.slug === 'resource') {
    return <Resource {...props} />
  } else if (props.post.format.slug === 'thread') {
    return <Thread {...props} />
  } else if (props.post.format.slug === 'chat') {
    return <Chat {...props} expandPost={expandPost} />
  } else {
    return <React.Fragment />
  }
}
