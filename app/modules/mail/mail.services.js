const { ctr, rabbitmq, log } = require('@cowellness/cw-micro-service')()
const validationSchema = require('./mail.schema')
const { smtp } = require('../../adapters/mail')()
const queueName = '/mail/process'

rabbitmq.consume('/mail/send', async (msg) => {
  const message = msg.data
  const hasErrors = rabbitmq.validate(validationSchema.sendSchema, message)

  if (hasErrors) {
    return {
      errors: hasErrors,
      result: 'failed'
    }
  }
  try {
    const { subject, template } = await ctr.mail.getTemplate(message.name, message.lang, message.data)
    if (!template.data || !subject.data) {
      return {
        errors: 'Template not found',
        result: 'failed'
      }
    }
    const messageToDB = ctr.mail.create({
      payload: {
        sender: {
          to: message.sender.to,
          cc: message.sender.cc
        },
        template: template.data,
        subject: subject.data
      }
    })
    return await ctr.mail.saveMessage(messageToDB, message, queueName)
  } catch (e) {
    return {
      errors: e.message,
      result: 'failed'
    }
  }
})

rabbitmq.consume(queueName, (msg) => {
  if (msg !== null) {
    msg.data.payload.template = { template: msg.data.payload.template, subject: msg.data.payload.subject }
    smtp.process(msg.data.payload, msg.data._id).then((resp) => {
      smtp.send(resp).catch(async (err) => {
        if (err) {
          log.error('Error sent message')
          log.error(err)
          await ctr.mail.updateStatus(msg.data._id, 'sendingFailed', 'Email Sending Failed Id :' + msg.id)
        }
      }).then((info) => {
        ctr.mail.findById(msg.data._id).then(async (m) => {
          if (m) {
            ctr.mail.updateEmailStatus(m.payload, {
              isDeliverable: true
            })
            await ctr.mail.updateStatus(msg.data._id, 'send', 'Email was send id : ' + msg.data._id)
          }
        })
      })
    })
  }
  return true
})
