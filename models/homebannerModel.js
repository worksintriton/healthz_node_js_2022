var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema; 

var HomebannerSchema = new mongoose.Schema({  
  img_path:  String,
  img_title : String,
  img_describ : String,
  img_index : Number,
  show_status : Boolean,
  date_and_time : String,
    delete_status : Boolean,
});
HomebannerSchema.plugin(timestamps);
mongoose.model('Homebanner', HomebannerSchema);
module.exports = mongoose.model('Homebanner');