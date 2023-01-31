const { log, factoryConfig } = require('@cowellness/cw-micro-service')()
var nodemailer = require('nodemailer')
const querystring = require('querystring')

module.exports = function (config) {
  const consoleMail = require('./console.mail')(factoryConfig)
  var transporter = nodemailer.createTransport({
    host: config.email.server,
    port: config.email.port,
    secure: config.email.secure,
    auth: {
      user: config.email.user,
      pass: config.email.password
    }
  })
  return {
    process: consoleMail.process,
    send: function (obj) {
      return transporter.sendMail({
        from: config.email.from,
        to: obj.sender.to.toString(),
        subject: obj.template.subject,
        html: querystring.unescape(obj.template.template.toString())
      }).then((info) => {
        log.info('sendMail success')
        log.info(info)
        return info
      }).catch(err => {
        log.error('sendMail error')
        log.error(err)
        return Promise.reject(err)
      })
    }
  }
}
