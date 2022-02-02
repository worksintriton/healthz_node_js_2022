var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema; 

var product_vendorSchema = new mongoose.Schema({ 
  user_id :  String,
  user_name : String,
  user_email : String,
  bussiness_name : String,
  bussiness_email : String,
  bussiness : String,
  bussiness_phone : String,
  business_reg : String,
  bussiness_gallery : Array,
  photo_id_proof : String,
  govt_id_proof : String,
  certifi : Array,
  date_and_time : String,
  mobile_type : String,
  profile_status : Boolean,
  profile_verification_status : String,
  bussiness_loc : String,
  bussiness_lat : Number,
  bussiness_long : Number,
  delete_status : Boolean
});
product_vendorSchema.plugin(timestamps);
mongoose.model('product_vendor', product_vendorSchema);
module.exports = mongoose.model('product_vendor');
