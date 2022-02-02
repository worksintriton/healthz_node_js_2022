var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema; 
var vendor_order_productSchema = new mongoose.Schema({  
  user_id : String,
  vendor_id:  String,
  order_id : String,
  product_id : String,
  product_data : [],
  product_quantity : Number,
  single_product_price : Number,
  over_all_price : String,
  product_image : String,
  product_booked_on : String,
  product_status : String,
  mobile_type : String,
  user_rate : String,
  user_feedback : String,
  shipping_details_id :  {  
       type: Schema.Types.ObjectId,
       ref: 'shippingdetails',
      },
  prodcut_track_details : Array,
});
vendor_order_productSchema.plugin(timestamps);
mongoose.model('vendor_order_product', vendor_order_productSchema);
module.exports = mongoose.model('vendor_order_product');