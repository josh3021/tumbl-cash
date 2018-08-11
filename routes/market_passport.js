module.exports = (app, passport) => {
  app.get('/market', (req, res) => {
    if(req.session.store)
      res.render('market_index.ejs', {status: 'logined', market: req.session.market})
    else
      res.render('market_index.ejs', {status: 'unlogined'})
  })

  app.get('/market-signin', (req, res) => {
    res.render('market_signin.ejs')
  })

  // login form
  app.post('/market-signin', passport.authenticate('market-login', {
    failureFlash: false
  }), function(req, res) {
    res.json({store: req.market.store})
  });

    // 회원가임 폼
  app.get('/market-signup', (req, res) => {
    res.render('market_signup.ejs');
  });

    // 회원가임 proc
  app.post('/market-signup', passport.authenticate('market-signup', {
    failureFlash: false
  }), function(req, res) {
    res.json({store: req.market.store})
  });

    // 로그아웃
  app.get('/market-logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.json({'res': 200})
  });

};