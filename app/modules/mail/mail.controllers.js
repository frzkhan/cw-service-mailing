const { db, rabbitmq, log } = require('@cowellness/cw-micro-service')()

/**
 * @class MailController
 * @classdesc Controller Mail
 */
class MailController {
  constructor () {
    this.Mail = db.mail.model('Mail')
  }

  findById (id) {
    return this.Mail.findById(id).exec()
  }

  create (obj) {
    return new this.Mail(obj)
  }

  saveMessage (messageToDB, message, queueName) {
    const promise = new Promise(function (resolve, reject) {
      messageToDB.save((err, dbMessage) => {
        if (err) {
          log.info(err)
          resolve({ result: 'failed', id: undefined })
        } else {
          message._id = dbMessage._id.toString()
          return rabbitmq.send(queueName, dbMessage).then((resp) => {
            dbMessage.isQueued = 'sendToQueue'
            return dbMessage.save((err, saveM) => {
              if (err) {
                log.info('Error while saving status change sendToQueue for :' + dbMessage._id.toString())
                resolve({ result: 'failed', id: saveM._id.toString(), errors: err })
              } else {
                resolve({ result: 'ok', id: saveM._id.toString() })
              }
            })
          }).catch((e) => {
            log.info('unable to send email request')
            log.info(e)
            dbMessage.isQueued = 'failedToQueue'
            dbMessage.save((err, saveM) => {
              if (err) {
                log.info('Error while saving status change failedToQueue')
                resolve({ result: 'failed', id: saveM._id.toString(), errors: err })
              } else {
                resolve({ result: 'failed', id: saveM._id.toString(), errors: err })
              }
            })
          })
        }
      })
    })
    return promise
  }

  updateStatus (id, status, message) {
    const p = new Promise((resolve, reject) => {
      this.Mail.findById(id).then((dbMessage) => {
        if (dbMessage) {
          dbMessage.isQueued = status
          dbMessage.save((err, mes) => {
            if (!err) {
              log.info(message)
            }
          })
        }
      })
    })
    return p
  }

  async getTemplate (key, language, data) {
    const subject = await rabbitmq.sendAndRead('/settings/messages/get', { key, language, type: 'email-subject', data })
    const template = await rabbitmq.sendAndRead('/settings/messages/get', { key, language, type: 'email', data })

    return {
      subject,
      template
    }
  }

  async updateEmailStatus (payload, data) {
    const emails = [...payload.sender.to, ...payload.sender.cc]

    rabbitmq.send('/auth/profile/mailing/emailStatus', {
      emails,
      isDeliverable: data.isDeliverable,
      verification: data.verification
    })
  }
}

module.exports = MailController
