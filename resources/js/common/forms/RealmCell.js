import React from 'react'

const { log, error } = console

export default function({ realms, handleCheckboxChange, errors, width = 'w-100', defaults }) {
  return (
    <div className={'form-cell ' + width}>
      <label>
        Content Realms{' '}
        {defaults && defaults.realms
          ? '(Current: ' + defaults.realms.map(realm => realm.label).join(', ') + ')'
          : ''}
      </label>
      <div className="form-checkboxes">
        {defaults && realms.length ? (
          realms.map((realm, i) => (
            <div className="form-checkbox" key={i}>
              <input
                className="form-checkbox-input"
                name="realms"
                value={realm.slug}
                type="checkbox"
                defaultChecked={
                  defaults &&
                  defaults.realms &&
                  defaults.realms.filter(r => r.slug === realm.slug).length > 0
                }
                onClick={handleCheckboxChange}
              />
              <span className="form-checkbox-label">{realm.label}</span>
            </div>
          ))
        ) : (
          <p>Unable to load Realms, please refresh the page.</p>
        )}
      </div>
      {errors.realm && <span className="form-error sm-text">{errors.realm}</span>}
    </div>
  )
}
