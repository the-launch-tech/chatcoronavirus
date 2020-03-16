import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import loader from '../../helpers/loader'
import mapAuth from '../../helpers/mapAuth'

export default connect(mapAuth)(TermExcerpt)

function TermExcerpt({ term, dispatch }) {
  return (
    <article className="term-excerpt">
      <div className="term-excerpt-content">
        <Link
          className="term-excerpt-anchor"
          to={`/topics/${term.slug}`}
          onClick={e => loader(dispatch, true)}
        >
          <h4 className="term-excerpt-title">{term.label}</h4>
        </Link>
        {term.description ? <p className="term-excerpt-description">{term.description}</p> : ''}
      </div>
    </article>
  )
}
