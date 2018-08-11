const mongoose = require("mongoose");
const config = require("../config");

let database = {};

database.init = (app) => {
  connectDB(app);
}

function connectDB(app){
  const databaseUrl = config.db_url;

  mongoose.connect(databaseUrl);
  mongoose.Promise = global.Promise;
  database = mongoose.connection;
  database.on('error', console.error.bind(console, 'mongoose connection error'));
  database.on('open', () => {
    console.log('database connected successfully');
    createSchema(app, config);
  });
  console.log('connecting to Server AGAIN...')
  database.on('disconnected', connectDB);
}

function createSchema(app, config) {
  app.set('database', database);
  let schemaLen = config.db_schemas.length;
  for(let i=0; i<schemaLen; ++i){
    let curItem = config.db_schemas[i];

    let curSchema = require(curItem.file).createSchema(mongoose);
    let curModel = mongoose.model(curItem.collection, curSchema);

    database[curItem.schemaName] = curSchema;
    database[curItem.modelName] = curModel;
  }
  app.set('database', database);
}

module.exports = database;