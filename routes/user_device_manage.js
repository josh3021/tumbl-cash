module.exports = app => {
  app.get('/add-device', (req, res) => {
    if(!req.session.username)
      res.render('user_index.ejs', {status: 'unlogined'})
    else
      res.render('user_addDevice.ejs')
  })

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
        return res.json({'res': 400})
      }

      var addDevice = user.addDevice(deviceCode, deviceName)

      if(!addDevice) {
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
  
  app.get('/remove-device', (req, res) => {
    res.render('user_removeDevice.ejs')
  })

  app.post('/remove-device', (req, res) => {
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
        return res.json({'res': 400})
      }

      var removeDevice = user.removeDevice(deviceCode, deviceName)

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