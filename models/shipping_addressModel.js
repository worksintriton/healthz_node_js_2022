var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema; 

var shippingdetailsSchema = new mongoose.Schema({  
  user_id : String,
  user_first_name :  String,
  user_last_name : String,
  user_flat_no : String,
  user_stree : String,
  user_landmark : String,
  user_picocode : String,
  user_city : String,
  user_state : String,
  user_mobile : String,
  user_alter_mobile : String,
  user_address_stauts : String,
  user_address_type : String,
  user_display_date : String,

});
shippingdetailsSchema.plugin(timestamps);
mongoose.model('shippingdetails', shippingdetailsSchema);
module.exports = mongoose.model('shippingdetails');