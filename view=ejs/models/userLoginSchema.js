var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Define User Login Schema
const userLoginSchema = new Schema({
    name: String,
    emailId: String,
    phoneNumber: String,
    password: String,
    type: String,
    role: String,
    userId: { type: String, unique: true },
    Create_at : {
        type : Date,
        default : Date.now
    }
  });

  module.exports = mongoose.model("userLoginSchema", userLoginSchema, "userLoginSchema")