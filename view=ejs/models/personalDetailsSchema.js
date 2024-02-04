var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define Personal Details Schema
const personalDetailsSchema = new Schema({
    userId: String,
    fatherName: String,
    motherName: String,
    street: String,
    area: String,
    city: String,
    state: String,
    country: String,
    pincode: String,
    educationDetails: [
      {
        qualification: String,
        since: Date,
        to: Date,
        percentage: Number,
        completed: Boolean,
      },
    ],
  });
  module.exports = mongoose.model("personalDetailsSchema", personalDetailsSchema, "personalDetailsSchema")