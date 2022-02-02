var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema; 

var refund_coupon_codeSchema = new mongoose.Schema({  
  created_by : String,
  coupon_type : String,
  amount : Number,
  code : String,
  user_details : String,
  used_status : String,
  title:  String,
  descri: String,
  mobile_type : String,
  active_status : Boolean,
  delete_status : Boolean,
});
refund_coupon_codeSchema.plugin(timestamps);
mongoose.model('refund_coupon_code', refund_coupon_codeSchema);
module.exports = mongoose.model('refund_coupon_code');