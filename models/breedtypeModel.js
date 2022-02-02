var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema; 

var breedtypeSchema = new mongoose.Schema({  
  pet_type_id:  {  
       type: Schema.Types.ObjectId,
       ref: 'pettype',
      },
  pet_breed : String,
  pet_breed_img : String,
  pet_breed_value : Number,
  date_and_time : String,
    delete_status : Boolean,
});
breedtypeSchema.plugin(timestamps);
mongoose.model('breedtype', breedtypeSchema);
module.exports = mongoose.model('breedtype');