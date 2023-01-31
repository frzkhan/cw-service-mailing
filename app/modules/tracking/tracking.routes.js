const { ctr } = require('@cowellness/cw-micro-service')()

module.exports = async function (fastify, opts, done) {
  fastify.get('/:id/read', function (request, reply) {
    ctr.mail.findById(request.params.id).then((t) => {
      if (!t) {
        reply.cwsendFail({
          message: 'Record not found',
          _message: null
        })
      }
      t.isRead = true
      t.save((error, tresult) => {
        if (!error) {
          ctr.mail.updateEmailStatus(t.payload, {
            verification: 'checked'
          })
          reply.cwsendSuccess({ data: true })
        }
      })
    })
  })

  fastify.get('/:id/click', function (request, reply) {
    ctr.mail.findById(request.params.id).then((t) => {
      if (!t) {
        reply.cwsendFail({
          message: 'Record not found',
          _message: null
        })
      }
      t.isClicked = true
      t.save((error, tresult) => {
        if (!error) {
          reply.redirect(decodeURIComponent(request.url.substring(request.url.indexOf('?redirect_to') + 13)))
        }
      })
    })
  })
}
