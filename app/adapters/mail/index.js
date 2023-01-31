const { factoryConfig } = require('@cowellness/cw-micro-service')()

module.exports = function () {
  const mail = { smtp: undefined }
  mail.smtp = require('./smtp.mail')(factoryConfig)

  return mail
}
