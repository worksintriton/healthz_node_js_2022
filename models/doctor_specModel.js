var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema; 

var doctor_spec_Schema = new mongoose.Schema({  
  specialzation:  String,
  date_and_time : String,
    delete_status : Boolean,
});
doctor_spec_Schema.plugin(timestamps);
mongoose.model('doctor_spec', doctor_spec_Schema);
module.exports = mongoose.model('doctor_spec');