import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import validationArgs from '../../helpers/validationArgs'
import Validator from '../../helpers/validator'
import mapTopics from '../../helpers/mapTopics'
import loader from '../../helpers/loader'
import * as actions from '../../store/actions'
import defaultCredentials from '../../helpers/defaultCredentials'
import resetFormFields from '../../helpers/resetFormFields'
import PostsService from '../../services/PostsService'
import TopicService from '../../services/TopicService'
import RealmService from '../../services/RealmService'
import ArticleForm from '../../common/forms/ArticleForm'
import ThreadForm from '../../common/forms/ThreadForm'
import ResourceForm from '../../common/forms/ResourceForm'
import WritePostHeader from '../../common/utils/WritePostHeader'

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

export default withRouter(connect(mapStateToProps)(WritePost))

function WritePost({
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
  const [errors, setErrors] = useState({})
  const [credentials, setCredentials] = useState(defCreds(null))
  const [responseError, setResponseError] = useState({
    isError: false,
    code: '',
    text: '',
  })
  const [isSuccess, setIsSuccess] = useState(false)
  const [availableTopics, setAvailableTopics] = useState([])
  const [hasErrors, setHasErrors] = useState(true)

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
          content: '<p>Success Publishing!</p>',
        })
      )
      setIsSuccess(false)
    }
  }, [isSuccess])

  useEffect(() => {
    RealmService.get(dispatch)
    TopicService.get(dispatch)
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
    credentials[name] = !credentials[name] ? [] : credentials[name]
    const index = credentials[name].indexOf(value)
    if (index > -1 && !event.target.checked) {
      credentials[name].splice(index, 1)
    } else if (event.target.checked) {
      credentials[name].push(value)
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

  function submit(formData) {
    loader(dispatch, true)
    PostsService.save(formData, auth.id, match.params.format)
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
        setResponseError({
          isError: true,
          code: err.statusCode,
          text: err.error,
        })
        formData = new FormData()
        loader(dispatch, false)
        log(err)
      })
  }

  function checkErrors() {
    validator.validateAll(credentials).then(success => setHasErrors(!success))
  }

  return (
    <div className="form-wrapper">
      <WritePostHeader format={match.params.format} />
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
              item={{}}
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
              item={{}}
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
              item={{}}
            />
          )}
          <div className="form-row">
            <div className="form-cell">
              <button
                className="form-button md-btn green-btn"
                onClick={handleSubmit}
                disabled={hasErrors}
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
