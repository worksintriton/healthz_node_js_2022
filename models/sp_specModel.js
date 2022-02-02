var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema; 

var sp_spec_Schema = new mongoose.Schema({  
  specialzation:  String,
  date_and_time : String,
  delete_status : Boolean,
});
sp_spec_Schema.plugin(timestamps);
mongoose.model('sp_spec', sp_spec_Schema);
module.exports = mongoose.model('sp_spec');