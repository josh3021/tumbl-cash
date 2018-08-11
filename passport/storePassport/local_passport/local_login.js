const LocalStrategy = require('passport-local').Strategy;

module.exports = new LocalStrategy({
  storeField: 'store',
  passwordField: 'password',
  passReqToCallback: true
}, (req, store, password, done) => {

  const database = req.app.get('database');
  database.StoreModel.findOne({
    'store': store
  }, function(err, user){
    if(err)
      return done(err);
    
    if(!user){
      return done(null, false);
    }

    var authenticated = user.authenticated(password, user._doc.salt, user._doc.hashed_password);
    if(!authenticated){
      return done(null, false);
    }

    req.session.store = store;
    return done(null ,user);
  });

});