var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema; 

var sub_diagnosisSchema = new mongoose.Schema({  
  diagnosis_id :  {  
       type: Schema.Types.ObjectId,
       ref: 'diagnosis',
      },
  sub_diagnosis : String,
  date_and_time : String,
  delete_status : Boolean,
});
sub_diagnosisSchema.plugin(timestamps);
mongoose.model('sub_diagnosis', sub_diagnosisSchema);
module.exports = mongoose.model('sub_diagnosis');