let Schema = {};

Schema.createSchema = mongoose => {
  let RentSchema = mongoose.Schema({
    deviceCode: {
      type: String,
      required: true,
      unique: true,
      'default': ''
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
    },
    return_at: {
      type: Date,
      unique: false,
      'default': Date.now
    }
  });

  console.log('RentSchema 정의함');

  return RentSchema;
}

module.exports = Schema;