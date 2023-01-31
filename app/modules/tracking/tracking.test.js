const config = require('config')
const cw = require('@cowellness/cw-micro-service')(config)
// let requestDetail

beforeAll(async () => {
  return cw.startFastify()
})

afterAll(async () => {
  return cw.stopFastify()
})

describe('Tracking services', () => {
  it('dummy test', async () => {
    expect(1 + 1).toBe(2)
  })
  // beforeAll(async () => {
  //   await cw.fastify.inject({
  //     method: 'POST',
  //     url: '/api/mailing/templates',
  //     body: {
  //       subject: 'Test Email',
  //       name: 'test-mailing-tracking',
  //       lang: 'AM',
  //       template: '<html><body><div>Hello user_name</div></body></html>',
  //       isActive: true
  //     }
  //   })
  //   requestDetail = await cw.rabbitmq.sendAndRead('/mail/send', {
  //     sender: {
  //       to: ['shettyashwin@outlook.com'],
  //       cc: ['mr.ashwin.shetty@gmail.com']
  //     },
  //     name: 'test-mailing-tracking',
  //     lang: 'AM'
  //   })
  // })
  // it('Should load a email request', async () => {
  //   expect(requestDetail).toBeDefined()
  // })
  // it('Should mark request read', async () => {
  //   const res = await cw.fastify.inject({
  //     method: 'GET',
  //     url: '/api/mailing/tracking/' + requestDetail.data.id + '/read'
  //   })
  //   const responseData = res.json()
  //   expect(responseData.success).toBe(true)
  //   expect(responseData.data).toBe(true)
  // })
  // it('Should mark request click and redirect url', async () => {
  //   const res = await cw.fastify.inject({
  //     method: 'GET',
  //     url: '/api/mailing/tracking/' + requestDetail.data.id + '/click'
  //   })
  //   const responseData = res
  //   expect(responseData.statusCode).toBe(302)
  // })
})
