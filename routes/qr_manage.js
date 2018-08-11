const QRCode = require('qrcode');

module.exports = app => {
  app.get('/qrcode-generator', (req, res) => {
    let deviceCode = req.query.deviceCode

    const database = req.app.get('database')
    database.RentModel.findOne({
      'deviceCode': deviceCode
    }, (err, user) => {
      if(err) throw err

      QRCode.toDataURL("{'deviceCode': "+user.deviceCode+"}", (err, url) => {
        if (err) throw err
  
        res.end("<!DOCTYPE html/><html><head><title>node-qrcode</title></head><body><img src='" + url + "'/></body></html>")
      })
    })
    
  })


}