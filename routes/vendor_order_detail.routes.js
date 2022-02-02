var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var vendor_order_detailModel = require('./../models/vendor_order_detailModel');


router.post('/create', async function(req, res) {
try{
  
    var ven_order_details = await vendor_order_detailModel.findOne({order_id:req.body.order_id});
    if(ven_order_details !== null){
      console.log("ven_order_details",ven_order_details);
      // res.json({Status:"Failed",Message:"Slot Not Available", Data : Appointment_details ,Code:404}); 
    }else{
            await vendor_order_detailModel.create({
            user_id:  req.body.user_id,
            order_id : Appointmentid,
            product_data : product_data[a],
            product_quantity : product_data[a].product_count,
            date_of_booking : req.body.date_of_booking,
            delivery_date : "",
            date_of_booking_display : "",
            delivery_date_display :  "",
            order_status :  "Booked",
            mobile_type : req.body.mobile_type,
            prodouct_total :  product_data[a].product_count * product_data[a].product_id.cost,
            shipping_charge :  req.body.shipping_charge,
            discount_price :  req.body.discount_price,
            grand_total :  0,
            delete_status : false
        }, 
        function (err, user) {
          console.log(user)
        res.json({Status:"Success",Message:"Demo screen Added successfully", Data : user ,Code:200}); 
        });
    }       
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});


router.get('/deletes', function (req, res) {
      vendor_order_detailModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"Demo screen  Deleted", Data : {} ,Code:200});     
      });
});


router.post('/getlist_id', function (req, res) {
        vendor_order_detailModel.find({Person_id:req.body.Person_id}, function (err, StateList) {
          res.json({Status:"Success",Message:"Demo screen  List", Data : StateList ,Code:200});
        });
});




router.post('/filter_date', function (req, res) {
        vendor_order_detailModel.find({}, function (err, StateList) {
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





router.get('/getlist', function (req, res) {
        vendor_order_detailModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Demo screen  Details", Data : Functiondetails ,Code:200});
        });
});



router.get('/mobile/getlist', function (req, res) {
        vendor_order_detailModel.find({show_status:true}, function (err, Functiondetails) {
          let a = {
            Demodata : Functiondetails
          }
          res.json({Status:"Success",Message:"Demo screen Details", Data : a ,Code:200});
        });
});

router.post('/edit', function (req, res) {
        vendor_order_detailModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Demo screen  Updated", Data : UpdatedDetails ,Code:200});
        });
});


router.post('/delete', function (req, res) {
 let c = {
    delete_status : true
  }
  vendor_order_detailModel.findByIdAndUpdate(req.body._id, c, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Location Deleted successfully", Data : UpdatedDetails ,Code:200});
  });
});



// // DELETES A USER FROM THE DATABASE
router.post('/admin_delete', function (req, res) {
      vendor_order_detailModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Demo screen Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;
