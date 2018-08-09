module.exports = (app, passport) => {
  app.get('/', (req, res) => {
    if(!req.session.username)
      return res.render('user_index.ejs', {status: 'unlogined'});
    else
      return res.render('user_index.ejs', {status: 'logined', username: req.session.username})
  })

  app.get('/signin', (req, res) => {
    res.render('user_signin.ejs')
  })

  // login form
  app.post('/signin', passport.authenticate('user-login', {
    successRedirect: '/',
    failureRedirect: '/signin',
    failureFlash: false
  }));

    // 회원가임 폼
  app.get('/signup', (req, res) => {
    res.render('user_signup.ejs');
  });

    // 회원가임 proc
  app.post('/signup', passport.authenticate('user-signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: false
  }));

    // 로그아웃
  app.get('/logout', (req, res) => {
    console.log('/logout 패스 요청됨.');
    req.logout();
    req.session.destroy();
    res.redirect('/');
  });


};