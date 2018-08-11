const LocalStrategy = require('passport-local').Strategy;

module.exports = new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, (req, username, password, done) => {
  console.log('passport/local_login 호출됨');

  const database = req.app.get('database');
  database.UserModel.findOne({
    'username': username
  }, function(err, user){
    if(err)
      return done(err);
    
    if(!user){
      res.json({'res': 400})
      return done(null, false);
    }

    var authenticated = user.authenticated(password, user._doc.salt, user._doc.hashed_password);
    if(!authenticated){
      res.json({'res': 400});
      return done(null, false);
    }

    req.session.username = username;
    return done(null, user);
  });

});