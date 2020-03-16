import React from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import ArticleExcerpt from './Article'
import ResourceExcerpt from './Resource'
import ThreadExcerpt from './Thread'

const { log, error } = console

export default props => {
  if (props.post.format.slug === 'article') {
    return <ArticleExcerpt {...props} />
  } else if (props.post.format.slug === 'resource') {
    return <ResourceExcerpt {...props} />
  } else if (props.post.format.slug === 'thread') {
    return <ThreadExcerpt {...props} />
  } else {
    return <React.Fragment />
  }
}
