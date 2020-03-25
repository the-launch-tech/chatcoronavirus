import React from 'react'
import dateParse from '../../../helpers/dateParse'
import iconCount from '../../../helpers/iconCount'
import TaxonomyList from '../../utils/TaxonomyList'
import ButtonPin from '../../utils/ButtonPin'
import ButtonCure from '../../utils/ButtonCure'

const { log, error } = console

export default ExcerptFooter

function ExcerptFooter({ post, format }) {
  return (
    <div className="excerpt-footer">
      <div className="excerpt-meta">
        <span className="excerpt-format">{format}</span>
        <div className="excerpt-icons">
          <ButtonPin
            classNames={['excerpt-icon', 'hoverable']}
            itemId={post.id}
            currentPins={post.pins_count}
            type="post"
          />
          <ButtonCure
            classNames={['excerpt-icon', 'hoverable']}
            itemId={post.id}
            currentCures={post.cures_count}
            type="post"
          />
          <span className="excerpt-icon">
            <i className="fal fa-comments"></i> {iconCount(post.comments_count)}
          </span>
        </div>
        <span className="excerpt-created">
          <i className="fal fa-clock"></i> {dateParse(post.created_at)}
        </span>
      </div>
    </div>
  )
}
