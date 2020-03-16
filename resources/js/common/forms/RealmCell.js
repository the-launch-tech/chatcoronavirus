import React from 'react'

export default function({ realms, handleCheckboxChange, errors, width = 'w-100', defaults }) {
  return (
    <div className={'form-cell ' + width}>
      <label>Content Realms</label>
      <div className="form-checkboxes">
        {realms.length ? (
          realms.map((realm, i) => (
            <div className="form-checkbox" key={i}>
              <input
                className="form-checkbox-input"
                name="realms"
                value={realm.slug}
                type="checkbox"
                defaultChecked={
                  defaults && defaults.realms
                    ? defaults.realms.filter(r => r.slug === realm.slug).length > 0
                    : false
                }
                onChange={handleCheckboxChange}
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
