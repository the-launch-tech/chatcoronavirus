export default function(comment, arr, found = false) {
  for (let i = 0; i < arr.length; i++) {
    if (comment.id === arr[i].id) {
      arr[i].content = comment.content
      found = true
    } else if (!found && arr[i].recursive_children.length > 0) {
      arr[i].recursive_children = recursiveUpdate(comment, arr[i].recursive_children, found)
    }
  }
  return arr
}
