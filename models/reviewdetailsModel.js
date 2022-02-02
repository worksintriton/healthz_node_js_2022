var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema; 

var reviewdetailsSchema = new mongoose.Schema({  
  user_id:  String,
  doctor_id : String,
  reviews : String,
  rating : Number,
});
reviewdetailsSchema.plugin(timestamps);
mongoose.model('reviewdetails', reviewdetailsSchema);
module.exports = mongoose.model('reviewdetails');