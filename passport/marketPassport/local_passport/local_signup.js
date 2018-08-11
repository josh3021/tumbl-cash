const LocalStrategy = require('passport-local').Strategy;

module.exports = new LocalStrategy({
  storeField: 'store',
  passwordField: 'password',
  passReqToCallback: true
}, (req, store, password, done) => {

  process.nextTick(() => {
    const database = req.app.get('database');

    database.StoreModel.findOne({
      'store': store
    }, (err, user) => {
      if(err) 
        return done(err);
            
      if(user){
        return done(null, false);
      }

      
      else {

        var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;

        var storeName = new database.StoreModel({
          'store': store,
          'password': password,
          'email': paramEmail,
          'ipAddress': ip
        });
        storeName.save(err => {
          if(err)
            throw err;
          req.session.store = store;

          return done(null, store);    
        })
      }
    })
  });

  
});
