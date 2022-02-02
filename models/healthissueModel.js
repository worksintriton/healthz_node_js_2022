var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema; 

var healthissueSchema = new mongoose.Schema({  
  health_issue_title:  String,
  health_issue_img : String,
  date_and_time : String,
  delete_status : Boolean,
});
healthissueSchema.plugin(timestamps);
mongoose.model('healthissue', healthissueSchema);
module.exports = mongoose.model('healthissue');