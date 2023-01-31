
const sendSchema = {
  type: 'object',
  required: ['sender', 'name', 'lang'],
  properties: {
    name: { type: 'string', minLength: 1 },
    lang: { type: 'string', minLength: 1, maxLength: 3 },
    sender: {
      type: 'object',
      required: ['to'],
      properties: {
        to: { type: 'array', minItems: 1 }
      }
    },
    data: {
      type: 'object'
    }
  },
  additionalProperties: false
}

module.exports = {
  sendSchema
}
