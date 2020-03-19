import React from 'react'

const { log, error } = console

export default function({ newTopics, topics, handleCheckboxChange, width = 'w-100', defaults }) {
  return (
    <div className={'form-cell ' + width}>
      <label>
        Topics{' '}
        {defaults && defaults.topics
          ? '(Current: ' + defaults.topics.map(topic => topic.label).join(', ') + ')'
          : ''}
      </label>
      <div className="form-checkboxes">
        {defaults && [...newTopics, ...topics].length ? (
          [...newTopics, ...topics].map((topic, i) => (
            <div className="form-checkbox" key={i}>
              <input
                className="form-checkbox-input"
                name="topics"
                value={topic.slug}
                type="checkbox"
                defaultChecked={
                  defaults &&
                  defaults.topics &&
                  defaults.topics.filter(t => t.slug === topic.slug).length > 0
                }
                onClick={handleCheckboxChange}
              />
              <span className="form-checkbox-label">{topic.label}</span>
            </div>
          ))
        ) : (
          <p>
            No topics exist yet. <i>Be the first to add one!</i>
          </p>
        )}
      </div>
    </div>
  )
}
