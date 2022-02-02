var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema; 

var product_rate_reviewSchema = new mongoose.Schema({  
  user_id:  String,
  product_id : String,
  reviews : String,
  rating : Number,
});
product_rate_reviewSchema.plugin(timestamps);
mongoose.model('product_rate_review', product_rate_reviewSchema);
module.exports = mongoose.model('product_rate_review');