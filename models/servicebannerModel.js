var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema; 

var servicebannerSchema = new mongoose.Schema({  
  img_path:  String,
  img_title : String,
  img_describ : String,
  img_index : Number,
  show_status : Boolean,
  date_and_time : String,
  delete_status : Boolean,
});
servicebannerSchema.plugin(timestamps);
mongoose.model('servicebanner', servicebannerSchema);
module.exports = mongoose.model('servicebanner');