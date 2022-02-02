var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema; 
var vendor_order_groupSchema = new mongoose.Schema({  
  v_vendor_id : String,
  v_order_id : String,
  v_user_id : String,
  v_shipping_address : String,
  v_payment_id : String,
  v_product_details : Array,
  v_order_product_count : Number,
  v_order_price : Number,
  v_order_image : String,
  v_order_booked_on : String,
  v_order_status : String,
  v_order_text : String,
  v_order_status : String,
  v_cancelled_date : String,
  v_completed_date : String,
  v_user_feedback : String,
  v_user_rate : Number,
});
vendor_order_groupSchema.plugin(timestamps);
mongoose.model('vendor_order_group', vendor_order_groupSchema);
module.exports = mongoose.model('vendor_order_group');