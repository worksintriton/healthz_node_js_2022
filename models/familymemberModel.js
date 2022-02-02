var mongoose = require('mongoose');
const Schema = mongoose.Schema;
var timestamps = require('timestamp-mongoose');

var familymemberSchema = new mongoose.Schema({  
  user_id: String,
  name: String,
  gender : String,
  relation_type : String,
  health_issue : String,
  dateofbirth : String,
  anymedicalinfo : String,
  covide_vac : String,
  weight: String,
  pic: Array,
  delete_status : Boolean,
});
familymemberSchema.plugin(timestamps);

mongoose.model('familymember', familymemberSchema);

module.exports = mongoose.model('familymember');