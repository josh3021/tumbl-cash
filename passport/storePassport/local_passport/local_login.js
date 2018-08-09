const LocalStrategy = require('passport-local').Strategy;

module.exports = new LocalStrategy({
  storeField: 'store',
  passwordField: 'password',
  passReqToCallback: true
}, (req, store, password, done) => {
  console.log('passport/local_login 호출됨');

  console.log('store: %s, password: %s', store, password);

  const database = req.app.get('database');
  database.StoreModel.findOne({
    'store': store
  }, function(err, user){
    if(err)
      return done(err);
    
    if(!user){
      console.log('등록된 계정이 없음');
      return done(null, false);
    }

    var authenticated = user.authenticated(password, user._doc.salt, user._doc.hashed_password);
    if(!authenticated){
      console.log('아이디 혹은 비밀번호가 일치하지 않음');
      return done(null, false);
    }

    console.log('계정 확인');
    req.session.store = store;
    return done(null ,user);
  });

});