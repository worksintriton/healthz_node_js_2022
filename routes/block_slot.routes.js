var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var block_slotModel = require('./../models/block_slotModel');


router.post('/create', async function(req, res) {
  for(let a = 0; a < req.body.time.length ; a ++){
  try{
        await block_slotModel.create({
            user_id:  req.body.user_id,
            booking_date : req.body.booking_date,
            booking_time : req.body.time[a].booking_time,
            booking_date_time : req.body.booking_date_time
        }, 
        function (err, user) {
          console.log(user)
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}

if(a == req.body.time.length - 1){
  res.json({Status:"Success",Message:"Added successfully", Data : {} ,Code:200}); 
}
    }
});


router.post('/filter_date', function (req, res) {
        block_slotModel.find({}, function (err, StateList) {
          var final_Date = [];
          for(let a = 0; a < StateList.length; a ++){
            var fromdate = new Date(req.body.fromdate);
            var todate = new Date(req.body.todate);
            var checkdate = new Date(StateList[a].createdAt);
            console.log(fromdate,todate,checkdate);
            if(checkdate >= fromdate && checkdate <= todate){
              final_Date.push(StateList[a]);
            }
            if(a == StateList.length - 1){
              res.json({Status:"Success",Message:"Demo screen  List", Data : final_Date ,Code:200});
            }
          }
        });
});



router.get('/deletes', function (req, res) {
      block_slotModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"Demo screen  Deleted", Data : {} ,Code:200});     
      });
});


router.post('/getlist_id', function (req, res) {
        block_slotModel.find({Person_id:req.body.Person_id}, function (err, StateList) {
          res.json({Status:"Success",Message:"Demo screen  List", Data : StateList ,Code:200});
        });
});



router.get('/getlist', function (req, res) {
        block_slotModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Demo screen  Details", Data : Functiondetails ,Code:200});
        });
});



router.get('/mobile/getlist', function (req, res) {
        block_slotModel.find({show_status:true}, function (err, Functiondetails) {
          let a = {
            Demodata : Functiondetails
          }
          res.json({Status:"Success",Message:"Demo screen Details", Data : a ,Code:200});
        });
});

router.post('/edit', function (req, res) {
        block_slotModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Demo screen  Updated", Data : UpdatedDetails ,Code:200});
        });
});

router.post('/delete', function (req, res) {
block_slotModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Demo screen Deleted successfully", Data : {} ,Code:200});
      });
});



// // DELETES A USER FROM THE DATABASE
router.post('/admin_delete', function (req, res) {
      block_slotModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Demo screen Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;
