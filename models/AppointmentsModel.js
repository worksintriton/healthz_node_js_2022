var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema; 

var appointmentSchema = new mongoose.Schema({  
  doctor_id : {  
       type: Schema.Types.ObjectId,
       ref: 'userdetails',
      },
  appointment_UID: String,
  booking_date: String,
  booking_time: String,
  booking_date_time : String,
  communication_type : String,
  msg_id : String,
  video_id : String,
  user_id : {  
       type: Schema.Types.ObjectId,
       ref: 'userdetails',
      },
  family_id : {  
       type: Schema.Types.ObjectId,
       ref: 'familymember',
      },

   // pet_record :
   // {  
   //     type: Schema.Types.ObjectId,
   //     ref: 'Payment',
   //    }  
   
  problem_info : String,
  doc_attched : Array,
  appoinment_status : String,
  start_appointment_status : String,
  end_appointment_status : String,
  doc_feedback : String,
  doc_rate : String,

  user_feedback : String,
  user_rate : Number,


  display_date : String,
  server_date_time : String,
  payment_id : String,
  payment_method : String,
  prescription_details : String,
  vaccination_details : String,
  appointment_types : String,
  allergies : String,
  amount : String,
  service_name : String,
  service_amount : String,
  completed_at : String,
  missed_at : String,
  mobile_type : String,
  doc_business_info : Array,
  delete_status : Boolean,
  appoint_patient_st : String,
  date_and_time : String,

  pervious_app_date : String,
  reshedule_status : String,
  location_id : String,
  visit_type : String,

  doctor_comment : String,
  diagnosis : String,
  sub_diagnosis : String,

  health_issue_title : String,

  coupon_status : String,
  coupon_code : String,
  original_price : Number,
  discount_price : Number,
  total_price : Number,


  visibility : String,
  current_img : Array,
  





  
});
appointmentSchema.plugin(timestamps);
mongoose.model('appointment', appointmentSchema);
module.exports = mongoose.model('appointment');