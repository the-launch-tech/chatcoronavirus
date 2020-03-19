import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import validationArgs from '../../helpers/validationArgs'
import Validator from '../../helpers/validator'
import mapTopics from '../../helpers/mapTopics'
import loader from '../../helpers/loader'
import getUrl from '../../helpers/getUrl'
import * as actions from '../../store/actions'
import defaultCredentials from '../../helpers/defaultCredentials'
import resetFormFields from '../../helpers/resetFormFields'
import PostsService from '../../services/PostsService'
import TopicService from '../../services/TopicService'
import RealmService from '../../services/RealmService'
import ArticleForm from '../../common/forms/ArticleForm'
import ThreadForm from '../../common/forms/ThreadForm'
import ResourceForm from '../../common/forms/ResourceForm'

const { log } = console

const mapStateToProps = ({ Auth, Topic, Realm, Aux }) => {
  return {
    isAuthenticated: Auth.isAuthenticated,
    auth: Auth.auth,
    access: Auth.access,
    topics: Topic.topics,
    newTopics: Topic.newTopics,
    realms: Realm.realms,
  }
}

export default withRouter(connect(mapStateToProps)(EditPost))

function EditPost({
  isAuthenticated,
  topics = [],
  newTopics = [],
  realms = [],
  dispatch,
  auth,
  match,
}) {
  const defCreds = defaultCredentials[match.params.format]
  const validator = new Validator(validationArgs.write[match.params.format])
  let formData = new FormData()
  const [post, setPost] = useState({})
  const [errors, setErrors] = useState({})
  const [credentials, setCredentials] = useState({})
  const [responseError, setResponseError] = useState({
    isError: false,
    code: '',
    text: '',
  })
  const [isSuccess, setIsSuccess] = useState(false)
  const [availableTopics, setAvailableTopics] = useState([])
  const [hasErrors, setHasErrors] = useState(false)

  useEffect(() => {
    if (responseError.isError) {
      dispatch(
        actions.auxSimpleDialog({
          active: true,
          content: '<p>' + responseError.text + '</p>',
        })
      )
    }
  }, [responseError.isError])

  useEffect(() => {
    if (!Object.keys(errors).length) {
      return
    }
    let error = ''
    if (errors.content) {
      error = errors.content
    } else if (errors.realms) {
      error = errors.realms
    } else if (errors.title) {
      error = errors.title
    }
    dispatch(
      actions.auxSimpleDialog({
        active: true,
        content: '<p>' + error + '</p>',
      })
    )
  }, [errors.content, errors.realms, errors.title])

  useEffect(() => {
    if (isSuccess) {
      dispatch(
        actions.auxSimpleDialog({
          active: true,
          content: '<p>Success Updating Post</p>',
        })
      )
      setIsSuccess(false)
    }
  }, [isSuccess])

  useEffect(() => {
    setCredentials(defCreds(post))
  }, [post])

  useEffect(() => {
    RealmService.get(dispatch)
    TopicService.get(dispatch)
    PostsService.getUserPost(auth.id, match.params.format, match.params.slug).then(data => {
      setPost(data.post)
    })
  }, [])

  function handleChange(event) {
    const name = event.target.name
    const value = event.target.value
    credentials[name] = value
    setCredentials(credentials)
    checkErrors()
  }

  function handleCheckboxChange(event) {
    const name = event.target.name
    const value = event.target.value
    if (!credentials[name]) {
      credentials[name] = []
    }
    if (event.target.checked && credentials[name].indexOf(value) < 0) {
      credentials[name].push(value)
    } else if (!event.target.checked) {
      const index = credentials[name].indexOf(value)
      if (index > -1) {
        credentials[name].splice(index, 1)
      }
    }
    setCredentials(credentials)
    checkErrors()
  }

  function handleFileChange(event) {
    const name = event.target.name
    const value = event.target.files[0]
    credentials[name] = value
    setCredentials(credentials)
    const reader = new FileReader()
    reader.onload = function(e) {
      document.getElementById('form-file-output').innerHTML =
        '<img class="form-file-display" src="' + e.target.result + '" />'
    }
    reader.readAsDataURL(value)
  }

  function handleSubmit(event) {
    event.preventDefault()

    Object.keys(credentials).map(key => {
      formData.append(key, credentials[key])
    })

    validator.validateAll(credentials).then(success => {
      if (success) {
        setErrors(validator.errors)
        submit(formData)
      } else {
        setErrors(validator.errors)
      }
    })
  }

  async function submit(formData) {
    loader(dispatch, true)
    try {
      const { message } = await PostsService.update(formData, auth.id, match.params.format, post.id)
      setIsSuccess(true)
      setResponseError({
        isError: false,
        code: '',
        text: '',
      })
      formData = new FormData()
      loader(dispatch, false)
      return message
    } catch (err) {
      setResponseError({
        isError: true,
        code: err.statusCode,
        text: err.error,
      })
      formData = new FormData()
      loader(dispatch, false)
    }
  }

  function destroy() {
    loader(dispatch, true)
    PostsService.delete(auth.id, match.params.format, post.id)
      .then(res => {
        setIsSuccess(true)
        setResponseError({
          isError: false,
          code: '',
          text: '',
        })
        formData = new FormData()
        loader(dispatch, false)
        window.location.href = getUrl('/dashboard/' + auth.id)
      })
      .catch(err => {
        setResponseError({
          isError: true,
          code: err.statusCode,
          text: err.error,
        })
        loader(dispatch, false)
      })
  }

  function checkErrors() {
    validator.validateAll(credentials).then(success => setHasErrors(!success))
  }

  return (
    <div className="form-wrapper">
      <h5 className="form-title">Edit {post && post.title ? post.title : '(pending)'}</h5>
      {post ? (
        <div className="form-content">
          <div className="form-block">
            {match.params.format === 'articles' && (
              <ArticleForm
                errors={errors}
                handleChange={handleChange}
                handleCheckboxChange={handleCheckboxChange}
                handleFileChange={handleFileChange}
                topics={topics}
                newTopics={newTopics}
                realms={realms}
                item={post}
                edit={true}
              />
            )}
            {match.params.format === 'threads' && (
              <ThreadForm
                errors={errors}
                handleChange={handleChange}
                handleCheckboxChange={handleCheckboxChange}
                handleFileChange={handleFileChange}
                topics={topics}
                newTopics={newTopics}
                realms={realms}
                item={post}
                edit={true}
              />
            )}
            {match.params.format === 'resources' && (
              <ResourceForm
                errors={errors}
                handleChange={handleChange}
                handleCheckboxChange={handleCheckboxChange}
                handleFileChange={handleFileChange}
                topics={topics}
                newTopics={newTopics}
                realms={realms}
                item={post}
                edit={true}
              />
            )}
            <div className="form-row">
              <div className="form-cell w-50">
                <button
                  className="form-button md-btn green-btn"
                  onClick={handleSubmit}
                  disabled={hasErrors}
                >
                  Update
                </button>
              </div>
              <div className="form-cell w-50 flex-end-btn">
                <button className="form-button md-btn red-btn" onClick={destroy}>
                  Delete Forever
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="form-content">
          <p>Post is being fetched...</p>
        </div>
      )}
    </div>
  )
}
