module.exports = app => {
  app.get('/rent-add-device', (req, res) => {
    res.render('rent_addDevice.ejs')
  })

  app.post('/rent-add-device', (req, res) => {
    let deviceCode = req.body.deviceCode

    const database = req.app.get('database')
    let newRentDevice = new database.RentModel({
      'deviceCode': deviceCode,
      'isLoaning': 1
    });

    newRentDevice.save(err => {
      if (err) throw err
    })

    res.json({'res': 200})
  })
}