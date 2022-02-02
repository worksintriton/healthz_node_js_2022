var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema; 
var New_sptimeSchema = new mongoose.Schema({  
  
  sp_name: String,

  user_id: String,

  sp_date_time: Array,

  sp_time: Array,

  Update_date : String,

  mobile_type : String,

  delete_status : Boolean,

});
New_sptimeSchema.plugin(timestamps);
mongoose.model('New_sptime', New_sptimeSchema);
module.exports = mongoose.model('New_sptime');
