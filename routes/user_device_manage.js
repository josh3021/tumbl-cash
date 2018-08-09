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
        console.log(user+'를 찾을 수 없음')
        res.redirect('/')
      }

      var addDevice = user.addDevice(deviceCode, deviceName)

      if(!addDevice) {
        console.log('deviceCode || deviceName 중복')
      }

      user.save(err => {
        if (err) {
          throw err
        }
        console.log('device added successfully')
        return res.redirect('/')
      })
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
        console.log(user+'를 찾을 수 없음')
        res.redirect('/')
      }

      var removeDevice = user.removeDevice(deviceCode, deviceName)

      if(!removeDevice) {
        console.log('error')
      }

      user.save(err => {
        if (err) {
          throw err
        }
        console.log('device removed successfully')
        return res.redirect('/')
      })
    })
  })
}