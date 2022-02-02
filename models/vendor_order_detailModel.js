var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema; 

var vendor_order_detailSchema = new mongoose.Schema({  
  user_id : String,
  order_id : String,
  product_data : Array,
  product_quantity : String,
  date_of_booking : String,
  delivery_date : String,
  date_of_booking_display : String,
  delivery_date_display : String,
  order_status : String,
  mobile_type : String,
  delete_status : Boolean,

  prodouct_total : Number,
  shipping_charge : Number,
  discount_price : Number,
  grand_total : Number,



});
vendor_order_detailSchema.plugin(timestamps);
mongoose.model('vendor_order_detail', vendor_order_detailSchema);
module.exports = mongoose.model('vendor_order_detail');