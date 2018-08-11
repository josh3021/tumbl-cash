module.exports = app => {
  app.get('/return', (req, res) => {
    res.render('return.ejs')
  })

  app.post('/return', (req, res) => {
    let deviceCode = req.body.deviceCode
    
    const database = req.app.get('database')

    let isLoaning = function(deviceCode) {
      return new Promise((resolve, reject) => {
        database.OrderModel.findOne({
          'deviceCode': deviceCode,
          'isLoaning': true
        }, (err, user) => {
          if (err) {
            throw err
          }
    
          if(!user) {
            let code = '003'
            reject(code)
          }
    
          user.isLoaning = false
    
          user.save((err) => {
            if(err)
              throw err
          })

          resolve(user._doc.price)
        })
      })
    }
    
    isLoaning(deviceCode).then((price) => {
      database.UserModel.findOne({
        'deviceList.deviceCode': deviceCode
      }, (err, user) => {
        if(err) {
          throw err
        }

        if(!user) {
          let code = '001'
          console.log(code)
        }

        user.mileage = user.mileage + parseInt(price) * 0.04
        user.save((err) => {
          if (err) {
            throw err
          }
          console.log('user mileage: '+user._doc.mileage)
        })

        let userJSON = {
          username: user._doc.username
        }
        userJSON.deviceCode = deviceCode
        userJSON.price = price
        console.log(userJSON)
        res.json({'res': 000})
      })
    }, (code) => {
      return res.json({'res': code})
    })
  })
}