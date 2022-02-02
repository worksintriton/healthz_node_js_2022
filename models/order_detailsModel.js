var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema; 

var order_detailSchema = new mongoose.Schema({  
  user_id : String,
  location_id : String,
  order_id:  String,
  order_title : String,
  order_details : Array,
  order_item_count : String,
  order_booked_at : String,
  order_deliver_date : String,
  order_deliver_status : String,
  order_return_date : String,
  order_return_reason : String,
  order_feedback : String,
  order_delivered_id : String,
  order_value: String,
  order_coupon_code: String,
  order_coupon_code_value: String,
  order_final_amount: String,
  delete_status : Boolean,
});
order_detailSchema.plugin(timestamps);
mongoose.model('order_detail', order_detailSchema);
module.exports = mongoose.model('order_detail');