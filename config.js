module.exports = {
  dev_port: 8000,
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
  }]
}