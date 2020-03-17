export default function(comment, arr, found = false) {
  for (let i = 0; i < arr.length; i++) {
    if (comment.id === arr[i].id) {
      arr.splice(i, 1)
      found = true
    } else if (!found && arr[i].recursive_children.length > 0) {
      arr[i].recursive_children = recursiveDelete(comment, arr[i].recursive_children, found)
    }
  }
  return arr
}
