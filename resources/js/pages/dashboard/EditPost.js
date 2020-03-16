import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import validationArgs from '../../helpers/validationArgs'
import Validator from '../../helpers/Validator'
import mapTopics from '../../helpers/mapTopics'
import loader from '../../helpers/loader'
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
  const [credentials, setCredentials] = useState(defCreds(post))
  const [responseError, setResponseError] = useState({
    isError: false,
    code: '',
    text: '',
  })
  const [isSuccess, setIsSuccess] = useState(false)
  const [availableTopics, setAvailableTopics] = useState([])

  useEffect(() => {
    RealmService.get(dispatch)
    TopicService.get(dispatch)
    PostsService.getUserPost(auth.id, match.params.format, match.params.slug).then(data =>
      setPost(data.post)
    )
  }, [])

  function handleChange(event) {
    const name = event.target.name
    const value = event.target.value
    credentials[name] = value
    setCredentials(credentials)
  }

  function handleCheckboxChange(event) {
    log(event.target.value, event.target.name)
    const name = event.target.name
    const value = event.target.value
    if (!credentials[name]) {
      credentials[name] = []
    }
    credentials[name].push(value)
    setCredentials(credentials)
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
      validator.reset()
      setCredentials(defCreds(post))
      setResponseError({
        isError: false,
        code: '',
        text: '',
      })
      resetFormFields()
      formData = new FormData()
      loader(dispatch, false)
      return message
    } catch (err) {
      validator.reset()
      setCredentials(defCreds(post))
      setResponseError({
        isError: true,
        code: err.statusCode,
        text: err.error,
      })
      resetFormFields()
      formData = new FormData()
      loader(dispatch, false)
    }
  }

  function destroy() {
    loader(dispatch, true)
    PostsService.delete(auth.id, match.params.format, post.id)
      .then(res => {
        setIsSuccess(true)
        validator.reset()
        setCredentials(defCreds(null))
        setResponseError({
          isError: false,
          code: '',
          text: '',
        })
        resetFormFields()
        formData = new FormData()
        loader(dispatch, false)
      })
      .catch(err => {
        validator.reset()
        setCredentials(defCreds(null))
        setResponseError({
          isError: true,
          code: err.statusCode,
          text: err.error,
        })
        loader(dispatch, false)
      })
  }

  return (
    <div className="form-wrapper">
      <h5 className="form-title">Edit {post.title ? post.title : '(pending)'}</h5>
      {responseError.isError && (
        <div className="form-notification">
          <p className="form-notification-text notification-failure">{responseError.text}</p>
        </div>
      )}
      {isSuccess && (
        <div className="form-notification">
          <p className="form-notification-text notification-success">Published!</p>
        </div>
      )}
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
                <button className="form-button md-btn green-btn" onClick={handleSubmit}>
                  Publish
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
