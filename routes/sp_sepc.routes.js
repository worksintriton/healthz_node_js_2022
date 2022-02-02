var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var doctor_specModel = require('./../models/sp_specModel');


router.post('/create', async function(req, res) {
  try{
 let doctor_specModels  =  await doctor_specModel.findOne({specialzation:req.body.specialzation});

  if(doctor_specModels == null){
    await doctor_specModel.create({
            specialzation:  req.body.specialzation,
            date_and_time : req.body.date_and_time,
            delete_status : false
        }, 
        function (err, user) {
          console.log(user)
        res.json({Status:"Success",Message:"specialization added successfully", Data : user ,Code:200}); 
        });
  }else{
      res.json({Status:"Failed",Message:"already specialization added", Data : {},Code:500});
  }

       
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});


router.post('/filter_date', function (req, res) {
       // console.log(req.body);
        doctor_specModel.find({delete_status : false}, function (err, StateList) {
          console.log(err);
          // console.log("StateList",StateList);
          var final_Date = [];
          for(let a = 0; a < StateList.length; a ++){
            var fromdate = new Date(req.body.fromdate);
            var todate = new Date(req.body.todate);
            console.log(StateList[a].createdAt);
            var checkdate = new Date(StateList[a].createdAt);
            console.log(fromdate,todate,checkdate);
            if(checkdate >= fromdate && checkdate <= todate){
              final_Date.push(StateList[a]);
            }
            if(a == StateList.length - 1){
              res.json({Status:"Success",Message:"doctor_specModels  List", Data : final_Date ,Code:200});
            }
          }
        });
});




router.get('/deletes', function (req, res) {
      doctor_specModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"specialization Deleted", Data : {} ,Code:200});     
      });
});


router.post('/getlist_id', function (req, res) {
        doctor_specModel.find({Person_id:req.body.Person_id,delete_status : false}, function (err, StateList) {
          res.json({Status:"Success",Message:"specialization List", Data : StateList ,Code:200});
        });
});



router.get('/getlist', function (req, res) {
        doctor_specModel.find({delete_status : false}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"specialization Details", Data : Functiondetails ,Code:200});
        });
});


router.get('/mobile/getlist', function (req, res) {
        doctor_specModel.find({delete_status:false}, function (err, Functiondetails) {
          let a = {
            usertypedata : Functiondetails
          }
          res.json({Status:"Success",Message:"specialization Details", Data : a ,Code:200});
        });
});

router.post('/edit', function (req, res) {
        doctor_specModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"specialization Updated", Data : UpdatedDetails ,Code:200});
        });
});


router.post('/delete', function (req, res) {
 let c = {
    delete_status : true
  }
  doctor_specModel.findByIdAndUpdate(req.body._id, c, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Deleted successfully", Data : UpdatedDetails ,Code:200});
  });
});


// // DELETES A USER FROM THE DATABASE
router.post('/admin_delete', function (req, res) {
      doctor_specModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"specialization Deleted successfully", Data : {} ,Code:200});
      });
});


module.exports = router;
