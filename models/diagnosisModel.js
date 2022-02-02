var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema; 

var diagnosisSchema = new mongoose.Schema({  
  diagnosis:  String,
  date_and_time : String,
  delete_status : Boolean,
});
diagnosisSchema.plugin(timestamps);
mongoose.model('diagnosis', diagnosisSchema);
module.exports = mongoose.model('diagnosis');