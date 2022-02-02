var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema; 

var sp_appointmentSchema = new mongoose.Schema({  
  sp_id : {  
       type: Schema.Types.ObjectId,
       ref: 'userdetails',
      },
  appointment_UID: String,
  booking_date: String,
  booking_time: String,
  booking_date_time : String,
  user_id : {  
       type: Schema.Types.ObjectId,
       ref: 'userdetails',
      },
  family_id : {  
       type: Schema.Types.ObjectId,
       ref: 'familymember',
    },
  additional_info : String,
  sp_attched : Array,
  appoinment_status : String,
  start_appointment_status : String,
  end_appointment_status : String,
  sp_feedback : String,
  sp_rate : Number,
  user_feedback : String,
  user_rate : String,
  display_date : String,
  server_date_time : String,
  payment_id : String,
  payment_method : String,
  service_name : String,
  service_amount : String,
  service_time : String,
  completed_at : String,
  missed_at : String,
  mobile_type : String,
  sp_business_info : Array,
  delete_status : Boolean,
  date_and_time : String,


  coupon_status : String,
  coupon_code : String,
  original_price : Number,
  discount_price : Number,
  total_price : Number,
  current_img : Array,


});
sp_appointmentSchema.plugin(timestamps);
mongoose.model('sp_appointment', sp_appointmentSchema);
module.exports = mongoose.model('sp_appointment');