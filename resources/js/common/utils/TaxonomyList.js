import React from 'react'
import { connect } from 'react-redux'
import loader from '../../helpers/loader'
import { Link } from 'react-router-dom'

export default connect()(TaxonomyList)

function TaxonomyList({ classNames, terms, slug, dispatch }) {
  const capitalize = str => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  if (terms && terms.length) {
    return (
      <div className={classNames.wrapper.join(' ')}>
        {capitalize(slug)}:{' '}
        {terms.map((term, t) => (
          <React.Fragment key={t}>
            <Link
              className={classNames.link.join(' ')}
              to={`/${slug}/${term.slug}`}
              onClick={() => loader(dispatch, true)}
            >
              {term.label}
            </Link>
            {t === terms.length - 1 ? '' : ',  '}
          </React.Fragment>
        ))}
      </div>
    )
  } else {
    return <React.Fragment />
  }
}
