var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var sosModel = require('./../models/sosModel');
var AppointmentsModel = require('./../models/AppointmentsModel');


router.post('/create', async function(req, res) {
  console.log(req.body);
  try{
    var datas = await sosModel.findOne({user_id:req.body.user_id});
    if(datas == null){
          await sosModel.create({
            user_id:  req.body.user_id,
            sos_detail : [
            {
            "_id" : 0,
            "name":"Healthz sos",
            "phone":"9876543210",
            "Edit_status":false,
             },
             {
            "_id" : 1,
            "name":"Ambulance",
            "phone":"9876543210",
            "Edit_status":false,
             },
             {
            "_id" : 2,
            "name":"Home",
            "phone":"9876543210",
            "Edit_status":true,
             },
             {
            "_id" : 3,
            "name":"Neighbour",
            "phone":"9876543210",
            "Edit_status":true,
             }
           ],
            Date : ""+new Date(),
            mobile_type : "Admin",
            delete_status : false
        }, 
        function (err, user) {
          console.log(user)
        res.json({Status:"Success",Message:"SOS Details", Data : user.sos_detail ,Code:200}); 
        });
        }else{
           res.json({Status:"Success",Message:"SOS Details", Data : datas.sos_detail ,Code:200}); 
        }
}
catch(e){
  console.log(e);
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});



router.post('/edit', async function(req, res) {
  console.log(req.body);
  try{
    var datas = await sosModel.findOne({user_id:req.body.user_id});
    console.log(datas);
    datas.sos_detail[req.body.id].name = req.body.name;
    datas.sos_detail[req.body.id].phone = req.body.phone;
    console.log(datas);
    let c = {
      sos_detail : datas.sos_detail
    }
     sosModel.findByIdAndUpdate(datas._id, c, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Updated", Data : UpdatedDetails ,Code:200});
    });
}
catch(e){
  console.log(e);
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});

router.get('/deletes', function (req, res) {
      sosModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"Holiday deleted", Data : {} ,Code:200});     
      });
});

router.post('/filter_date', function (req, res) {
        sosModel.find({}, function (err, StateList) {
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
        sosModel.find({user_id:req.body.user_id}, function (err, StateList) {
          res.json({Status:"Success",Message:"doctor holiday list", Data : StateList ,Code:200});
        });
});



router.get('/getlist', function (req, res) {
        sosModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"doctor holiday list", Data : Functiondetails ,Code:200});
        });
});


router.post('/edit', function (req, res) {
        sosModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Functiondetails Updated", Data : UpdatedDetails ,Code:200});
        });
});


// router.post('/delete', function (req, res) {
//  let c = {
//     delete_status : true
//   }
//   sosModel.findByIdAndUpdate(req.body._id, c, {new: true}, function (err, UpdatedDetails) {
//             if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
//              res.json({Status:"Success",Message:"Location Deleted successfully", Data : UpdatedDetails ,Code:200});
//   });
// });


// // DELETES A USER FROM THE DATABASE

router.post('/delete', function (req, res) {
      sosModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Holiday Deleted successfully", Data : {} ,Code:200});
      });
});



module.exports = router;
