// process.env.NODE_ENV = 'production'
process.env.NODE_ENV = 'development'
const config = require('config')
config.fastify.port = 0
const cw = require('@cowellness/cw-micro-service')(config)
const { smtp } = require('../adapters/mail')()

cw.autoStart().then(async () => {
  smtp.send({
    sender: { to: 'fernando.cowellness@gmail.com' },
    subject: 'prova',
    template: {
      template: 'prova messagio'
    }
  }).then(e => console.log(e)).catch(e => console.log(e))
})
