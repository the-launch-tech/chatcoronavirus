import React, { useState, useEffect } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import validationArgs from '../../helpers/validationArgs'
import Validator from '../../helpers/validator'
import mapAuth from '../../helpers/mapAuth'
import loader from '../../helpers/loader'
import AuthService from '../../services/AuthService'

export default connect(mapAuth)(ForgotPassword)

function ForgotPassword(props) {
  const validator = new Validator(validationArgs.forgotPassword)
  const [errors, setErrors] = useState({})
  const [credentials, setCredentials] = useState({
    email: '',
  })
  const [responseError, setResponseError] = useState({
    isError: false,
    code: '',
    text: '',
  })
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    loader(props.dispatch, false)
  }, [])

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
    loader(props.dispatch, true)
    props
      .dispatch(AuthService.resetLink(credentials))
      .then(result => {
        setIsSuccess(true)
        setCredentials({
          email: '',
        })
        setResponseError({
          isError: false,
          code: '',
          text: '',
        })
        validator.reset()
        loader(props.dispatch, false)
      })
      .catch(({ error, statusCode }) => {
        setResponseError({
          isError: true,
          code: statusCode,
          text: error,
        })
        loader(props.dispatch, false)
      })
  }

  const { from } = props.location.state || { from: { pathname: '/' } }
  const { isAuthenticated } = props

  if (isAuthenticated) {
    return <Redirect to={from} />
  }

  return (
    <div id="page-wrapper" className={`page-wrapper ${props.page}`}>
      <div id="page-content" className={`page-content ${props.page}`}>
        <div className="form-wrapper">
          <h5 className="form-title">Receive Reset Email</h5>
          {responseError.isError && (
            <div className="form-notification">
              <p className="form-notification-text notification-failure">{responseError.text}</p>
            </div>
          )}
          {isSuccess && (
            <div className="form-notification">
              <p className="form-notification-text notification-success">
                If the email you entered exists, a reset link has been sent !
              </p>
            </div>
          )}
          <div className="form-content">
            <div className="form-block">
              <div className="form-row">
                <div className="form-cell w-100">
                  <label>Email</label>
                  <input
                    className="form-input"
                    name="email"
                    type="email"
                    placeholder="E-mail address"
                    onChange={handleChange}
                  />
                  {errors.email && <span className="form-error sm-text">{errors.email}</span>}
                </div>
              </div>
              <div className="form-row">
                <div className="form-cell">
                  <button className="form-button md-btn green-btn" onClick={handleSubmit}>
                    Send Reset Link
                  </button>
                </div>
              </div>
            </div>
          </div>
          <p className="form-message-text">
            New? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
