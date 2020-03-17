import React, { useState, useEffect } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import validationArgs from '../../helpers/validationArgs'
import Validator from '../../helpers/validator'
import mapAuth from '../../helpers/mapAuth'
import loader from '../../helpers/loader'
import AuthService from '../../services/AuthService'

const { log } = console

export default connect(mapAuth)(Register)

function Register(props) {
  const validator = new Validator(validationArgs.register)
  const [errors, setErrors] = useState({})
  const [credentials, setCredentials] = useState({
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
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
      .dispatch(AuthService.register(credentials))
      .then(result => {
        setIsSuccess(true)
        setCredentials({
          username: '',
          email: '',
          password: '',
          password_confirmation: '',
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

  return (
    <div id="page-wrapper" className={`page-wrapper ${props.page}`}>
      <div id="page-content" className={`page-content ${props.page}`}>
        <div className="form-wrapper">
          <h5 className="form-title">Register a new account</h5>
          {responseError.isError && (
            <div className="form-notification">
              <p className="form-notification-text notification-failure">{responseError.text}</p>
            </div>
          )}
          {isSuccess && (
            <div className="form-notification">
              <p className="form-notification-text notification-success">
                Registered Successfully ! <Link to="/login">Login</Link> here
              </p>
            </div>
          )}
          <div className="form-content">
            <div className="form-block">
              <div className="form-row">
                <div className="form-cell">
                  <label className="form-label">Username</label>
                  <input
                    className="form-input"
                    name="username"
                    type="text"
                    placeholder="User Name"
                    onChange={handleChange}
                  />
                  {errors.username && <span className="form-error sm-text">{errors.username}</span>}
                </div>
                <div className="form-cell">
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
                <div className="form-cell">
                  <label className="form-label">Confirm Password</label>
                  <input
                    className="form-input"
                    name="password_confirmation"
                    placeholder="Confirm password"
                    type="password"
                    onChange={handleChange}
                  />
                  {errors.password_confirmation && (
                    <span className="form-error sm-text">{errors.password_confirmation}</span>
                  )}
                </div>
              </div>
              <div className="form-row">
                <div className="form-cell">
                  <button className="form-button md-btn green-btn" onClick={handleSubmit}>
                    Register
                  </button>
                </div>
              </div>
            </div>
          </div>
          <p className="form-message-text">
            Already register ? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
