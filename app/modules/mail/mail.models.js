const { db } = require('@cowellness/cw-micro-service')()

const Schema = db.mail.Schema

/**
 * SCHEMA Mail
 */
const newSchema = new Schema({
  payload: {
    sender: {
      to: { type: [{ type: String, required: true }] },
      cc: { type: [{ type: String }] }
    },
    template: { type: String, required: true },
    subject: { type: String, required: true }
  },
  isRead: { type: Boolean, required: true, default: false },
  isSend: { type: Boolean, required: true, default: false },
  isClicked: { type: Boolean, required: true, default: false },
  isQueued: { type: String, enum: ['addToDb', 'sendToQueue', 'send', 'failedToQueue', 'invalidTemplate', 'sendingFailed'], default: 'addToDb' },
  processing: {
    server: { type: String },
    service: { type: String }
  },
  createdDate: { type: Date, default: Date.now() },
  updatedDate: { type: Date, default: Date.now() }
})
module.exports = db.mail.model('Mail', newSchema)
