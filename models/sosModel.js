var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema; 

var SosSchema = new mongoose.Schema({  
  user_id : String,
  sos_detail : Array,
  Date : String,
  mobile_type : String,
  delete_status : Boolean,
});
SosSchema.plugin(timestamps);
mongoose.model('Sos', SosSchema);
module.exports = mongoose.model('Sos');