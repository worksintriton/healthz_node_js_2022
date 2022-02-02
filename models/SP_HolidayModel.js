var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema; 

var SP_HolidaySchema = new mongoose.Schema({  
  user_id : String,
  Date : String,
  mobile_type : String,
  delete_status : Boolean,
});
SP_HolidaySchema.plugin(timestamps);
mongoose.model('SP_Holiday', SP_HolidaySchema);
module.exports = mongoose.model('SP_Holiday');