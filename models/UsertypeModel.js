var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema; 

var UsertypeSchema = new mongoose.Schema({  
  user_type_title:  String,
  user_type_value : Number,
  user_type_img : String,
  date_and_time : String,
    delete_status : Boolean,
});
UsertypeSchema.plugin(timestamps);
mongoose.model('Usertype', UsertypeSchema);
module.exports = mongoose.model('Usertype');