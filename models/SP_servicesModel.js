var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema; 

var SP_servicesSchema = new mongoose.Schema({  
  img_path:  String,
  img_title : String,
  img_subtitle : String,
  img_banner : String,
  img_index : Number,
  show_status : Boolean,
  date_and_time : String,
  delete_status : Boolean,
});
SP_servicesSchema.plugin(timestamps);
mongoose.model('SP_services', SP_servicesSchema);
module.exports = mongoose.model('SP_services');