var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var petlover_order_groupModel = require('./../models/petlover_order_groupModel');
var shipping_addressModel = require('./../models/shipping_addressModel');

var locationdetailsModel = require('./../models/locationdetailsModel');
var userdetailsModel = require('./../models/userdetailsModel');

router.post('/create', async function(req, res) {
  try{
        await petlover_order_groupModel.create({
            p_order_id : req.body.p_order_id,
            p_user_id : req.body.p_user_id,
            p_shipping_address : req.body.p_shipping_address,
            p_payment_id : req.body.p_payment_id,
            p_vendor_id :req.body.p_vendor_id,
            p_product_details : req.body.p_product_details,
            p_order_product_count :req.body.p_order_product_count,
            p_order_price :req.body.p_order_price,
            p_order_image : req.body.p_order_image,
            p_order_booked_on : req.body.p_order_booked_on,
            p_order_status : req.body.p_order_status,
            p_order_text : req.body.p_order_text,
        }, 
        function (err, user) {
        res.json({Status:"Success",Message:"Demo screen Added successfully", Data : user ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});



router.post('/get_grouped_order_by_petlover', function (req, res) {
        req.body.skip_count = req.body.skip_count - 1 ;
        req.body.skip_count = req.body.skip_count * 5 ;
        petlover_order_groupModel.find({p_user_id:req.body.petlover_id,p_order_status:req.body.status}, function (err, StateList) {
           if(StateList.length == 0){
              res.json({Status:"Success",Message:"Petlover Order Grouped", Data : [] ,Code:200});
           } else {
           let final_data = [];
           for(let f = 0 ; f < StateList.length; f++){
             let c = {
            p_order_id : StateList[f].p_order_id,
            p_user_id : StateList[f].p_user_id,
            p_shipping_address : StateList[f].p_shipping_address,
            p_payment_id : StateList[f].p_payment_id,
            p_vendor_id : StateList[f].p_vendor_id,
            p_order_product_count : StateList[f].p_order_product_count,
            p_order_price : StateList[f].p_order_price,
            p_order_image : StateList[f].p_order_image,
            p_order_booked_on : StateList[f].p_order_booked_on,
            p_order_status : StateList[f].p_order_status,
            p_order_text : StateList[f].p_order_text,
            p_order_status : StateList[f].p_order_status,
            p_cancelled_date : StateList[f].p_cancelled_date,
            p_completed_date : StateList[f].p_completed_date,
            p_user_feedback : StateList[f].p_user_feedback,
            p_user_rate : StateList[f].p_user_rate,
             }
             final_data.push(c);
             if(f == StateList.length - 1)
             {
              res.json({Status:"Success",Message:"Petlover Order Grouped", Data : final_data ,Code:200});
             }
           }
           }
        }).skip(+req.body.skip_count).limit(5).sort({updatedAt:-1});
});



router.post('/get_product_list_by_petlover', function (req, res) {
        petlover_order_groupModel.find({p_order_id:req.body.order_id},async function (err, StateList) {
        console.log("Response",StateList);
        var shipping_address = await shipping_addressModel.findOne({_id:"60797c16a20ca32d2668a30c"});
        // var shipping_address = await locationdetailsModel.findOne({_id:StateList[0].p_shipping_address});
        console.log(shipping_address);
           if(StateList.length == 0){
              res.json({Status:"Success",Message:"Petlover Product Grouped", Data : [] ,Code:200});
           } else {
           let temp_data = StateList[0].p_product_details;
           let final_data = [];
           for(let f = 0 ; f < temp_data.length; f++){
            let c = {
              product_id : temp_data[f].product_order_id,
              product_image : temp_data[f].product_detail.thumbnail_image || '',
              product_name : temp_data[f].product_detail.product_name,
              product_count : temp_data[f].product_count,
              product_price : temp_data[f].product_detail.cost,
              product_discount : temp_data[f].product_detail.discount,
              product_total_price :  temp_data[f].product_detail.cost * temp_data[f].product_count,
              product_total_discount : temp_data[f].product_detail.discount * temp_data[f].product_count,
              product_stauts : temp_data[f].product_status,
              product_booked : StateList[0].p_order_booked_on,
            }
            final_data.push(c);
             if(f == temp_data.length - 1)
             {
             let c = {
              order_details : {
                order_id : StateList[0].p_order_id,
                order_product : StateList[0].p_order_product_count,
                order_status : StateList[0].p_order_status,
                order_text : StateList[0].p_order_text,
                order_payment_id : StateList[0].p_payment_id,
                order_price : StateList[0].p_order_price,
                order_booked : StateList[0].p_order_booked_on,
                order_image : StateList[0].p_order_image,
                order_cancelled : StateList[0].p_cancelled_date,
                order_completed : StateList[0].p_completed_date,
                user_feedback : StateList[0].user_feedback,
                user_rate : StateList[0].user_rate,
               coupon_status : StateList[0].coupon_status,
               coupon_code : StateList[0].coupon_code,
               original_price : StateList[0].original_price,
               coupon_discount_price :StateList[0].coupon_discount_price,
               total_price : StateList[0].total_price,
              },
              shipping_address : shipping_address,
              product_details : final_data
             }
              res.json({Status:"Success",Message:"Petlover Product Grouped", Data : c ,Code:200});
             }
           }
           }
        });
});



router.post('/get_product_list_by_petlover1', function (req, res) {
        petlover_order_groupModel.find({p_order_id:req.body.order_id},async function (err, StateList) {
        console.log("Response",StateList);
        // var shipping_address = await shipping_addressModel.findOne({_id:"60797c16a20ca32d2668a30c"});
        var shipping_addresss = await locationdetailsModel.findOne({_id:StateList[0].p_shipping_address});
        var user_details = await userdetailsModel.findOne({_id:shipping_addresss.user_id});
        console.log(shipping_addresss);
        let ship_data = {
            location_title : shipping_addresss.location_title,
            shipping_location : shipping_addresss.location_address,
            land_mark : shipping_addresss.location_nickname,
            user_name : user_details.first_name + " " + user_details.last_name,
            user_phone : user_details.user_phone,
            user_lat : shipping_addresss.location_lat,
            user_long: shipping_addresss.location_long,
         }
         var shipping_address = ship_data;
           if(StateList.length == 0){
              res.json({Status:"Success",Message:"Petlover Product Grouped", Data : [] ,Code:200});
           } else {
           let temp_data = StateList[0].p_product_details;
           let final_data = [];
           for(let f = 0 ; f < temp_data.length; f++){
            let c = {
              product_id : temp_data[f].product_order_id,
              product_image : temp_data[f].product_detail.thumbnail_image || '',
              product_name : temp_data[f].product_detail.product_name,
              product_count : temp_data[f].product_count,
              product_price : temp_data[f].product_detail.cost,
              product_discount : temp_data[f].product_detail.discount,
              product_total_price :  temp_data[f].product_detail.cost * temp_data[f].product_count,
              product_total_discount : temp_data[f].product_detail.discount * temp_data[f].product_count,
              product_stauts : temp_data[f].product_status,
              product_booked : StateList[0].p_order_booked_on,
            }
            final_data.push(c);
             if(f == temp_data.length - 1)
             {
             let c = {
              order_details : {
                order_id : StateList[0].p_order_id,
                order_product : StateList[0].p_order_product_count,
                order_status : StateList[0].p_order_status,
                order_text : StateList[0].p_order_text,
                order_payment_id : StateList[0].p_payment_id,
                order_price : StateList[0].p_order_price,
                order_booked : StateList[0].p_order_booked_on,
                order_image : StateList[0].p_order_image,
                order_cancelled : StateList[0].p_cancelled_date,
                order_completed : StateList[0].p_completed_date,
                user_feedback : StateList[0].user_feedback,
                user_rate : StateList[0].user_rate,
               coupon_status : StateList[0].coupon_status,
               coupon_code : StateList[0].coupon_code,
               original_price : StateList[0].original_price,
               coupon_discount_price :StateList[0].coupon_discount_price,
               total_price : StateList[0].total_price,
              },
              shipping_address : shipping_address,
              product_details : final_data
             }
              res.json({Status:"Success",Message:"Petlover Product Grouped", Data : c ,Code:200});
             }
           }
           }
        });
});







router.post('/fetch_single_product_detail', function (req, res) {
        petlover_order_groupModel.find({p_order_id:req.body.order_id},async function (err, StateList) {
           if(StateList.length == 0){
              res.json({Status:"Success",Message:"Petlover single product detail", Data : [] ,Code:200});
           } else {
           // console.log("Response",StateList[0].p_product_details);
           let temp_data = StateList[0].p_product_details;
           let final_data = [];
           for(let f = 0 ; f < temp_data.length; f++){
            if(temp_data[f].product_order_id == req.body.product_order_id){
            let c = {
              product_id : temp_data[f].product_order_id,
              product_image : temp_data[f].product_detail.thumbnail_image || '',
              product_name : temp_data[f].product_detail.product_name,
              product_count : temp_data[f].product_count,
              product_price : temp_data[f].product_detail.cost,
              product_discount : temp_data[f].product_detail.discount,
              product_total_price :  temp_data[f].product_detail.cost * temp_data[f].product_count,
              product_total_discount : temp_data[f].product_detail.discount * temp_data[f].product_count,
              product_stauts : temp_data[f].product_status,
              product_booked : StateList[0].p_order_booked_on,
              prodcut_track_details : temp_data[f].prodcut_track_details,
            }
            final_data.push(c);
              res.json({Status:"Success",Message:"Petlover single product detail", Data : final_data[0] ,Code:200});
          }
           }
           }
        });
});




















router.get('/deletes', function (req, res) {
      petlover_order_groupModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"Demo screen  Deleted", Data : {} ,Code:200});     
      });
});

router.post('/getlist_id', function (req, res) {
        petlover_order_groupModel.find({Person_id:req.body.Person_id}, function (err, StateList) {
          res.json({Status:"Success",Message:"Demo screen  List", Data : StateList ,Code:200});
        });
});

router.post('/filter_date', function (req, res) {
        petlover_order_groupModel.find({}, function (err, StateList) {
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

router.get('/getlist', function (req, res) {
        petlover_order_groupModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Demo screen  Details", Data : Functiondetails ,Code:200});
        });
});

router.get('/mobile/getlist', function (req, res) {
        petlover_order_groupModel.find({show_status:true}, function (err, Functiondetails) {
          let a = {
            Demodata : Functiondetails
          }
          res.json({Status:"Success",Message:"Demo screen Details", Data : a ,Code:200});
        });
});

router.post('/edit', function (req, res) {
        petlover_order_groupModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Demo screen  Updated", Data : UpdatedDetails ,Code:200});
        });
});

router.post('/delete', function (req, res) {
 let c = {
    delete_status : true
  }
  petlover_order_groupModel.findByIdAndUpdate(req.body._id, c, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Location Deleted successfully", Data : UpdatedDetails ,Code:200});
  });
});

//// DELETES A USER FROM THE DATABASE
router.post('/admin_delete', function (req, res) {
      petlover_order_groupModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Demo screen Deleted successfully", Data : {} ,Code:200});
      });
});


module.exports = router;
