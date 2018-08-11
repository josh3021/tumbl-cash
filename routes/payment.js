module.exports = (app) => {
  app.post('/payment-normal', (req, res) => {
    let deviceCode = req.body.deviceCode
    let price = req.body.price
    let store = req.body.store
    let password = req.body.password
    let menu = req.body.menu

    const database = req.app.get('database')

    user_payment(res, 'pn', database, deviceCode, price, store, password, menu)

  })

  app.post('/payment-mileage', (req, res) => {
    let deviceCode = req.body.deviceCode
    let price = req.body.price
    let store = req.body.store
    let password = req.body.password
    let menu = req.body.menu

    const database = req.app.get('database')
    
    user_payment(res, 'pm', database, deviceCode, price, store, password, menu)
  })

  app.post('/rent-payment-normal', (req, res) => {
    let deviceCode = req.body.deviceCode
    let username = req.body.username
    let price = req.body.price
    let store = req.body.store
    let password = req.body.password
    let menu = req.body.menu

    const database = req.app.get('database')

    rent_process(res, 'rpn', database, deviceCode, username, price, store, password, menu)
  })

  app.post('/rent-payment-mileage', (req, res) => {
    let deviceCode = req.body.deviceCode
    let username = req.body.username
    let price = req.body.price
    let store = req.body.store
    let password = req.body.password
    let menu = req.body.menu

    const database = req.app.get('database')

    rent_process(res, 'rpm', database, deviceCode, username, price, store, password, menu)
  })
}

function user_payment (res, status, database, deviceCode, price, store, password, menu) {

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
          let code = '001'
          reject(code)
        }
        
        resolve(user._doc.store)
      })
    })
  }
  
  var pointManage = function(status, deviceCode, price) {
    return new Promise((resolve, reject) => {
      for(let i=0; i<deviceCode.length; i++) {
        database.UserModel.findOne({
          'deviceList.deviceCode': deviceCode
        }, (err, user) => {
          if(err) {
            throw err
          }
  
          if(!user) {
            let code = '003'
            reject(code)
          }

          switch (status) {
            case 'pn':
              user.mileage = user.mileage + parseInt(price) * 0.02
              break
            
            case 'pm':
              if(user.mileage < parseInt(price)) return reject('004')
              user.mileage = user.mileage - parseInt(price)
              break
          }
  
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
      }
    })
  }
  
  Promise.all([auth(store, password), pointManage(status, deviceCode, price)]).then((values) => {
  
    let newOrder = new database.OrderModel({
      'username': values[1].username,
      'deviceCode': values[1].deviceCode,
      'store': values[0],
      'price': values[1].price,
      'isLoaning': true,
      'menu': menu
    })
  
    newOrder.save((err) => {
      if(err) {
        throw err
      }
  
      return res.json({'res': 000})
    })
  }, (code) => {
    return res.json({'res': code})
  })
}

function rent_process (res, status, database, deviceCode, username, price, store, password, menu) {
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
          let code = '001'
          reject(code)
        }
        
        resolve(user._doc.store)
      })
    })
  }

  var rentManage = function(username, deviceCode) {
    return new Promise((resolve, reject) => {
      for(let i=0; i<deviceCode.length; i++) {
        database.RentModel.findOne({
          'deviceCode': deviceCode
        }, (err, user) => {
          if(err) {
            throw err
          }

          if(!user) {
            let code = '003'
            reject(code)
          }

          if(user.isLoaning) {
            let code='002'
            reject(code)
          }

          user.isLoaning = true
          user.username = username

          user.save(err => {
            if(err) throw err
          })

          resolve(price)
        })
      }
    })
  }

  var pointManage = function(username, price, status) {
    return new Promise((resolve, reject) => {
      database.UserModel.findOne({
        'username': username
      }, (err, user) => {
        if(err) {
          throw err
        }

        if(!user) {
          let code = '004'
          reject(code)
        }

        switch (status) {
          case 'rpn':
            user.mileage = user.mileage + price * 0.02
            break
          
          case 'rpm':
            user.mileage = user.mileage - parseInt(price)
            
        }
        user.save((err) => {
          if (err) {
            throw err
          }
        })

        resolve(user.mileage)
      })
    })
  }

  Promise.all([auth(store, password), rentManage(username, deviceCode), pointManage(username, price, status)]).then((values) => {

    console.log(Object.values(values))
    let newOrder = new database.OrderModel({
      'username': username,
      'deviceCode': deviceCode,
      'store': values[0],
      'price': values[1],
      'isLoaning': true,
      'menu': menu
    })

    newOrder.save((err) => {
      if(err) {
        throw err
      }

      res.json({'res': 000})
    }, (code) => {
      res.json({'res': code})
    })
  })
}