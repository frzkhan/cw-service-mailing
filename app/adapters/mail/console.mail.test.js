const config = require('config')

describe('Smtp Mail testing', () => {
  it('Should process html template with params', async () => {
    const testData = {
      sender: {
        to: ['shettyashwin@outlook.com'],
        cc: ['mr.ashwin.shetty@gmail.com']
      },
      templateId: '12345',
      template: {
        subject: 'Its is a subject',
        template: '<html><body><div>Hello ashwin </div></body></html>'
      }
    }
    const consoleMail = require('./console.mail')(config)
    const data = await consoleMail.process(testData, 1234)
    expect(data.template.template.includes('ashwin')).toBe(true)
  })
  it('Should replace url with tracking', async () => {
    const testData = {
      sender: {
        to: ['shettyashwin@outlook.com'],
        cc: ['mr.ashwin.shetty@gmail.com']
      },
      templateId: '12345',
      template: {
        subject: 'Its is a subject',
        template: '<html><body><div>Hello user_name</div><div><a href="http://www.gmail.com"/></div></body></html>'
      }
    }
    const consoleMail = require('./console.mail')(config)
    const data = await consoleMail.process(testData, 1234)
    expect(data.template.template.includes(config.email.trackingURL)).toBe(true)
    expect(data.template.template.includes('/click')).toBe(true)
  })

  it('Should replace pixel image url for read tracking', async () => {
    const testData = {
      sender: {
        to: ['shettyashwin@outlook.com'],
        cc: ['mr.ashwin.shetty@gmail.com']
      },
      templateId: '12345',
      template: {
        subject: 'Its is a subject',
        template: '<html><body><div>Hello user_name</div><div><img src="pixel.png"></img></div></body></html>'
      }
    }
    const consoleMail = require('./console.mail')(config)
    const data = await consoleMail.process(testData, 1234)
    expect(data.template.template.includes(config.email.trackingURL)).toBe(true)
    expect(data.template.template.includes('/read')).toBe(true)
  })
})
