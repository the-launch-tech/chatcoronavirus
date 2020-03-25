import React from 'react'
import JoditEditor from 'jodit-react'
import AddTopic from './AddTopic'
import TopicCell from './TopicCell'
import RealmCell from './RealmCell'
import joditConfig from '../../helpers/joditConfig'

const { log } = console

export default ({
  item,
  errors,
  handleChange,
  handleCheckboxChange,
  handleFileChange,
  topics,
  newTopics,
  realms,
  edit,
}) => {
  return (
    <React.Fragment>
      <div className="form-row">
        <div className="form-cell w-100">
          <label>
            Article Title <sup>required</sup>
          </label>
          <input
            className="form-input"
            name="title"
            type="text"
            placeholder="Enter a title"
            onChange={handleChange}
            defaultValue={item ? item.title : ''}
          />
          {errors.title && <span className="form-error sm-text">{errors.title}</span>}
        </div>
      </div>
      <div className="form-row">
        <div className="form-cell w-100">
          <label className="form-label">Excerpt</label>
          <JoditEditor
            ref={null}
            value={item.excerpt ? item.excerpt : ''}
            config={joditConfig.excerpt}
            tabIndex={1}
            onBlur={newExcerpt => handleChange({ target: { name: 'excerpt', value: newExcerpt } })}
            onChange={null}
            limitChars={300}
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-cell w-50">
          <label>Featured Image</label>
          <input
            className="form-input"
            name="featured_image"
            type="file"
            onChange={handleFileChange}
          />
          <output id="form-file-output" className="form-file-output"></output>
        </div>
        <div className="form-cell w-50">
          <AddTopic />
        </div>
      </div>
      <div className="form-row">
        <RealmCell
          realms={realms}
          handleCheckboxChange={handleCheckboxChange}
          errors={errors}
          width="w-50"
          defaults={item}
        />
        <TopicCell
          newTopics={newTopics}
          topics={topics}
          handleCheckboxChange={handleCheckboxChange}
          width="w-50"
          defaults={item}
        />
      </div>
      <div className="form-row">
        <div className="form-cell w-100">
          <label className="form-label">
            Article Body <sup>required</sup>
          </label>
          <JoditEditor
            ref={null}
            value={item.content ? item.content : '<p>Enter the body content!</p>'}
            config={joditConfig.content}
            tabIndex={1}
            onBlur={newContent => handleChange({ target: { name: 'content', value: newContent } })}
            onChange={null}
          />
          {errors.content && <span className="form-error sm-text">{errors.content}</span>}
        </div>
      </div>
    </React.Fragment>
  )
}
