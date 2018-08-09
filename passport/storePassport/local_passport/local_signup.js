const LocalStrategy = require('passport-local').Strategy;

module.exports = new LocalStrategy({
  storeField: 'store',
  passwordField: 'password',
  passReqToCallback: true
}, (req, store, password, done) => {
  console.log('config/passport/local-signup 호출됨');
  let paramEmail = req.body.email;

  console.log('store: %s, password: %s, email: %s', store, password, paramEmail);

    
  process.nextTick(() => {
    const database = req.app.get('database');

    database.StoreModel.findOne({
      'store': store
    }, (err, user) => {
      if(err) 
        return done(err);
            
      if(user){
        console.log('계정이 이미 존재함');
        return done(null, false, req.flash('signupMessage', '계정이 이미 존재합니다.'));
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
          console.log('사용자 데이터 데이터베이스에 정상적으로 추가됨');
          req.session.store = store;
          return done(null, store);    
        })
      }
    })
  });

  
});
