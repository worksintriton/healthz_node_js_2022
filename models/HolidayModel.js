var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema; 

var HolidaySchema = new mongoose.Schema({  
  user_id : String,
  Date : String,
  mobile_type : String,
    delete_status : Boolean,
});
HolidaySchema.plugin(timestamps);
mongoose.model('Holiday', HolidaySchema);
module.exports = mongoose.model('Holiday');