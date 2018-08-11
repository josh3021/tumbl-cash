const LocalStrategy = require('passport-local').Strategy;

module.exports = new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, (req, username, password, done) => {
  let paramEmail = req.body.email;
    
  process.nextTick(() => {
    const database = req.app.get('database');

    database.UserModel.findOne({
      'username': 'username'
    }, (err, user) => {
      if(err) 
        return done(err);
            
      if(user){
        res.json({'res': 401})
        return done(null, false, req.flash('signupMessage', '계정이 이미 존재합니다.'));
      }

      else {
        user = new database.UserModel({
          'username': username,
          'password': password,
          'email': paramEmail
        });
        user.save(err => {
          if(err)
            throw err;
          req.session.username = username;
          return done(null, user)    
        });
      }
    })
  });

});