const config = require('config')
const cw = require('@cowellness/cw-micro-service')(config)
// let templateid = '123456'

beforeAll(async () => {
  await cw.autoStart()
})

describe('Test mailing services', () => {
  beforeAll(async () => {
    await cw.fastify.inject({
      method: 'POST',
      url: '/api/mailing/templates',
      body: {
        subject: 'Test Email',
        name: 'test-mailing-services',
        lang: 'AM',
        template: '<html><body><div>Hello user_name</div></body></html>',
        isActive: true
      }
    })
  })
  it('Should validate to sender', async () => {
    const resp = await cw.rabbitmq.sendAndRead('/mail/send', {
      sender: {
        to: [],
        cc: ['mr.ashwin.shetty@gmail.com']
      },
      name: 'test-mailing-services',
      lang: 'AM',
      data: { name: 'ashwin' }
    })
    expect(resp.data.errors).toBeDefined()
  })
  it('Should validate to template Id', async () => {
    const resp = await cw.rabbitmq.sendAndRead('/mail/send', {
      sender: {
        to: ['shettyashwin@outlook.com'],
        cc: ['mr.ashwin.shetty@gmail.com']
      },
      name: 'test-mailing-services',
      data: { name: 'ashwin' }
    })
    expect(resp.data.errors).toBeDefined()
  })
  // it('Should get database ID for valid JSON', async () => {
  //   const resp = await cw.rabbitmq.sendAndRead('/mail/send', {
  //     sender: {
  //       to: ['shettyashwin@outlook.com'],
  //       cc: ['mr.ashwin.shetty@gmail.com']
  //     },
  //     name: 'test-mailing-services',
  //     lang: 'AM',
  //     data:  { name : 'ashwin'}
  //   })
  //   expect(resp.data.id).toBeDefined()
  // })
  // it('Should send message for processing for valid JSON', async () => {
  //   return Promise.all([
  //     cw.rabbitmq.consume('/mail/process', (msg) => {
  //       expect(msg.data).toBeDefined()
  //       return true
  //     }),
  //     cw.rabbitmq.sendAndRead('/mail/send', {
  //       sender: {
  //         to: ['shettyashwin@outlook.com'],
  //         cc: ['mr.ashwin.shetty@gmail.com']
  //       },
  //       name: 'test-mailing-services',
  //       lang: 'AM',
  //       data:  { name : 'ashwin'}
  //     })])
  // })
  // it('Should replace template value based on params', async () => {
  //   return Promise.all([
  //     cw.rabbitmq.consume('/mail/process', (msg) => {
  //       expect(msg.data).toBeDefined()
  //       return true
  //     }),
  //     cw.rabbitmq.sendAndRead('/mail/send', {
  //       sender: {
  //         to: ['shettyashwin@outlook.com'],
  //         cc: ['mr.ashwin.shetty@gmail.com']
  //       },
  //       name: 'test-mailing-services',
  //       lang: 'AM',
  //       data:  { name : 'ashwin'}
  //     })])
  // })
})
