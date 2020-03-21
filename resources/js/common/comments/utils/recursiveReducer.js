const { log, error } = console

function arrayExists(arr) {
  return arr && arr.length > 0
}

export default {
  RENDER: (data, comments, callback) => {
    function recursiveRender(newComments, target, topLevel, layer, found = false) {
      if (topLevel) {
        return [...layer, ...newComments]
      } else {
        for (let i = 0; i < layer.length; i++) {
          if (target === layer[i].id) {
            if (layer[i].children) {
              layer[i].children = [...layer[i].children, ...newComments]
            } else {
              layer[i].children = newComments
            }
          } else if (!found && arrayExists(layer[i].children)) {
            layer[i].children = recursiveRender(
              newComments,
              target,
              false,
              layer[i].children || [],
              found
            )
          }
        }
      }
      return layer
    }

    const mergedComments = recursiveRender(
      data.data.comments,
      data.parent_id,
      data.is_top_level,
      comments,
      false
    )

    return callback(mergedComments)
  },
  SAVE: (data, comments, callback) => {
    function recursiveSave(savedComment, topLevel, layer, found = false) {
      if (topLevel) {
        return [...layer, savedComment]
      } else {
        for (let i = 0; i < layer.length; i++) {
          if (found) {
            return layer
          } else if (savedComment.comment_id === layer[i].id) {
            if (arrayExists(layer[i].children)) {
              layer[i].children = [...layer[i].children, savedComment]
            } else {
              layer[i].children = [savedComment]
            }
            found = true
          } else if (arrayExists(layer[i].children)) {
            layer[i].children = recursiveSave(savedComment, topLevel, layer[i].children, found)
          }
        }
      }
      return layer
    }

    const mergedComments = recursiveSave(data.comment, data.is_top_level, comments, false)

    return callback(mergedComments)
  },
  UPDATE: (data, comments, callback) => {
    function recursiveUpdate(updatedComment, layer, found = false) {
      for (let i = 0; i < layer.length; i++) {
        if (found) {
          return layer
        } else if (updatedComment.id === layer[i].id) {
          layer[i].content = updatedComment.content
          found = true
        } else if (arrayExists(layer[i].children)) {
          layer[i].children = recursiveUpdate(updatedComment, layer[i].children, found)
        }
      }
      return layer
    }

    const mergedComments = recursiveUpdate(data, comments, false)

    return callback(mergedComments)
  },
  DELETE: (data, comments, callback) => {
    function recursiveDelete(deletedId, layer, found = false) {
      for (let i = 0; i < layer.length; i++) {
        if (found) {
          return layer
        } else if (deletedId === layer[i].id) {
          layer.splice(i, 1)
          found = true
        } else if (arrayExists(layer[i].children)) {
          layer[i].children = recursiveDelete(deletedId, layer[i].children, found)
        }
      }
      return layer
    }

    const mergedComments = recursiveDelete(data.id, comments, false)

    return callback(mergedComments)
  },
}
