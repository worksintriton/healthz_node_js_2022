var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema; 
var petlover_order_groupSchema = new mongoose.Schema({  
  p_vendor_id : String,
  p_order_id : String,
  p_user_id : String,
  p_shipping_address : String,
  p_payment_id : String,
  p_product_details : Array,
  p_order_product_count : Number,
  p_order_price : Number,
  p_order_image : String,
  p_order_image_thumnali : String,
  p_order_booked_on : String,
  p_order_status : String,
  p_order_text : String,
  p_order_status : String,
  p_cancelled_date : String,
  p_completed_date : String,
  p_user_feedback : String,
  p_user_rate : Number,

  coupon_status : String,
  coupon_code : String,
  original_price : Number,
  coupon_discount_price : Number,
  total_price : Number,




});
petlover_order_groupSchema.plugin(timestamps);
mongoose.model('petlover_order_group', petlover_order_groupSchema);
module.exports = mongoose.model('petlover_order_group');