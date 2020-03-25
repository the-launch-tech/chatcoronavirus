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
import actions from '../../store/actions'

const { log, error } = console

export default connect(mapAuth)(Profile)

const emailUpdates = [
  { name: 'subscriber_updates', label: 'Subscriber Updates' },
  { name: 'malpractice_updates', label: 'Malpractice Updates' },
  { name: 'pin_updates', label: 'Pin Updates' },
  { name: 'post_cure_updates', label: 'Post Cure Updates' },
  { name: 'comment_cure_updates', label: 'Comment Cure Updates' },
  { name: 'chat_updates', label: 'Chat Updates' },
  { name: 'at_updates', label: '@ Tag Updates' },
]

function Profile(props) {
  const validator = new Validator(validationArgs.updateProfile)
  let formData = new FormData()
  const [errors, setErrors] = useState({})
  const [credentials, setCredentials] = useState({
    email: props.auth ? props.auth.email : '',
    password: '',
    password_confirmation: '',
    country: props.auth ? props.auth.country : '',
    state: props.auth ? props.auth.state : '',
    avatar: props.auth ? props.auth.avatar : '',
    banner: props.auth ? props.auth.banner : '',
    subscriber_updates: props.auth && props.auth.subscriber_updates,
    malpractice_updates: props.auth && props.auth.malpractice_updates,
    pin_updates: props.auth && props.auth.pin_updates,
    post_cure_updates: props.auth && props.auth.post_cure_updates,
    comment_cure_updates: props.auth && props.auth.comment_cure_updates,
    chat_updates: props.auth && props.auth.chat_updates,
    at_updates: props.auth && props.auth.at_updates,
  })
  const [responseError, setResponseError] = useState({
    isError: false,
    code: '',
    text: '',
  })
  const [isSuccess, setIsSuccess] = useState(false)
  const [hasErrors, setHasErrors] = useState(true)

  useEffect(() => {
    props.dispatch(
      actions.AUX.updatePageTitle({
        pageTitle: `Profile`,
        showCurrent: false,
      })
    )
  }, [])

  useEffect(() => {
    if (responseError.isError) {
      dispatch(
        actions.AUX.toggleSimpleDialog({
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
    if (errors.username) {
      error = errors.username
    } else if (errors.email) {
      error = errors.email
    } else if (errors.password) {
      error = errors.password
    } else if (errors.password_confirmation) {
      error = errors.password_confirmation
    }
    dispatch(
      actions.AUX.toggleSimpleDialog({
        active: true,
        content: '<p>' + error + '</p>',
      })
    )
  }, [errors.content, errors.realms, errors.title])

  useEffect(() => {
    if (isSuccess) {
      props.dispatch(
        actions.AUX.toggleSimpleDialog({
          active: true,
          content: '<p>Success Updating Profile!</p>',
        })
      )
      setIsSuccess(false)
    }
  }, [isSuccess])

  function handleChange(event) {
    const name = event.target.name
    const value = event.target.value
    credentials[name] = value
    setCredentials(credentials)
    checkErrors()
  }

  function handleSelectChange(event) {
    const name = event.target.name
    const values = Array.from(event.target.children).filter(child => child.selected)
    credentials[name] = values.length ? values[0].value : null
    setCredentials(credentials)
    checkErrors()
  }

  function handleFileChange(event) {
    const name = event.target.name
    const value = event.target.files[0]
    const parent = event.target.parentElement
    credentials[name] = value
    setCredentials(credentials)
    const reader = new FileReader()
    reader.onload = function(e) {
      parent.querySelector('.form-file-output').innerHTML =
        '<img class="form-file-display" src="' + e.target.result + '" />'
    }
    reader.readAsDataURL(value)
    checkErrors()
  }

  function handleCheckboxChange(event) {
    const name = event.target.name
    const value = event.target.checked ? true : false
    credentials[name] = value
    setCredentials(credentials)
    checkErrors()
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
      .then(data => props.dispatch(actions.AUTH.update(data)))
      .then(result => {
        setIsSuccess(true)
        setResponseError({
          isError: false,
          code: '',
          text: '',
        })
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

  function checkErrors() {
    validator.validateAll(credentials).then(success => setHasErrors(!success))
  }

  return (
    <div className="form-wrapper">
      <h5 className="form-title">Update Your Profile</h5>
      <div className="form-content">
        <div className="form-block">
          <div className="form-row">
            <div className="form-cell w-33">
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
            <div className="form-cell w-33">
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
            <div className="form-cell w-33">
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
            <div className="form-cell w-33">
              <label className="form-label">Avatar</label>
              <input className="form-input" name="avatar" type="file" onChange={handleFileChange} />
              <output id="form-file-output" className="form-file-output"></output>
            </div>
            <div className="form-cell w-33">
              <label className="form-label">Banner</label>
              <input className="form-input" name="banner" type="file" onChange={handleFileChange} />
              <output id="form-file-output" className="form-file-output"></output>
            </div>
            <div className="form-cell w-33">
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
              <button
                className="form-button md-btn green-btn"
                onClick={handleSubmit}
                disabled={hasErrors}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
