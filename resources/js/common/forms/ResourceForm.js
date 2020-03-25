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
            Resource Title <sup>required</sup>
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
        <RealmCell
          realms={realms}
          handleCheckboxChange={handleCheckboxChange}
          errors={errors}
          width="w-33"
          defaults={item}
        />
        <TopicCell
          newTopics={newTopics}
          topics={topics}
          handleCheckboxChange={handleCheckboxChange}
          width="w-33"
          defaults={item}
        />
        <div className="form-cell w-33">
          <AddTopic />
        </div>
      </div>
      <div className="form-row">
        <div className="form-cell w-100">
          <label className="form-label">
            Resource Details <sup>required</sup>
          </label>
          <JoditEditor
            ref={null}
            value={item.content ? item.content : '<p>Enter the resource details!</p>'}
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
