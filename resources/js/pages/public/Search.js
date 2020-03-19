import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import PostExcerpt from '../../common/excerpts/PostExcerpt'
import PostsService from '../../services/PostsService'
import loader from '../../helpers/loader'
import mapAuth from '../../helpers/mapAuth'

const { log, error } = console

export default connect(mapAuth)(Search)

function Search({ title, page, dispatch, loading }) {
  const [fresh, setFresh] = useState(false)
  const [maxPages, setMaxPages] = useState(-1)
  const [empty, setEmpty] = useState(false)
  const [paged, setPaged] = useState(0)
  const [posts, setPosts] = useState([])
  const [advanced, setAdvanced] = useState(false)
  const [values, setValues] = useState({})

  useEffect(() => setEmpty(paged >= maxPages), [paged, maxPages])

  useEffect(() => {
    if (loading) {
      getPosts()
    }
  }, [loading])

  useEffect(() => {
    if (fresh) {
      loader(dispatch, true)
    }
  }, [fresh])

  function toggleAdvancedSearch(event) {
    event.preventDefault()
    setAdvanced(!advanced)
  }

  function handleTextChange(event) {
    const name = event.target.name
    const value = event.target.value
    values[name] = value
    setValues(values)
  }

  function handleSelectChange(event) {
    const name = event.target.name
    const selects = Array.from(event.target.children).filter(child => child.selected)
    values[name] = selects.length ? selects[0].value : null
    setValues(values)
  }

  function handleCheckboxChange(event) {
    const name = event.target.name
    const value = event.target.value
    if (!values[name]) {
      values[name] = []
    }
    values[name].push(value)
    setValues(values)
  }

  function handleSubmit(event) {
    event.preventDefault()
    setFresh(true)
  }

  function getPosts() {
    PostsService.getSearch(fresh ? 0 : paged, 10, values)
      .then(data => {
        if (fresh) {
          setPaged(1)
          setMaxPages(data.total)
          setPosts(data.posts)
        } else {
          setPaged(paged + 1)
          setPosts([...posts, ...data.posts])
        }
      })
      .then(() => {
        loader(dispatch, false)
        setFresh(false)
      })
      .catch(err => {
        loader(dispatch, false)
        setFresh(false)
        setEmpty(true)
        error(err)
      })
  }

  function loadMore(event) {
    event.preventDefault()
    if (!empty) {
      loader(dispatch, true)
    }
  }

  function reset(event) {
    event.preventDefault()
    setValues({})
    const form = document.querySelector('.searchform-wrapper')
    Array.from(form.querySelectorAll('input[type="text"]')).map(input => (input.value = null))
    Array.from(form.querySelectorAll('input[type="number"]')).map(input => (input.value = null))
    Array.from(form.querySelectorAll('input[type="checkbox"]')).map(
      check => (check.checked = false)
    )
    Array.from(form.querySelectorAll('select')).map(select =>
      Array.from(select.children).map(child => (child.selected = false))
    )
  }

  return (
    <div id="page-wrapper" className={`page-wrapper ${page}`}>
      <div id="page-content" className={`page-content ${page}`}>
        <h5 className="form-title">Search</h5>
        <div className="searchform-wrapper">
          <div className="searchform">
            <div className="searchform-input-wrapper">
              <input
                className="searchform-input"
                type="text"
                name="search"
                defaultValue=""
                placeholder="Filter Query"
                onChange={handleTextChange}
              />
            </div>
            <button className="searchform-button md-btn green-btn" onClick={handleSubmit}>
              <i className="fal fa-search"></i>
            </button>
            <button
              className="toggle-advanced-search md-btn blue-btn"
              onClick={toggleAdvancedSearch}
            >
              <i className="fal fa-search-plus"></i>
            </button>
            <button
              className="toggle-advanced-search md-btn red-btn"
              onClick={reset}
              disabled={Object.keys(values).length === 0}
            >
              <i className="fal fa-undo"></i>
            </button>
          </div>
          <div className={`advanced-searchform ${advanced ? 'active' : ''}`}>
            <div className="form-wrapper">
              <div className="form-content">
                <div className="form-block">
                  <div className="form-row">
                    <div className="form-cell w-25">
                      <label>Posted Since</label>
                      <select
                        className="form-input"
                        name="since"
                        defaultValue="-1"
                        onChange={handleSelectChange}
                      >
                        <option value="-1">No Time Constraint</option>
                        <option value="1">Last Hour</option>
                        <option value="24">24 Hours</option>
                        <option value="168">This Week</option>
                        <option value="680">This Month</option>
                      </select>
                    </div>
                    <div className="form-cell w-25">
                      <label>Order By</label>
                      <select
                        className="form-input"
                        name="orderby"
                        defaultValue="relevance"
                        onChange={handleSelectChange}
                      >
                        <option value="relevance">Relevance</option>
                        <option value="created_at">Date Posted</option>
                        <option value="title">Title</option>
                      </select>
                    </div>
                    <div className="form-cell w-25">
                      <label>Order Direction</label>
                      <select
                        className="form-input"
                        name="order"
                        defaultValue="DESC"
                        onChange={handleSelectChange}
                      >
                        <option value="ASC">Ascending</option>
                        <option value="DESC">Descending</option>
                      </select>
                    </div>
                    <div className="form-cell w-25">
                      <label>Relevance Strictness</label>
                      <select
                        className="form-input"
                        name="relevance_cutoff"
                        defaultValue="3"
                        onChange={handleSelectChange}
                      >
                        <option value="0">Lax</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">Strict</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="search-results">
          <div className="search-results-list">
            {posts.map((post, i) => (
              <PostExcerpt key={i} post={post} />
            ))}
          </div>
          {!loading && !empty && posts.length ? (
            <button className="load-more-button md-btn green-btn" onClick={loadMore}>
              <i className="fad fa-spinner"></i> Load More
            </button>
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  )
}
