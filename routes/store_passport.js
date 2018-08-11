module.exports = (app, passport) => {
  app.get('/store', (req, res) => {
    if(req.session.store)
      res.render('store_index.ejs', {status: 'logined', store: req.session.store})
    else
      res.render('store_index.ejs', {status: 'unlogined'})
  })

  app.get('/store-signin', (req, res) => {
    res.render('store_signin.ejs')
  })

  // login form
  app.post('/store-signin', passport.authenticate('store-login', {
    successRedirect: '/store',
    failureRedirect: '/store-signin',
    failureFlash: false
  }), function(req, res) {
    res.json({store: req.store.store})
  });

    // 회원가임 폼
  app.get('/store-signup', (req, res) => {
    res.render('store_signup.ejs');
  });

    // 회원가임 proc
  app.post('/store-signup', passport.authenticate('store-signup', {
    successRedirect: '/store',
    failureRedirect: '/store-signup',
    failureFlash: false
  }), function(req, res) {
    res.json({store: req.store.store})
  });

    // 로그아웃
  app.get('/store-logout', (req, res) => {
    console.log('/store-logout 패스 요청됨.');
    req.logout();
    req.session.destroy();
    res.json({'res': 200})
  });

};