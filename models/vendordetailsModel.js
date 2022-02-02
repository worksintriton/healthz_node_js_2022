var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema; 

var vendordetailsSchema = new mongoose.Schema({ 
  
  user_id :  String,
  bus_user_name : String,
  bus_user_email : String,
  bussiness_name : String,
  bus_user_phone : String,
  bus_service_list : Array,
  bus_spec_list : Array,
  bus_service_gall : Array,
  bus_profile : String,
  bus_proof : String,
  thumbnail_image : String,
  bus_certif : Array,
  sp_loc : String,
  sp_lat : Number,
  sp_long : Number,
  date_and_time : String,
  mobile_type : String,
  profile_status : Boolean,
  profile_verification_status : String,
  delete_status : Boolean,
  calender_status : Boolean,
  city_name : String,
  comments : Number,
  rating : Number,
  sp_info : String,

});
vendordetailsSchema.plugin(timestamps);
mongoose.model('vendordetails', vendordetailsSchema);
module.exports = mongoose.model('vendordetails');
