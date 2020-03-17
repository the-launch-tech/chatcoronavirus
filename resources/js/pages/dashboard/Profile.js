import React, { useState, useEffect } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import countries from '../../helpers/countries'
import validationArgs from '../../helpers/validationArgs'
import Validator from '../../helpers/validator'
import mapAuth from '../../helpers/mapAuth'
import loader from '../../helpers/loader'
import AuthService from '../../services/AuthService'
import DashboardHeader from '../../common/DashboardHeader'
import * as action from '../../store/actions'

const { log, error } = console

export default connect(mapAuth)(Profile)

const emailUpdates = [
  { name: 'subscriber_updates', label: 'Subscriber Updates' },
  { name: 'malpractice_updates', label: 'Malpractice Updates' },
  { name: 'pin_updates', label: 'Pin Updates' },
  { name: 'post_cure_updates', label: 'Post Cure Updates' },
  { name: 'comment_cure_updates', label: 'Comment Cure Updates' },
]

function Profile(props) {
  const validator = new Validator(validationArgs.updateProfile)
  let formData = new FormData()
  const [errors, setErrors] = useState({})
  const [credentials, setCredentials] = useState({
    username: props.auth ? props.auth.username : '',
    email: props.auth ? props.auth.email : '',
    password: '',
    password_confirmation: '',
    country: props.auth ? props.auth.country : '',
    state: props.auth ? props.auth.state : '',
    avatar: props.auth ? props.auth.avatar : '',
    subscriber_updates: props.auth && props.auth.subscriber_updates,
    malpractice_updates: props.auth && props.auth.malpractice_updates,
    pin_updates: props.auth && props.auth.pin_updates,
    post_cure_updates: props.auth && props.auth.post_cure_updates,
    comment_cure_updates: props.auth && props.auth.comment_cure_updates,
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

  function handleSelectChange(event) {
    const name = event.target.name
    const values = Array.from(event.target.children).filter(child => child.selected)
    credentials[name] = values.length ? values[0].value : null
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

  function handleCheckboxChange(event) {
    const name = event.target.name
    const value = event.target.checked ? true : false
    credentials[name] = value
    setCredentials(credentials)
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
    loader(props.dispatch, true)
    AuthService.updateProfile(formData)
      .then(data => props.dispatch(action.authUpdate(data)))
      .then(result => {
        setIsSuccess(true)
        setCredentials({
          username: '',
          email: '',
          password: '',
          password_confirmation: '',
          country: '',
          state: '',
          avatar: '',
          subscriber_updates: false,
          malpractice_updates: false,
          pin_updates: false,
          post_cure_updates: false,
          comment_cure_updates: false,
        })
        setResponseError({
          isError: false,
          code: '',
          text: '',
        })
        validator.reset()
        formData = new FormData()
        loader(props.dispatch, false)
      })
      .catch(({ error, statusCode }) => {
        setResponseError({
          isError: true,
          code: statusCode,
          text: error,
        })
        formData = new FormData()
        loader(props.dispatch, false)
      })
  }

  return (
    <div className="form-wrapper">
      <h5 className="form-title">Update Your Profile</h5>
      {responseError.isError && (
        <div className="form-notification">
          <p className="form-notification-text notification-failure">{responseError.text}</p>
        </div>
      )}
      {isSuccess && (
        <div className="form-notification">
          <p className="form-notification-text notification-success">Profile updated!</p>
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
                defaultValue={props.auth ? props.auth.username : ''}
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
                defaultValue={props.auth ? props.auth.email : ''}
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
              <label className="form-label">Country</label>
              <select
                name="country"
                className="form-input"
                onChange={handleSelectChange}
                defaultValue={props.auth ? props.auth.country : ''}
              >
                <option value={null}></option>
                {countries.map((country, i) => (
                  <option key={i} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-cell">
              <label>State</label>
              <input
                className="form-input"
                name="state"
                type="text"
                placeholder="Enter a state"
                onChange={handleChange}
                defaultValue={props.auth ? props.auth.state : ''}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-cell w-50">
              <label className="form-label">Avatar</label>
              <input className="form-input" name="avatar" type="file" onChange={handleFileChange} />
              <output id="form-file-output" className="form-file-output"></output>
            </div>
            <div className="form-cell w-50">
              <label className="form-label">Email Updates Actions</label>
              <div className="form-checkboxes" style={{ overflow: 'hidden' }}>
                {emailUpdates.map((em, i) => (
                  <div key={i} className="form-checkbox">
                    <input
                      type="checkbox"
                      name={em.name}
                      value="true"
                      onChange={handleCheckboxChange}
                      defaultChecked={props.auth && props.auth[em.name]}
                    />
                    <label>{em.label}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="form-row">
            <div className="form-cell">
              <button className="form-button md-btn green-btn" onClick={handleSubmit}>
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
