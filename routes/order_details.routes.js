var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var order_detailsModel = require('./../models/order_detailsModel');


router.post('/create', async function(req, res) {
  try{
 let pettypedetails  =  await order_detailsModel.findOne({pet_type_title:req.body.pet_type_title});


    await order_detailsModel.create({
  user_id : req.body.user_id,
  location_id : req.body.location_id,
  order_id:  req.body.order_id,
  order_title :  req.body.order_title,
  order_details :  req.body.order_details,
  order_item_count :  req.body.order_item_count,
  order_booked_at :  req.body.order_booked_at,
  order_deliver_date : req.body.order_deliver_date,
  order_deliver_status :  req.body.order_deliver_status,
  order_return_date :  req.body.order_return_date,
  order_return_reason :  req.body.order_return_reason,
  order_feedback :  req.body.order_feedback,
  order_delivered_id :  req.body.order_delivered_id,
  order_value :  req.body.order_value,
  order_coupon_code :  req.body.order_coupon_code,
  order_coupon_code_value :  req.body.order_coupon_code_value,
  order_final_amount :  req.body.order_final_amount,
  delete_status :  false
            // pet_type_title:  req.body.pet_type_title,
            // user_type_value : req.body.user_type_value,
            // date_and_time : req.body.date_and_time,
            // delete_status : false
        }, 
        function (err, user) {
          console.log(user)
        res.json({Status:"Success",Message:"Order Added successfully", Data : user ,Code:200}); 
        });
  

       
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});


router.post('/filter_date', function (req, res) {
        order_detailsModel.find({}, function (err, StateList) {
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



router.post('/getorder_list', function (req, res) {
        order_detailsModel.find({user_id:req.body.user_id,order_deliver_status : req.body.order_deliver_status}, function (err, StateList) {
          res.json({Status:"Success",Message:"New Order List", Data : StateList ,Code:200});
        });
});





router.get('/deletes', function (req, res) {
      order_detailsModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"PET type Deleted", Data : {} ,Code:200});     
      });
});


router.post('/getlist_id', function (req, res) {
        order_detailsModel.find({Person_id:req.body.Person_id}, function (err, StateList) {
          res.json({Status:"Success",Message:"PET type List", Data : StateList ,Code:200});
        });
});



router.get('/getlist', function (req, res) {
        order_detailsModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"PET type Details", Data : Functiondetails ,Code:200});
        });
});


router.get('/mobile/getlist', function (req, res) {
        pettypeModel.find({}, function (err, Functiondetails) {
          let a = {
            usertypedata : Functiondetails
          }
          res.json({Status:"Success",Message:"PET type Details", Data : a ,Code:200});
        });
});

router.post('/edit', function (req, res) {
        order_detailsModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"PET type Updated", Data : UpdatedDetails ,Code:200});
        });
});

router.post('/delete', function (req, res) {
 let c = {
    delete_status : true
  }
  order_detailsModel.findByIdAndUpdate(req.body._id, c, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Location Deleted successfully", Data : UpdatedDetails ,Code:200});
  });
});



// // DELETES A USER FROM THE DATABASE
router.post('/admin_delete', function (req, res) {
      order_detailsModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"PET type Deleted successfully", Data : {} ,Code:200});
      });
});


module.exports = router;
