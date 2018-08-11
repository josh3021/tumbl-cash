let Schema = {};

Schema.createSchema = mongoose => {
  let OrderSchema = mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: false,
      'default': ''
    },
    deviceCode: {
      type: String,
      required: true,
      unique: false,
      'default': ''
    },
    store: {
      type: String,
      required: true,
      unique: false,
      'default': ''
    },
    menuList: [
      new mongoose.Schema({
        menu: {
          type: String,
          required: true,
          unique: false,
          'default': ''
        }
      })
    ],
    price: {
      type: Number,
      required: true,
      unique: false,
      'default': 0
    },
    isLoaning: {
      type: Boolean,
      required: true,
      unique: false,
      'default': false
    },
    created_at: {
      type: Date,
      unique: false,
      'default': Date.now
    }
  });

  OrderSchema.path('username').validate(username => {
    return username.length;
  }, 'Data of [username] coloumn is NULL');

  OrderSchema.path('store').validate(store => {
    return store.length;
  }, 'Data of [store] coloumn is NULL');

  OrderSchema.static('findByUsername', (username ,callback) => {
    return this.find({
      'username': username
    }, callback);
  });

  OrderSchema.static('findByStore', (store ,callback) => {
    return this.find({
      'store': store
    }, callback);
  });

  console.log('OrderSchema 정의함');

  return OrderSchema;
}

module.exports = Schema;