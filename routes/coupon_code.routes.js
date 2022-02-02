var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var coupon_codeModel = require('./../models/coupon_codeModel');
var refund_couponModel = require('./../models/refund_couponModel');


var AppointmentsModel = require('./../models/AppointmentsModel');
var SP_appointmentsModels = require('./../models/SP_appointmentsModels');
var petlover_order_groupModel = require('./../models/petlover_order_groupModel');


router.post('/create', async function(req, res) {
  var types = "Pet Care";
  if(req.body.coupon_type == "1"){
   types = "Pet Care";
  }else if(req.body.coupon_type == "2") {
   types = "Services";
  }else if(req.body.coupon_type == "3") {
    types = "Shop";
  }
  var amount_type = 0;
  var value_type = "";
  if(req.body.coupon_cat == "Percentage"){
    value_type = "% Percentage";
    amount_type = req.body.percentage;
  }else if(req.body.coupon_cat == "Amount"){
    value_type = "Amount";
    amount_type = req.body.amount;
  }


  try{
   await coupon_codeModel.create({
  created_by : req.body.created_by,
  expired_date : new Date(req.body.expired_date),
  coupon_type : req.body.coupon_type,
  apply_for : req.body.apply_for,
  code : req.body.code,
  coupon_cat : req.body.coupon_cat,
  percentage : req.body.percentage,
  title:  "OFFER COUPON",
  descri: "You can use this coupon for " + types + " Module with value of "+ amount_type + " " + value_type +".",
  amount : req.body.amount,
  user_details : req.body.user_details || [],
  active_status : true,
  delete_status : false,
        }, 
        function (err, user) {
        res.json({Status:"Success",Message:"Splash screen Added successfully", Data : user ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});

router.post('/filter_date', function (req, res) {
        coupon_codeModel.find({ delete_status : false}, function (err, StateList) {
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
      coupon_codeModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"Splash screen  Deleted", Data : {} ,Code:200});     
      });
});


router.get('/text', function (req, res) {  
     let a = [
       {
        "image" : "http://54.212.108.156:3000/api/uploads/1629451447949.jpeg",
         "title": "Refund to original source",
         "descri": "Usually will take 4-5 working days for the refund.",
         "refund" :""
       },
       {
         "image" : "http://54.212.108.156:3000/api/uploads/1629451505391.jpeg",
         "title": "Refund as a Coupon",
         "descri":"A Coupon with the same value of the amount paid which can be used for availing any services in the Petfolio App.",
         "refund" : "refund"
       }
     ]
    res.json({Status:"Success",Message:"Refund content", Data : a ,Code:200});    

});





router.post('/getlist_id',async function (req, res) {

        var coupon_detail = await coupon_codeModel.find({});
        refund_couponModel.find({user_details:req.body.user_id},async function (err, StateList) {
           var final_data = [];  
           if(StateList.length == 0){
            check_coupon();
           }
           for(let a = 0; a < StateList.length ; a ++){
            let c = {
                "coupon_img"  : "http://54.212.108.156:3000/api/uploads/1629720915348.png",
                "coupon_type" : "REFUND CODE",
                "coupon_code" : StateList[a].code,
                "expired_date" : "",
                "title": StateList[a].title || "",
                "descri": StateList[a].descri || "",
                "used_status": StateList[a].used_status|| "", 
                "createdAt" :  StateList[a].createdAt|| "",
            }
            final_data.push(c);
            if(a == StateList.length - 1){
              check_coupon();
            }
           }
           async function check_coupon() {
           if(coupon_detail.length == 0){
             final_data.sort(function compare(a, b) {
               var dateA = new Date(a.createdAt);
               var dateB = new Date(b.createdAt);
               return dateB - dateA;
               });
            res.json({Status:"Success",Message:"Coupon Code List", Data : final_data ,Code:200});
           }
           else{
            for(let e = 0 ; e < coupon_detail.length ; e ++){
             if(coupon_detail[e].apply_for == "All"){
               check_status = '';
               var check_user = await AppointmentsModel.findOne({coupon_code:coupon_detail[e].code,user_id:req.body.user_id});
               if(check_user !== null){
               check_status = 'Used';
               }
               var check_user = await SP_appointmentsModels.findOne({coupon_code:coupon_detail[e].code,user_id:req.body.user_id});
               if(check_user !== null){
               check_status = 'Used';
               }
               var check_user = await petlover_order_groupModel.findOne({coupon_code:coupon_detail[e].code,p_user_id:req.body.user_id});
               if(check_user !== null){
                check_status = 'Used';
               }

             let c = {
                "coupon_img"  : "http://54.212.108.156:3000/api/uploads/1629720915348.png",
                "coupon_type" : "NORMAL CODE",
                "coupon_code" : coupon_detail[e].code,
                "expired_date" :  coupon_detail[e].expired_date,
                "title":  coupon_detail[e].title || "",
                "descri":  coupon_detail[e].descri || "",
                "used_status": check_status,
                "createdAt" : coupon_detail[e].createdAt|| "",
            }
            final_data.push(c);
             }
             else
             {
              let temp_date = coupon_detail[a].user_details;
              for(let d = 0;d < temp_date.length ; d++){
                 if(temp_date[d] == req.body.user_id){
               check_status = '';
               var check_user = await AppointmentsModel.findOne({coupon_code:coupon_detail[e].code,user_id:req.body.user_id});
               if(check_user !== null){
               check_status = 'Used';
               }
               var check_user = await SP_appointmentsModels.findOne({coupon_code:coupon_detail[e].code,user_id:req.body.user_id});
               if(check_user !== null){
               check_status = 'Used';
               }
               var check_user = await petlover_order_groupModel.findOne({coupon_code:coupon_detail[e].code,p_user_id:req.body.user_id});
               if(check_user !== null){
                check_status = 'Used';
               }
                let c = {
                "coupon_img"  : "http://54.212.108.156:3000/api/uploads/1629720915348.png",
                "coupon_type" : "NORMAL CODE",
                "coupon_code" : coupon_detail[e].code,
                "Expired_date" : coupon_detail[e].expired_date,
                "title": coupon_detail[e].title || "",
                "descri": coupon_detail[e].descri || "",
                "used_status":check_status,
                "createdAt" : coupon_detail[e].createdAt|| "",
                }
                final_data.push(c);
                 }
              }
             }
             if(e == coupon_detail.length - 1){
              final_data.sort(function compare(a, b) {
               var dateA = new Date(a.createdAt);
               var dateB = new Date(b.createdAt);
               return dateB - dateA;
               });
              res.json({Status:"Success",Message:"Coupon Code List", Data : final_data ,Code:200});
            }
            }
           }
           }
        });
});



router.post('/check_coupon',async function (req, res) {
  var coupon_used_status = false;
  if(req.body.coupon_type == 1){
  var check_user = await AppointmentsModel.findOne({coupon_code:req.body.code,user_id:req.body.user_id});
  if(check_user !== null){
    coupon_used_status = true;
  }
  }else if(req.body.coupon_type == 2){
  var check_user = await SP_appointmentsModels.findOne({coupon_code:req.body.code,user_id:req.body.user_id});
  if(check_user !== null){
    coupon_used_status = true;
  }
  }else if(req.body.coupon_type == 3){
  var check_user = await petlover_order_groupModel.findOne({coupon_code:req.body.code,p_user_id:req.body.user_id});
  if(check_user !== null){
    coupon_used_status = true;
  }
  }
  var refund_coupon_detail = await refund_couponModel.findOne({code:req.body.code,coupon_type:req.body.coupon_type,user_details:req.body.user_id});
  var coupon_detail = await coupon_codeModel.findOne({code:req.body.code,coupon_type:req.body.coupon_type});
if(coupon_used_status == true){
  res.json({Status:"Failed",Message:"This coupon code is already used", Data : {} ,Code:404});
}
else{
 if(coupon_detail == null){
  if(refund_coupon_detail == null){
  res.json({Status:"Failed",Message:"This coupon code is invalid", Data : {} ,Code:404});
  }else{
          if(refund_coupon_detail.used_status == "Not Used"){
           let original_price = 0;
           let discount_price = 0;
           let total_price = 0;
           total_price = req.body.total_amount - refund_coupon_detail.amount;
           original_price = req.body.total_amount;
           discount_price = refund_coupon_detail.amount
            if(total_price < 0){
            total_price = 0;
            let a = {
            original_price: Math.round(original_price),
            discount_price: Math.round(discount_price),
            total_price: Math.round(total_price),
            coupon_type : "REFUND CODE"
            }
            res.json({Status:"Failed",Message:"This coupon code cannot be applied", Data : {} ,Code:404});
            }
            else {
            let a = {
            original_price: Math.round(original_price),
            discount_price: Math.round(discount_price),
            total_price: Math.round(total_price),
            coupon_type : "REFUND CODE"
            }
             res.json({Status:"Success",Message:"Coupon code applied successfully", Data : a ,Code:200});
            }
          }
          else if(refund_coupon_detail.used_status == "Used") {
            res.json({Status:"Failed",Message:"This coupon code is already used", Data : {} ,Code:404});
          }
  }
 } else {
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
             let a = {
            original_price: Math.round(original_price),
            discount_price: Math.round(discount_price),
            total_price: Math.round(total_price),
            coupon_type : "NORMAL CODE"
           }
           res.json({Status:"Failed",Message:"This coupon code cannot be applied", Data : {} ,Code:404});
           }else{
             let a = {
            original_price: Math.round(original_price),
            discount_price: Math.round(discount_price),
            total_price: Math.round(total_price),
            coupon_type : "NORMAL CODE"
           }
           res.json({Status:"Success",Message:"Coupon code applied successfully", Data : a ,Code:200});
           }
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
            let a = {
            original_price: Math.round(original_price),
            discount_price: Math.round(discount_price),
            total_price: Math.round(total_price),
            coupon_type : "NORMAL CODE"
           }
          res.json({Status:"Failed",Message:"This coupon code cannot be applied", Data : {} ,Code:404});
           }else{
            let a = {
            original_price: Math.round(original_price),
            discount_price: Math.round(discount_price),
            total_price: Math.round(total_price),
            coupon_type : "NORMAL CODE"
           }
           res.json({Status:"Success",Message:"Coupon code applied successfully", Data : a ,Code:200});
           }
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
            let a = {
            original_price: Math.round(original_price),
            discount_price: Math.round(discount_price),
            total_price: Math.round(total_price),
            coupon_type : "NORMAL CODE"
           }
          res.json({Status:"Failed",Message:"This coupon code cannot be applied", Data : {} ,Code:404});
           }else{
            let a = {
            original_price: Math.round(original_price),
            discount_price: Math.round(discount_price),
            total_price: Math.round(total_price),
            coupon_type : "NORMAL CODE"
           }
           res.json({Status:"Success",Message:"Coupon code applied successfully", Data : a ,Code:200});
           }
           
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
            let a = {
            original_price: Math.round(original_price),
            discount_price: Math.round(discount_price),
            total_price: Math.round(total_price),
            coupon_type : "NORMAL CODE"
           }
           res.json({Status:"Failed",Message:"This coupon code cannot be applied", Data : {} ,Code:404});
           }else{
            let a = {
            original_price: Math.round(original_price),
            discount_price: Math.round(discount_price),
            total_price: Math.round(total_price),
            coupon_type : "NORMAL CODE"
           }
           res.json({Status:"Success",Message:"Coupon code applied successfully", Data : a ,Code:200});
           }
           
          }
          ///////////////////////
        }else{
         res.json({Status:"Success",Message:"This coupon is not valid", Data : a ,Code:200});
        }
       }
       }
      }
   }else{
    res.json({Status:"Failed",Message:"This coupon code is temporarily blocked.", Data : {} ,Code:404});
   }
 }else{
   res.json({Status:"Failed",Message:"Coupon code invalid", Data : {} ,Code:404});
 }
 }
}
});



router.get('/getlist', function (req, res) {
        coupon_codeModel.find({ delete_status : false}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Splash screen  Details", Data : Functiondetails ,Code:200});
        });
});


router.get('/mobile/getlist', function (req, res) {
        coupon_codeModel.find({show_status:true}, function (err, Functiondetails) {
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
  coupon_codeModel.findByIdAndUpdate(req.body._id, c, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Location Deleted successfully", Data : UpdatedDetails ,Code:200});
  });
});



router.post('/edit', function (req, res) {
        coupon_codeModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Splash screen  Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/admin_delete', function (req, res) {
      coupon_codeModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Splash screen Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;
