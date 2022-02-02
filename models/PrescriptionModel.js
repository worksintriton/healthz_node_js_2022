var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema; 
var PrescriptionSchema = new mongoose.Schema({  
  doctor_id : String,  
  Prescription_data : Array,
  Appointment_ID: String,
  Treatment_Done_by: String,
  user_id : String,
  Date: String,
  PDF_format : String,
  Doctor_Comments: String,
  Prescription_img : String,
  Prescription_type : String,
  delete_status : Boolean,
  diagnosis : String,
  sub_diagnosis : String,
  Prescription_id : String,
});
PrescriptionSchema.plugin(timestamps);
mongoose.model('Prescription', PrescriptionSchema);
module.exports = mongoose.model('Prescription');
