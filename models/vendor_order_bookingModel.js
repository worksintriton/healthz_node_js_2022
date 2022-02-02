var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema; 

var product_order_bookingSchema = new mongoose.Schema({ 

  user_id : String,
  order_id : String,
  vendor_id : String,
  product_id : String,
  product_data : Array,
  product_quantity : Number,
  prodcut_track_details : Array,
  date_of_booking : String,
  delivery_date : String,
  date_of_booking_display : String,
  delivery_date_display : String,
  order_status : String,
  mobile_type : String,
  prodouct_total : Number,
  shipping_address_id : String,
  billling_address_id : String,
  shipping_address : String,
  billing_address : String,
  shipping_charge : Number,
  discount_price : Number,
  grand_total : Number,
  delete_status : Boolean,
  over_all_total : Number,
  coupon_code : String,
  user_cancell_info : String,
  user_cancell_date : String,
  user_return_info : String,
  user_return_date : String,
  user_return_pic : String,
  vendor_cancell_info : String,
  vendor_cancell_date : String,
  vendor_accept_cancel : String,
  vendor_accept_cancel_date : String,
  payment_id : String,
  vendor_complete_date : String,
  vendor_complete_info : String,
  vendor_cancel_return_date :  String,
  vendor_cancel_retune_info : String,
  shipping_details_id:    {  
       type: Schema.Types.ObjectId,
       ref: 'shippingdetails',
      },
  shipping_details : String,
  user_rate : String,
  user_feedback : String,
});
product_order_bookingSchema.plugin(timestamps);
mongoose.model('product_order_booking', product_order_bookingSchema);
module.exports = mongoose.model('product_order_booking');