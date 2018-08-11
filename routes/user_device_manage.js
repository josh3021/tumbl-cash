module.exports = app => {

  app.post('/add-device', (req, res) => {
    let deviceCode = req.body.deviceCode
    let deviceName = req.body.deviceName
    
    const database = req.app.get('database')
    database.UserModel.findOne({
      'username': req.session.username
    }, (err, user) => {
      if (err) {
        throw err
      }

      if (!user) {
        console.log('no user')
        return res.json({'res': 400})
      }

      var addDevice = user.addDevice(deviceCode, deviceName)

      if(!addDevice) {
        console.log('duplicated device')
        return res.json({'res': 400})
      }

      user.save(err => {
        if (err) {
          throw err
        }
      })

      return res.json({'res': 200})
    })
  })

  app.post('/remove-device', (req, res) => {
    let deviceCode = req.body.deviceCode
    
    const database = req.app.get('database')
    database.UserModel.findOne({
      'username': req.session.username
    }, (err, user) => {
      if (err) {
        throw err
      }

      if (!user) {
        return res.json({'res': 400})
      }

      var removeDevice = user.removeDevice(deviceCode)

      if(!removeDevice) {
        return res.json({'res': 400})
      }

      user.save(err => {
        if (err) {
          throw err
        }
      })

      return res.json({'res': 200})
    })
  })
}