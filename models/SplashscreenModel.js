var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema; 

var SplashscreenSchema = new mongoose.Schema({  
  img_path:  String,
  img_title : String,
  img_index : Number,
  show_status : Boolean,
  date_and_time : String,
    delete_status : Boolean,
});
SplashscreenSchema.plugin(timestamps);
mongoose.model('Splashscreen', SplashscreenSchema);
module.exports = mongoose.model('Splashscreen');