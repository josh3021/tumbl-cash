const crypto = require('crypto');

let Schema = {};

Schema.createSchema = mongoose => {
  let StoreSchema = mongoose.Schema({
    store: {
      type: String,
      required: true,
      unique: true,
      'default': ''
    },
    hashed_password: {
      type: String,
      required: true,
      unique: true, 
      'default': ''
    },
    salt: {
      type: String,
      required: true
    },
    ipAddress: {
      type: String,
      required: true,
      unique: true,
      'default': ''
    },
    created_at: {
      type: Date,
      unique: false,
      'default': Date.now
    },
    updated_at: {
      type: Date,
      unique: false,
      'default': Date.now
    }
  });

  StoreSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
    console.log('virtual password 호출됨 : ' + this.hashed_password);
  })
  .get(() => {
    return this._password;
  });

  StoreSchema.method('encryptPassword', function(plainText, inSalt) {
    if (inSalt) {
      return crypto.createHmac('sha256', inSalt).update(plainText).digest('hex');
    } else {
      return crypto.createHmac('sha256', this.salt).update(plainText).digest('hex');
    }
  });

  StoreSchema.method('makeSalt', function() {
    return Math.round((new Date().valueOf() * Math.random())) + '';
  });

  StoreSchema.method('authenticated', function(plainText, inSalt, hashed_password) {
    if (inSalt) {
      console.log('authenticating...: plainText: [%s], inSalt: [%s] --> hashed_password: [%s]', plainText, inSalt, hashed_password);
      return this.encryptPassword(plainText, inSalt) == hashed_password;
    }
    else {
      console.log('authenticating...: plainText: [%s] --> hashed_password: [%s]', plainText, hashed_password);
      return this.encryptPassword(plainText) == hashed_password;
    }
  });

  StoreSchema.path('store').validate(store => {
    return store.length;
  }, 'Data of [store] coloumn is NULL');

  StoreSchema.static('findByStore', (store ,callback) => {
    return this.find({
      'store': store
    }, callback);
  });

  console.log('StoreSchema 정의함');

  return StoreSchema;
}

module.exports = Schema;