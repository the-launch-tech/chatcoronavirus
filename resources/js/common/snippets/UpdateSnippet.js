import React from 'react'
import { Link } from 'react-router-dom'

const { log, error } = console

export default ({ update }) => {
  return (
    <div className="snippet update-snippet">
      <div className="snippet-main-wrapper">
        <a className="snippet-title-anchor update-snippet" href={update.source} target="_blank">
          <h6 className="snippet-title update-snippet">{update.title}</h6>
        </a>
        <p className="snippet-content update-snippet">
          {update.content.length > 50 ? update.content.substr(0, 50) + '...' : update.content}
        </p>
      </div>
    </div>
  )
}
