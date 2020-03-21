const { log } = console

export default class Validator {
  constructor(args = {}) {
    this.errors = {}
    this.args = args

    if (Object.keys(this.args)) {
      Object.keys(this.args).map(key => {
        if (this.args[key].required) {
          this.errors[key] = false
        }
      })
    }
  }

  validateAll(values) {
    return new Promise(resolve => {
      const success = Object.keys(this.args).map(key => {
        const validate = () => {
          let valid = this.args[key].validation(values[key], values)
          if (!valid) {
            this.errors[key] = this.args[key].error
          } else {
            this.errors[key] = null
          }
          return valid
        }

        let valid = true
        if (this.args[key].required && this.args[key].ifExists && values[key].length > 0) {
          return validate()
        } else if (this.args[key].required && !this.args[key].ifExists) {
          return validate()
        } else {
          return valid
        }
      })

      resolve(success.filter(Boolean).length === success.length)
    })
  }

  reset() {
    this.errors = {}
  }
}
