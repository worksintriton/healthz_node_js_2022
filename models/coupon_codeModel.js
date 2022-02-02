var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema; 

var coupon_codeSchema = new mongoose.Schema({  
  created_by : String,
  expired_date : Date,
  coupon_type : String,
  apply_for : String,
  coupon_cat : String,
  percentage : Number,
  amount : Number,
  code : String,
  user_details : Array,
  title:  String,
  descri: String,


  active_status : Boolean,
  delete_status : Boolean,
});
coupon_codeSchema.plugin(timestamps);
mongoose.model('coupon_code', coupon_codeSchema);
module.exports = mongoose.model('coupon_code');