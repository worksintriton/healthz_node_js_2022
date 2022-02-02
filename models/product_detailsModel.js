var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema; 

var product_detailsSchema = new mongoose.Schema({ 
  user_id :  {
        type: Schema.Types.ObjectId, 
        ref: 'product_vendor',
    },
  cat_id : {
        type: Schema.Types.ObjectId, 
        ref: 'product_categ',
    },
  thumbnail_image: String,  
  product_img : Array,
  product_name : String,
  cost : Number,
  product_discription : String,
  condition : String,
  price_type : String,
  addition_detail : Array,
  threshould : String,

  date_and_time : String,
  mobile_type : String,
  
  related : String,
  count : Number,
  status : String,
  verification_status : String,
  delete_status : Boolean,
  fav_status : Boolean,
  today_deal : Boolean,
  discount : Number,
  discount_amount : Number,
  discount_status : Boolean,
  discount_cal : Number,
  discount_start_date : String,
  discount_end_date : String,
  product_rating : Number,
  product_review : Number,
 
});
product_detailsSchema.plugin(timestamps);
mongoose.model('product_details', product_detailsSchema);
module.exports = mongoose.model('product_details');
