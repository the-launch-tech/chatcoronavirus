import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import * as QueryString from 'query-string'
import validationArgs from '../../helpers/validationArgs'
import Validator from '../../helpers/validator'
import mapAuth from '../../helpers/mapAuth'
import loader from '../../helpers/loader'
import AuthService from '../../services/AuthService'

const { log } = console

export default withRouter(connect(mapAuth)(ResetPassword))

function ResetPassword(props) {
  const params = QueryString.parse(props.location.search)
  const validator = new Validator(validationArgs.resetPassword)
  const [errors, setErrors] = useState({})
  const [credentials, setCredentials] = useState({
    password: '',
    password_confirmation: '',
    token: params.token,
    email: params.email.replace('29gnmLTv686QsnV', '@'),
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
      .dispatch(AuthService.updatePassword(credentials))
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

  if (props.isAuthenticated) {
    return <Redirect to={props.auth ? `/dashboard/${props.auth.id}` : '/'} replace />
  }

  return (
    <div id="page-wrapper" className={`page-wrapper ${props.page}`}>
      <div id="page-content" className={`page-content ${props.page}`}>
        <div className="form-wrapper">
          <h5 className="form-title">Update Password</h5>
          {responseError.isError && (
            <div className="form-notification">
              <p className="form-notification-text notification-failure">{responseError.text}</p>
            </div>
          )}
          {isSuccess && (
            <div className="form-notification">
              <p className="form-notification-text notification-success">
                Your password has been updated!
              </p>
            </div>
          )}
          <div className="form-content">
            <div className="form-block">
              <div className="form-row">
                <div className="form-cell w-100">
                  <label className="form-label">New Password</label>
                  <input
                    className="form-input"
                    name="password"
                    placeholder="New Password"
                    type="password"
                    onChange={handleChange}
                  />
                  {errors.password && <span className="form-error sm-text">{errors.password}</span>}
                </div>
              </div>
              <div className="form-row">
                <div className="form-cell w-100">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    className="form-input"
                    name="password_confirmation"
                    placeholder="Confirm New password"
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
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
