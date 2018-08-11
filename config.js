module.exports = {
  dev_port: 8080,
  db_url: 'mongodb://localhost:27017/NULL_user',
  db_schemas: [{
    file: './user_schema',
    collection: 'users',
    schemaName: 'UserSchema',
    modelName: 'UserModel'
  }, {
    file: './store_schema',
    collection: 'stores',
    schemaName: 'StoreSchema',
    modelName: 'StoreModel'
  }, {
    file: './order_schema',
    collection: 'orders',
    schemaName: 'OrderSchema',
    modelName: 'OrderModel'
  }, {
    file: './rent_schema',
    collection: 'rents',
    schemaName: 'RentSchema',
    modelName: 'RentModel'
  }],
  passport: [
    './passport/userPassport/passport',
    './passport/storePassport/passport',
    './passport/marketPassport/passport',
    './routes/user_passport',
    './routes/store_passport',
    './routes/market_passport',
  ],
  routes: [
    './routes/user_device_manage',
    './routes/rent_device_manage',
    './routes/payment',
    './routes/return',
    './routes/qr_manage'
  ]
}