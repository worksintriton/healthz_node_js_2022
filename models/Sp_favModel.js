var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema; 

var doctor_favSchema = new mongoose.Schema({  
  user_id : String,
  sp_id : {  
       type: Schema.Types.ObjectId,
       ref: 'vendordetails',
      },
  mobile_type : String,
  cat_id : String,
  delete_status : Boolean,
});
doctor_favSchema.plugin(timestamps);
mongoose.model('sp_fav', doctor_favSchema);
module.exports = mongoose.model('sp_fav');