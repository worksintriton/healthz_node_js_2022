var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var HolidayModel = require('./../models/HolidayModel');
var AppointmentsModel = require('./../models/AppointmentsModel');


router.post('/create', async function(req, res) {
  console.log(req.body);
  try{
    var datas = await HolidayModel.findOne({user_id:req.body.user_id,Date:req.body.Date});
    var Appointments_Details = await AppointmentsModel.find({doctor_id:req.body.user_id,booking_date:req.body.Date,appoinment_status:"Incomplete"});
    console.log("Appointmnet Details",Appointments_Details);
    if(Appointments_Details.length == 0){
        if(datas == null){
              await HolidayModel.create({
            user_id:  req.body.user_id,
            Date : req.body.Date,
            mobile_type : req.body.mobile_type,
            delete_status : false
        }, 
        function (err, user) {
          console.log(user)
        res.json({Status:"Success",Message:"Added successfully", Data : user ,Code:200}); 
        });
            }
            else{
              res.json({Status:"Failed",Message:"Already added", Data : {} ,Code:404}); 
            }

    }else{
            res.json({Status:"Failed",Message:"You have "+Appointments_Details.length+" appointments on the selected date. Please cancel your appointments for this day before marking your calender", Data : {} ,Code:404}); 
    } 
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});


router.get('/deletes', function (req, res) {
      HolidayModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"Holiday deleted", Data : {} ,Code:200});     
      });
});

router.post('/filter_date', function (req, res) {
        HolidayModel.find({}, function (err, StateList) {
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


router.post('/getlist_id', function (req, res) {
        HolidayModel.find({user_id:req.body.user_id}, function (err, StateList) {
          res.json({Status:"Success",Message:"doctor holiday list", Data : StateList ,Code:200});
        });
});



router.get('/getlist', function (req, res) {
        HolidayModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"doctor holiday list", Data : Functiondetails ,Code:200});
        });
});


router.post('/edit', function (req, res) {
        HolidayModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Functiondetails Updated", Data : UpdatedDetails ,Code:200});
        });
});


// router.post('/delete', function (req, res) {
//  let c = {
//     delete_status : true
//   }
//   HolidayModel.findByIdAndUpdate(req.body._id, c, {new: true}, function (err, UpdatedDetails) {
//             if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
//              res.json({Status:"Success",Message:"Location Deleted successfully", Data : UpdatedDetails ,Code:200});
//   });
// });


// // DELETES A USER FROM THE DATABASE

router.post('/delete', function (req, res) {
      HolidayModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Holiday Deleted successfully", Data : {} ,Code:200});
      });
});



module.exports = router;
