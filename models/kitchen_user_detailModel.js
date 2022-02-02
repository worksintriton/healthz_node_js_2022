var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema; 
var kitchen_user_detailsSchema = new mongoose.Schema({  
  user_name :  String,
  phone_no : String,
  rest_id : String,
  user_type : Number,
  active_status : Boolean,
  created_by : String,
});
kitchen_user_detailsSchema.plugin(timestamps);
mongoose.model('kitchen_user_details', kitchen_user_detailsSchema);
module.exports = mongoose.model('kitchen_user_details');
