const path = require('path')
const basepath = path.join(__dirname, '..', 'app')

module.exports = {
  service: 'settings',
  fastify: { active: true, port: 3010, prefix: '/api/mailing' },
  rabbitmq: { active: true, server: 'localhost:15672', user: 'dev', password: 'dev123' },
  redis: { active: false, server: 'localhost', port: 16379 },
  swagger: { active: true, exposeRoute: true },
  email: { active: true, server: '', port: 587, secure: false, user: '', password: '', from: 'noreply@cowellness.net', trackingURL: 'https://dev.cowellness.net/api/mailing/tracking' },
  logger: { level: 'debug' },
  basepath,
  mongodb: {
    active: true,
    server: 'localhost',
    port: '',
    user: '',
    password: '',
    debug: true,
    databases: [
      {
        name: 'mail',
        db: 'mails',
        options: {}
      }
    ]
  }
}
