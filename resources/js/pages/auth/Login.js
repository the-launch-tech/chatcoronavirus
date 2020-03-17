import React, { useState, useEffect } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import validationArgs from '../../helpers/validationArgs'
import Validator from '../../helpers/validator'
import mapAuth from '../../helpers/mapAuth'
import loader from '../../helpers/loader'
import AuthService from '../../services/AuthService'

const { log } = console

export default connect(mapAuth)(Login)

function Login(props) {
  const validator = new Validator(validationArgs.login)
  const [errors, setErrors] = useState({})
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
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

  if (props.isAuthenticated) {
    return <Redirect to={props.auth ? `/dashboard/${props.auth.id}` : '/'} replace />
  }

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
      .dispatch(AuthService.login(credentials))
      .then(result => {
        setIsSuccess(true)
        setCredentials({
          email: '',
          password: '',
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
          <h5 className="form-title">Login an existing account</h5>
          {responseError.isError && (
            <div className="form-notification">
              <p className="form-notification-text notification-failure">{responseError.text}</p>
            </div>
          )}
          {isSuccess && (
            <div className="form-notification">
              <p className="form-notification-text notification-success">Loggin In!</p>
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
                <div className="form-cell w-100">
                  <label className="form-label">Password</label>
                  <input
                    className="form-input"
                    name="password"
                    placeholder="Password"
                    type="password"
                    onChange={handleChange}
                  />
                  {errors.password && <span className="form-error sm-text">{errors.password}</span>}
                </div>
              </div>
              <div className="form-row">
                <div className="form-cell">
                  <button className="form-button md-btn green-btn" onClick={handleSubmit}>
                    Login
                  </button>
                </div>
              </div>
            </div>
          </div>
          <p className="form-message-text">
            New? <Link to="/register">Register</Link>
          </p>
          <p className="form-message-text">
            <Link to="/forgot-password">Forgot your password?</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
