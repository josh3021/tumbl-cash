module.exports = (app) => {
  app.get('/payment-normal', (req, res) => {
    res.render('payment_normal.ejs')
  })

  app.post('/payment-normal', (req, res) => {
    let deviceCode = req.body.deviceCode
    let price = req.body.price
    let store = req.body.store
    let password = req.body.password

    const database = req.app.get('database')

    var auth = function(store, password) {
      return new Promise((resolve, reject) => {
        database.StoreModel.findOne({
          'store': store
        }, (err, user) => {
          if(err) {
            throw err
          }
    
          if(!user) {
            let code = '001'
            reject(code)
          }
    
          var authenticated = user.authenticated(password, user._doc.salt, user._doc.hashed_password)
          if(!authenticated) {
            let code = '002'
            reject(code)
          }
          
          resolve(user._doc.store)
        })
      })
    }

    var pointManage = function(deviceCode, price) {
      return new Promise((resolve, reject) => {
        database.UserModel.findOne({
          'deviceList.deviceCode': deviceCode
        }, (err, user) => {
          if(err) {
            throw err
          }

          if(!user) {
            let code = '001'
            reject(code)
          }

          user.mileage = user.mileage + parseInt(price) * 0.02
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
          resolve(userJSON)
        })
      })
    }

    Promise.all([auth(store, password), pointManage(deviceCode, price)]).then((values) => {
      console.log('values[0]: '+values[0]+'value[1]: '+JSON.stringify(values))
      console.log(values[1].username)

      let newOrder = new database.OrderModel({
        'username': values[1].username,
        'deviceCode': values[1].deviceCode,
        'store': values[0],
        'price': values[1].price
      })

      newOrder.save((err) => {
        if(err) {
          throw err
        }

        console.log('결제 성공');
        return res.redirect('/store')
      })
    })

  })

  app.get('/payment-mileage', (req, res) => {
    res.render('payment_mileage.ejs')
  })

  app.post('/payment-mileage', (req, res) => {
    let deviceCode = req.body.deviceCode
    let price = req.body.price
    let store = req.body.store
    let password = req.body.password

    const database = req.app.get('database')

    var auth = function(store, password) {
      return new Promise((resolve, reject) => {
        database.StoreModel.findOne({
          'store': store
        }, (err, user) => {
          if(err) {
            throw err
          }
    
          if(!user) {
            let code = '001'
            reject(code)
          }
    
          var authenticated = user.authenticated(password, user._doc.salt, user._doc.hashed_password)
          if(!authenticated) {
            let code = '002'
            reject(code)
          }
          
          resolve(user._doc.store)
        })
      })
    }

    var pointManage = function(deviceCode, price) {
      return new Promise((resolve, reject) => {
        database.UserModel.findOne({
          'deviceList.deviceCode': deviceCode
        }, (err, user) => {
          if(err) {
            throw err
          }

          if(!user) {
            let code = '001'
            reject(code)
          }

          user.mileage = user.mileage - parseInt(price)
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
          resolve(userJSON)
        })
      })
    }

    Promise.all([auth(store, password), pointManage(deviceCode, price)]).then((values) => {
      console.log('values[0]: '+values[0]+'value[1]: '+JSON.stringify(values))
      console.log(values[1].username)

      let newOrder = new database.OrderModel({
        'username': values[1].username,
        'deviceCode': values[1].deviceCode,
        'store': values[0],
        'price': values[1].price
      })

      newOrder.save((err) => {
        if(err) {
          throw err
        }

        console.log('결제 성공');
        return res.redirect('/store')
      })
    })

  })


}