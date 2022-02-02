var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema; 

var petlover_order_bookingSchema = new mongoose.Schema({  
  user_id : String,
  vendor_id : String,
  order_id : String,
  product_data : Array,
  product_quantity : String,
  date_of_booking : String,
  delivery_date : String,
  date_of_booking_display : String,
  delivery_date_display : String,
  order_status : Array,
  mobile_type : String,
  delete_status : Boolean,
});
petlover_order_bookingSchema.plugin(timestamps);
mongoose.model('petlover_order_booking', petlover_order_bookingSchema);
module.exports = mongoose.model('petlover_order_booking');