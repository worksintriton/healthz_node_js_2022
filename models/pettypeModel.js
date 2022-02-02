var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema; 

var pettypeSchema = new mongoose.Schema({  
  pet_type_title:  String,
  pet_type_img : String,
  pet_type_value : Number,
  date_and_time : String,
  delete_status : Boolean,
});
pettypeSchema.plugin(timestamps);
mongoose.model('pettype', pettypeSchema);
module.exports = mongoose.model('pettype');