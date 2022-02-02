var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema; 

var block_slotSchema = new mongoose.Schema({  
  user_id : {  
       type: Schema.Types.ObjectId,
       ref: 'userdetails',
      },
  booking_date: String,
  booking_time: String,
  booking_date_time : String,
});
block_slotSchema.plugin(timestamps);
mongoose.model('block_slot', block_slotSchema);
module.exports = mongoose.model('block_slot');