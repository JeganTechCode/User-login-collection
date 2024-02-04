var mongoose = require( 'mongoose' );

var config   = require("../confurigration/config");

mongoose.connect(config.mongodburi, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log(config.dbName+" Mongo DB Connected")).catch((err) => console.error(err));

  mongoose.connection.on('connected', function () {
  console.log('Mongoose default connection open');
});
mongoose.connection.on('error',function (err) {
  console.log('Mongoose default connection error: ' + err);
});
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected');
});
process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});