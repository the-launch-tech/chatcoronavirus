import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import loader from '../../helpers/loader'
import validationArgs from '../../helpers/validationArgs'
import Validator from '../../helpers/validator'
import mapAuth from '../../helpers/mapAuth'
import TopicService from '../../services/TopicService'
import resetFormFields from '../../helpers/resetFormFields'

const { log } = console

export default connect(mapAuth)(AddTopic)

function AddTopic({ isAuthenticated, dispatch, auth }) {
  if (!isAuthenticated || parseInt(localStorage.getItem('cc_access')) < 2) {
    return <React.Fragment />
  }

  const validator = new Validator(validationArgs.addTopic)
  const [errors, setErrors] = useState({})
  const [credentials, setCredentials] = useState({
    label: '',
    description: '',
  })
  const [responseError, setResponseError] = useState({
    isError: false,
    code: '',
    text: '',
  })
  const [isSuccess, setIsSuccess] = useState(false)

  function handleChange(event) {
    const name = event.target.name
    const value = event.target.value
    credentials[name] = value
    setCredentials(credentials)
  }

  function handleSubmit(event) {
    event.preventDefault()
    validator.validateAll(credentials).then(success => {
      if (success) {
        setErrors(validator.errors)
        submit(credentials)
      } else {
        setErrors(validator.errors)
      }
    })
  }

  function submit(credentials) {
    loader(dispatch, true)
    TopicService.save(credentials, auth.id, dispatch)
      .then(result => {
        setIsSuccess(true)
        setCredentials({
          label: '',
          description: '',
        })
        setResponseError({
          isError: false,
          code: '',
          text: '',
        })
        validator.reset()
        resetFormFields()
        loader(dispatch, false)
      })
      .catch(({ error, statusCode }) => {
        setResponseError({
          isError: true,
          code: statusCode,
          text: error,
        })
        resetFormFields()
        loader(dispatch, false)
      })
  }

  return (
    <div className="topic-form">
      <h6>Contribute a new topic!</h6>
      <div className="topic-row">
        <label>Topic Label</label>
        <input className="topic-input" name="label" type="text" onChange={handleChange} />
        {errors.label && <span className="topic-error sm-text">{errors.label}</span>}
      </div>
      <div className="topic-row">
        <label>Topic Description</label>
        <input className="topic-input" name="description" type="text" onChange={handleChange} />
      </div>
      <div className="topic-row">
        <button className="sm-btn green-btn topics-submit" onClick={handleSubmit}>
          Save Topic
        </button>
        {isSuccess && (
          <div className="topic-notification">
            <p className="topic-notification-text notification-success">Topic Added!</p>
          </div>
        )}
        {responseError.isError && (
          <div className="topic-notification">
            <p className="topic-notification-text notification-failure">{responseError.text}</p>
          </div>
        )}
      </div>
    </div>
  )
}
