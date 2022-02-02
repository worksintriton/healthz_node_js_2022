var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema; 
var New_DoctortimeSchema = new mongoose.Schema({  
  
  Doctor_name: String,

  user_id: String,

  Doctor_date_time: Array,

  Doctor_time: Array,

  Update_date : String,

  mobile_type : String,

  delete_status : Boolean,

});
New_DoctortimeSchema.plugin(timestamps);
mongoose.model('New_Doctortime', New_DoctortimeSchema);
module.exports = mongoose.model('New_Doctortime');
