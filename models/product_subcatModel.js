var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema; 

var product_sub_cateSchema = new mongoose.Schema({  
  img_path:  String,
  product_categ : String,
  product_sub_cate : String,
  img_index : Number,
  show_status : Boolean,
  date_and_time : String,
  delete_status : Boolean,
});
product_sub_cateSchema.plugin(timestamps);
mongoose.model('product_sub_cate', product_sub_cateSchema);
module.exports = mongoose.model('product_sub_cate');