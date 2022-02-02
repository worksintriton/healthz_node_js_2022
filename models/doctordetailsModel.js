var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema; 

var doctordetailsSchema = new mongoose.Schema({  
  user_id  : {  
       type: Schema.Types.ObjectId,
       ref: 'userdetails',
      },
  dr_title : String,
  dr_name : String,
  clinic_name : String,
  clinic_loc : String,
  clinic_lat : Number,
  clinic_long : Number,
  education_details : Array,
  experience_details : Array,
  specialization : Array,
  pet_handled : Array,
  thumbnail_image : String,
  clinic_pic : Array,
  certificate_pic :  Array,
  govt_id_pic : Array,
  photo_id_pic : Array,
  profile_status : Boolean,
  profile_verification_status : String,
  slot_type : String,
  date_and_time : String,
  signature : String,
  mobile_type : String,
  communication_type : String,
  delete_status : Boolean,
  live_status : String,
  business_email : String,
  live_by : String,
  consultancy_fees : Number, 
  calender_status : Boolean,
  comments : Number,
  rating : Number,
  doctor_exp : Number,
  city_name : String,
  doctor_info : String,
  clinic_no : String,
  doctor_id : String,
});
doctordetailsSchema.plugin(timestamps);
mongoose.model('doctordetails', doctordetailsSchema);
module.exports = mongoose.model('doctordetails');