const LocalStrategy = require('passport-local').Strategy;

module.exports = new LocalStrategy({
  storeField: 'store',
  passwordField: 'password',
  passReqToCallback: true
}, (req, store, password, done) => {
  let paramEmail = req.body.email;
    
  process.nextTick(() => {
    const database = req.app.get('database');

    database.StoreModel.findOne({
      'store': 'store'
    }, (err, user) => {
      if(err) 
        return done(err);
            
      if(user){
        res.json({'res': 401})
        return done(null, false, req.flash('signupMessage', '계정이 이미 존재합니다.'));
      }

      else {
        user = new database.UserModel({
          'store': store,
          'password': password,
          'email': paramEmail
        });
        user.save(err => {
          if(err)
            throw err;
          req.session.store = store;
          return done(null, user)    
        });
      }
    })
  });

});