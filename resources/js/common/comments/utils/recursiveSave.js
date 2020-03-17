export default function(comment, arr, found = false) {
  if (!arr.length || comment.comment_id === null) {
    arr = [...arr, comment]
    found = true
    return arr
  }
  for (let i = 0; i < arr.length; i++) {
    if (comment.comment_id === arr[i].id) {
      arr[i].recursive_children = [...arr[i].recursive_children, comment]
      found = true
    } else if (!found && arr[i].recursive_children.length) {
      arr[i].recursive_children = recursiveSave(comment, arr[i].recursive_children, found)
    }
  }
  return arr
}
