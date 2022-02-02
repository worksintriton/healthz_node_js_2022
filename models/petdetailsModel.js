var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema; 

var petdetailsSchema = new mongoose.Schema({  
  user_id  : String,
  pet_name : String,
  pet_type : String,
  pet_breed : String,
  pet_gender : String,
  pet_color : String,
  pet_weight : Number,
  pet_age : String,
  pet_dob : String,
  pet_spayed : Boolean,
  pet_purebred : Boolean,
  pet_frnd_with_dog : Boolean,
  pet_frnd_with_cat : Boolean,
  pet_frnd_with_kit : Boolean,
  pet_microchipped : Boolean,
  pet_tick_free : Boolean,
  pet_private_part : Boolean,
  pet_img : Array,
  vaccinated : Boolean,
  last_vaccination_date : String,
  default_status : Boolean,
  date_and_time : String,
  mobile_type : String,
  delete_status : Boolean,
});
petdetailsSchema.plugin(timestamps);
mongoose.model('petdetails', petdetailsSchema);
module.exports = mongoose.model('petdetails');