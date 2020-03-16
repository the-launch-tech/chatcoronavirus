import Validate from 'validator'

export default {
  register: {
    username: {
      validation: data =>
        Validate.isLength(data, { min: 4, max: 70 }) && Validate.isAlphanumeric(data),
      required: true,
      error: 'Please enter a username (between 4 and 70 alphanumeric characters)!',
    },
    email: {
      validation: Validate.isEmail,
      required: true,
      error: 'Please enter a valid email address!',
    },
    password: {
      validation: data =>
        Validate.isLength(data, { min: 4, max: 70 }) && Validate.isAlphanumeric(data),
      required: true,
      error: 'Please enter a password (between 4 and 70 alphanumeric characters)!',
    },
    password_confirmation: {
      validation: (data, values) => {
        return Validate.isLength(data, { min: 4, max: 70 }) && data === values.password
      },
      required: true,
      error: 'Password confirmation does not match password!',
    },
  },
  login: {
    email: {
      validation: Validate.isEmail,
      required: true,
      error: 'Please enter a valid email address!',
    },
    password: {
      validation: data =>
        Validate.isLength(data, { min: 4, max: 70 }) && Validate.isAlphanumeric(data),
      required: true,
      error: 'Please enter a password (between 4 and 70 alphanumeric characters)!',
    },
  },
  forgotPassword: {
    email: {
      validation: Validate.isEmail,
      required: true,
      error: 'Please enter a valid email address!',
    },
  },
  resetPassword: {
    password: {
      validation: data =>
        Validate.isLength(data, { min: 4, max: 70 }) && Validate.isAlphanumeric(data),
      required: true,
      error: 'Please enter a password (between 4 and 70 alphanumeric characters)!',
    },
    password_confirmation: {
      validation: (data, values) => {
        return Validate.isLength(data, { min: 4, max: 70 }) && data === values.password
      },
      required: true,
      error: 'Password confirmation does not match password!',
    },
    email: {
      validation: () => true,
      required: false,
      error: null,
    },
    token: {
      validation: () => true,
      required: false,
      error: null,
    },
  },
  updateProfile: {
    username: {
      validation: data =>
        Validate.isLength(data, { min: 4, max: 70 }) && Validate.isAlphanumeric(data),
      required: true,
      error: 'Please enter a username (between 4 and 70 alphanumeric characters)!',
    },
    email: {
      validation: Validate.isEmail,
      required: true,
      error: 'Please enter a valid email address!',
    },
    password: {
      validation: data =>
        Validate.isLength(data, { min: 4, max: 70 }) && Validate.isAlphanumeric(data),
      required: true,
      ifExists: true,
      error: 'Please enter a password (between 4 and 70 alphanumeric characters)!',
    },
    password_confirmation: {
      validation: (data, values) => {
        return Validate.isLength(data, { min: 4, max: 70 }) && data === values.password
      },
      required: true,
      ifExists: true,
      error: 'Password confirmation does not match password!',
    },
  },
  write: {
    articles: {
      title: {
        validation: data => Validate.isLength(data, { min: 10, max: 255 }),
        required: true,
        error: 'Please enter a title between 10 and 255 characters!',
      },
      content: {
        validation: data => Validate.isLength(data, { min: 270, max: 100000 }),
        required: true,
        error: 'Body must be at least 100 characters!',
      },
      realms: {
        validation: data => data && data.length > 0,
        required: true,
        error: 'Please select a realm!',
      },
    },
    threads: {
      title: {
        validation: data => Validate.isLength(data, { min: 10, max: 255 }),
        required: true,
        error: 'Please enter a title between 10 and 255 characters!',
      },
      content: {
        validation: data => Validate.isLength(data, { min: 0, max: 1000 }),
        required: true,
        error: 'Body must be at least 100 characters!',
      },
      realms: {
        validation: data => data && data.length > 0,
        required: true,
        error: 'Please select a realm!',
      },
    },
    resources: {
      title: {
        validation: data => Validate.isLength(data, { min: 10, max: 255 }),
        required: true,
        error: 'Please enter a title between 10 and 255 characters!',
      },
      content: {
        validation: data => Validate.isLength(data, { min: 0, max: 1000 }),
        required: true,
        error: 'Body must be at least 100 characters!',
      },
      realms: {
        validation: data => data && data.length > 0,
        required: true,
        error: 'Please select a realm!',
      },
    },
  },
  addTopic: {
    label: {
      validation: data => Validate.isLength(data, { min: 4, max: 255 }),
      required: true,
      error: 'Please enter a label between 4 and 255 characters!',
    },
  },
}
