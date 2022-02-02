var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema; 

var doctor_favSchema = new mongoose.Schema({  
  user_id : String,
  doctor_id : String,
  doctor_detail_id : {  
       type: Schema.Types.ObjectId,
       ref: 'doctordetails',
      },
  mobile_type : String,
  delete_status : Boolean,
});
doctor_favSchema.plugin(timestamps);
mongoose.model('doctor_fav', doctor_favSchema);
module.exports = mongoose.model('doctor_fav');