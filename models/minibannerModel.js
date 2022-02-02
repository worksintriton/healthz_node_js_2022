var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema; 

var minibannerSchema = new mongoose.Schema({  
  img_path:  String,
  img_title : String,
  img_describ : String,
  img_index : Number,
  show_status : Boolean,
  date_and_time : String,
    delete_status : Boolean,
});
minibannerSchema.plugin(timestamps);
mongoose.model('minibanner', minibannerSchema);
module.exports = mongoose.model('minibanner');