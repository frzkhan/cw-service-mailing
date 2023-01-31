const { log } = require('@cowellness/cw-micro-service')()

function clickTracking (obj, config, id) {
  var regex = /href\s*=\s*(['"])(https?:\/\/.+?)\1/ig
  var link
  while ((link = regex.exec(obj.template.template)) !== null) {
    obj.template.template = obj.template.template.replace(link[2], config.email.trackingURL + '/' + id + '/click?redirect_to=' + encodeURIComponent(link[2]))
  }
}

function readTracking (obj, config, id) {
  let imageName = 'pixel.png'
  let key = new RegExp(imageName, 'gi')
  let value = config.email.trackingURL + '/' + id + '/read/' + imageName
  obj.template.template = obj.template.template.replace(key, value)

  imageName = 'pixel.jpg'
  key = new RegExp(imageName, 'gi')
  value = config.email.trackingURL + '/' + id + '/read/' + imageName
  obj.template.template = obj.template.template.replace(key, value)
}

module.exports = function (config) {
  return {
    process: function (obj, id) {
      const p = new Promise((resolve, reject) => {
        clickTracking(obj, config, id)
        readTracking(obj, config, id)
        resolve(obj)
      })
      return p
    },
    send: function (obj) {
      const p = new Promise((resolve, reject) => {
        log.alert('Emails are printed on console')
        log.info(obj)
        resolve(obj)
      })
      return p
    }
  }
}
