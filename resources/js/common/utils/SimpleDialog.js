import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import actions from '../../store/actions'

const { log, error } = console

const mapStateToProps = ({ Aux }) => {
  return {
    simpleDialogArgs: Aux.simpleDialogArgs,
  }
}

export default connect(mapStateToProps)(SimpleDialog)

function SimpleDialog({ dispatch, simpleDialogArgs }) {
  const [content, setContent] = useState(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (simpleDialogArgs) {
      setContent(simpleDialogArgs.content)
      setActive(simpleDialogArgs.active)
    }
  }, [simpleDialogArgs])

  function closeSimpleDialog(event) {
    event.preventDefault()
    dispatch(actions.AUX.toggleSimpleDialog({ active: false, content: null }))
  }

  return (
    <div className={`simple-dialog-overlay ${active ? 'simple-dialog-active' : ''}`}>
      <div className={`simple-dialog ${active ? 'simple-dialog-active' : ''}`}>
        <div className="simple-dialog-content">
          <div className="simple-dialog-body">
            {active && (
              <div
                className="simple-dialog-text"
                dangerouslySetInnerHTML={{ __html: content }}
              ></div>
            )}
          </div>
          <div className="simple-dialog-footer">
            <button className="red-btn tiny-btn" type="button" onClick={closeSimpleDialog}>
              Ok
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
