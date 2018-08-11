module.exports = (app) => {
  app.get('/payment-normal', (req, res) => {
    res.render('payment_normal.ejs')
  })

  app.post('/payment-normal', (req, res) => {
    let deviceCode = req.body.deviceCode
    let price = req.body.price
    let store = req.body.store
    let password = req.body.password
    let menu = req.body.menu

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
            let code = '001'
            reject(code)
          }
          
          resolve(user._doc.store)
        })
      })
    }

    var pointManage = function(deviceCode, price) {
      return new Promise((resolve, reject) => {
        for(let i=0; i<deviceCode.length; i++) {
          database.UserModel.findOne({
            'deviceList.deviceCode': deviceCode[i]
          }, (err, user) => {
            if(err) {
              throw err
            }
  
            if(!user) {
              let code = '003'
              reject(code)
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

    Promise.all([auth(store, password), pointManage(deviceCode, price)]).then((values) => {
      console.log('values[0]: '+values[0]+'value[1]: '+JSON.stringify(values))
      console.log(values[1].username)

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

  })

  app.get('/payment-mileage', (req, res) => {
    res.render('payment_mileage.ejs')
  })

  app.post('/payment-mileage', (req, res) => {
    let deviceCode = req.body.deviceCode
    let price = req.body.price
    let store = req.body.store
    let password = req.body.password
    let menu = req.body.menu

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
            let code = '001'
            reject(code)
          }
          
          resolve(user._doc.store)
        })
      })
    }

    var pointManage = function(deviceCode, price) {
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
  
            if(user.mileage < parseInt(price)) {
              let code = '005'
              reject(code)
            }
            user.mileage = user.mileage - parseInt(price)
            user.save((err) => {
              if (err) {
                throw err
              }
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

    Promise.all([auth(store, password), pointManage(deviceCode, price)]).then((values) => {

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

  })

  app.get('/rent-payment-normal', (req, res) => {
    res.render('rent_payment_normal.ejs')
  })

  app.post('/rent-payment-normal', (req, res) => {
    let deviceCode = req.body.deviceCode
    let username = req.body.username
    let price = req.body.price
    let store = req.body.store
    let password = req.body.password
    let menu = req.body.menu

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

    var pointManage = function(username, price) {
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

          user.mileage = user.mileage + price * 0.02
          user.save((err) => {
            if (err) {
              throw err
            }
          })

          resolve(user.mileage)
        })
      })
    }

    Promise.all([auth(store, password), rentManage(username, deviceCode), pointManage(username, price)]).then((values) => {

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
  })

  app.post('/rent-payment-normal', (req, res) => {
    let deviceCode = req.body.deviceCode
    let username = req.body.username
    let price = req.body.price
    let store = req.body.store
    let password = req.body.password
    let menu = req.body.menu
    let usercode = req.body.usercode

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

    var pointManage = function(username, price) {
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

          if(user.usercode !== usercode) {
            let code = '003'
            reject(code)
          }
          
          if(user.mileage < parseInt(price)) {
            let code = '005'
            reject(code)
          }
          user.mileage = user.mileage - parseInt(price)
          user.save((err) => {
            if (err) {
              throw err
            }
          })

          resolve(user.mileage)
        })
      })
    }

    Promise.all([auth(store, password), rentManage(username, deviceCode), pointManage(username, price)]).then((values) => {

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
  })
}