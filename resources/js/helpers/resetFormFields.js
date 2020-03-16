export default function() {
  const inputs = document.querySelectorAll('.form-wrapper input')
  const selects = document.querySelectorAll('.form-wrapper select')
  const textareas = document.querySelectorAll('.form-wrapper textarea')
  if (inputs) {
    Array.from(inputs).map(input => {
      if (input.type === 'radio' || input.type === 'checkbox') {
        input.checked = false
      } else {
        input.value = ''
      }
    })
  }
  if (selects) {
    Array.from(selects).map(select => {
      Array.from(select.children).map(child => (child.selected = false))
    })
  }
  if (textareas) {
    Array.from(textareas).map(textarea => {
      textarea.value = ''
    })
  }
}
