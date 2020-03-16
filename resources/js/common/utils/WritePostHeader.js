import React from 'react'

export default WritePostHeader

function WritePostHeader({ format }) {
  if (format === 'articles') {
    return (
      <React.Fragment>
        <h5 className="form-title">Write a New Post</h5>
        <p className="form-description">When writing a post the body content is required.</p>
        <p className="form-description">
          You may add a rich excerpt, for instance an embedded Youtube video, or simple text. Max
          length of 300 characters.
        </p>
        <p className="form-description">
          If you don't add a featured image, a default featured image will be randomly selected.
        </p>
      </React.Fragment>
    )
  } else if (format === 'resources') {
    return (
      <React.Fragment>
        <h5 className="form-title">Archive a Resource</h5>
        <p className="form-description">
          When writing a resource, if a youtube video is embedded in the body content it will be
          extracted and used as an excerpt in snippet displays.
        </p>
      </React.Fragment>
    )
  } else if (format === 'threads') {
    return (
      <React.Fragment>
        <h5 className="form-title">Start a New Thread</h5>
        <p className="form-description">
          When starting a thread, if a youtube video is embedded in the body content it will be
          extracted and used as an excerpt in snippet displays.
        </p>
        <p className="form-description">
          The top comments will be previewed in the snippet displays if they exist.
        </p>
      </React.Fragment>
    )
  } else {
    return <React.Fragment />
  }
}
