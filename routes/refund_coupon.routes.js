var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var refund_couponModel = require('./../models/refund_couponModel');
var AppointmentsModel = require('./../models/AppointmentsModel');
var SP_appointmentsModels = require('./../models/SP_appointmentsModels');
var petlover_order_groupModel = require('./../models/petlover_order_groupModel');

router.post('/create', async function(req, res) {
 if(req.body.code == "Bank"){
  if(req.body.coupon_type == "1"){
    let datas = {
      coupon_status : "Bank Transaction"
    }
  AppointmentsModel.findByIdAndUpdate(req.body.user_details, datas, {new: true},async function (err, UpdatedDetails) {
  res.json({Status:"Success",Message:"Successfully", Data : {},Code:200});
  });
  }else if(req.body.coupon_type == "2"){
     let datas = {
      coupon_status : "Bank Transaction"
    }
  SP_appointmentsModels.findByIdAndUpdate(req.body.user_details, datas, {new: true},async function (err, UpdatedDetails) {
  res.json({Status:"Success",Message:"Successfully", Data : {},Code:200});
  });
  res.json({Status:"Success",Message:"Successfully", Data : {},Code:200});
  }else if(req.body.coupon_type == "3"){
  var product_detail = await petlover_order_groupModel.findOne({p_order_id:req.body.user_details});
  petlover_order_groupModel.findByIdAndUpdate(product_detail._id, datas, {new: true},async function (err, UpdatedDetails) {
  res.json({Status:"Success",Message:"Successfully", Data : {},Code:200});
  });
  res.json({Status:"Success",Message:"Successfully", Data : {},Code:200});

  }
 } else{
  
  var text = "";
  if(req.body.coupon_type == "1"){
   text = "doctor"
  }else if(req.body.coupon_type == "2"){
    text = "service provider"
  }else if(req.body.coupon_type == "3"){
     text = "shopping"
  }

  try{
   await refund_couponModel.create({
  created_by : req.body.created_by,
  coupon_type : req.body.coupon_type,
  code : req.body.code,
  amount : req.body.amount,
  user_details : req.body.user_details,
  used_status : req.body.used_status,
  mobile_type : req.body.mobile_type,
  title: "Refund as a Coupon",
  descri: "A Coupon with the same value of the amount paid which can used for any " + text + " services in Healthz App. Coupon value of Rs."+req.body.amount+"/-",
  active_status : true,
  delete_status : false,
        }, 
        function (err, user) {
        res.json({Status:"Success",Message:"Ref Code Added successfully", Data : user ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}

}
 






});

router.post('/filter_date', function (req, res) {
        refund_couponModel.find({ delete_status : false}, function (err, StateList) {
          var final_Date = [];
          for(let a = 0; a < StateList.length; a ++){
            var fromdate = new Date(req.body.fromdate);
            var todate = new Date(req.body.todate);
            var checkdate = new Date(StateList[a].createdAt);
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
      refund_couponModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"Splash screen  Deleted", Data : {} ,Code:200});     
      });
});


router.post('/getlist_id', function (req, res) {
        refund_couponModel.find({Person_id:req.body.Person_id, delete_status : false}, function (err, StateList) {
          res.json({Status:"Success",Message:"Splash screen  List", Data : StateList ,Code:200});
        });
});



router.post('/check_coupon',async function (req, res) {
  var coupon_detail = await refund_couponModel.findOne({code:req.body.code,coupon_type:req.body.coupon_type});
 if(coupon_detail == null){
  res.json({Status:"Failed",Message:"Coupon Code Not Valid", Data : {} ,Code:404});
 }else {
  let exp = new Date(coupon_detail.expired_date);
  let cur = new Date(req.body.current_date);
 if(exp >= cur){
   if(coupon_detail.active_status == true){
      if(coupon_detail.apply_for == "All"){
        if(coupon_detail.coupon_cat == "Amount"){
           let original_price = 0;
           let discount_price = 0;
           let total_price = 0;
           total_price = req.body.total_amount - coupon_detail.amount;
           original_price = req.body.total_amount;
           discount_price = coupon_detail.amount
           if(total_price < 0){
            total_price = 0;
           }
           let a = {
            original_price: Math.round(original_price),
            discount_price: Math.round(discount_price),
            total_price: Math.round(total_price)
           }
           res.json({Status:"Success",Message:"Coupon Code Applied Successfully", Data : a ,Code:200});
        }
      else{
           let original_price = 0;
           let discount_price = 0;
           let total_price = 0;
           total_price = (coupon_detail.percentage / 100) * req.body.total_amount;
           original_price = req.body.total_amount;
           discount_price = total_price;
           total_price = req.body.total_amount - total_price;
           if(total_price < 0){
            total_price = 0;
           }
           let a = {
            original_price: Math.round(original_price),
            discount_price: Math.round(discount_price),
            total_price: Math.round(total_price)
           }
           res.json({Status:"Success",Message:"Coupon Code Applied Successfully", Data : a ,Code:200});
      }
      }else{
        let user_detail = coupon_detail.user_details;
        let check_Status = 0;
       for(let a  = 0; a < user_detail.length ; a ++){
       if(user_detail[a] == req.body.user_id){
        check_Status == 1;
       }
       if(a == user_detail.length - 1){
        if(check_Status == 1){
          ////////////////////////
        if(coupon_detail.coupon_cat == "Amount"){
           let original_price = 0;
           let discount_price = 0;
           let total_price = 0;
           total_price = req.body.total_amount - coupon_detail.amount;
           original_price = req.body.total_amount;
           discount_price = coupon_detail.amount
           if(total_price < 0){
            total_price = 0;
           }
           let a = {
            original_price: Math.round(original_price),
            discount_price: Math.round(discount_price),
            total_price: Math.round(total_price)
           }
           res.json({Status:"Success",Message:"Coupon Code Applied Successfully", Data : a ,Code:200});
        }
        else{
           let original_price = 0;
           let discount_price = 0;
           let total_price = 0;
           total_price = (coupon_detail.percentage / 100) * req.body.total_amount;
           original_price = req.body.total_amount;
           discount_price = total_price;
           total_price = req.body.total_amount - total_price;
           if(total_price < 0){
            total_price = 0;
           }
           let a = {
            original_price: Math.round(original_price),
            discount_price: Math.round(discount_price),
            total_price: Math.round(total_price)
           }
           res.json({Status:"Success",Message:"Coupon Code Applied Successfully", Data : a ,Code:200});
          }
          ///////////////////////
        }else{
         res.json({Status:"Success",Message:"This coupon not valid for you", Data : a ,Code:200});
        }
       }
       }
      }
   }else{
    res.json({Status:"Failed",Message:"Coupon Blocked Temp", Data : {} ,Code:404});
   }
 }else{
   res.json({Status:"Failed",Message:"Coupon Expired", Data : {} ,Code:404});
 }
 }
});



router.get('/getlist', function (req, res) {
        refund_couponModel.find({ delete_status : false}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Splash screen  Details", Data : Functiondetails ,Code:200});
        });
});


router.get('/mobile/getlist', function (req, res) {
        refund_couponModel.find({show_status:true}, function (err, Functiondetails) {
          let a ={
             SplashScreendata : Functiondetails
          }
          res.json({Status:"Success",Message:"Splash screen  Details", Data : a ,Code:200});
        });
});

router.post('/delete', function (req, res) {
 let c = {
    delete_status : true
  }
  refund_couponModel.findByIdAndUpdate(req.body._id, c, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Location Deleted successfully", Data : UpdatedDetails ,Code:200});
  });
});



router.post('/edit', function (req, res) {
        refund_couponModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Splash screen  Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/admin_delete', function (req, res) {
      refund_couponModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Splash screen Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;
