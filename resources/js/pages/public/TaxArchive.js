import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import TermExcerpt from '../../common/excerpts/TermExcerpt'
import TopicService from '../../services/TopicService'
import loader from '../../helpers/loader'
import mapAuth from '../../helpers/mapAuth'

const { log, error } = console

export default withRouter(connect(mapAuth)(TaxArchive))

function TaxArchive({ title, page, dispatch, type, loading }) {
  const [empty, setEmpty] = useState(false)
  const [paged, setPaged] = useState(0)
  const [fresh, setFresh] = useState(true)
  const [terms, setTerms] = useState([])
  const [maxPages, setMaxPages] = useState(-1)

  useEffect(() => {
    getArchive()
  }, [])

  useEffect(() => setEmpty(paged >= maxPages), [paged, maxPages])

  useEffect(() => {
    if (loading) {
      getArchive()
    }
  }, [loading])

  function loadMore() {
    if (!empty) {
      loader(dispatch, true)
    }
  }

  function getArchive() {
    TopicService.getArchive(paged, 100, 'label', { type })
      .then(data => {
        setTerms([...terms, ...data.terms])
        setMaxPages(data.total)
      })
      .then(() => {
        loader(dispatch, false)
        setPaged(paged + 1)
      })
      .catch(err => {
        error(err)
        loader(dispatch, false)
        setEmpty(true)
      })
  }

  return (
    <div id="page-wrapper" className={`page-wrapper ${page}`}>
      <div id="page-content" className={`page-content ${page}`}>
        <h1>{title} Archive</h1>
        <div className="archive-content">
          <div className="archive-list">
            {terms.map((term, i) => (
              <TermExcerpt key={i} term={term} />
            ))}
          </div>
          {!loading && !empty && (
            <button className="load-more-button green-btn md-btn" onClick={loadMore}>
              Load More
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
