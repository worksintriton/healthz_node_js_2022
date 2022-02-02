var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var vendor_order_groupModel = require('./../models/vendor_order_groupModel');
var petlover_order_groupModel = require('./../models/petlover_order_groupModel');
var shipping_addressModel = require('./../models/shipping_addressModel');
var product_detailsModel = require('./../models/product_detailsModel');
var product_rate_reviewModel = require('./../models/product_rate_reviewModel');
var request = require("request");
var userdetailsModel = require('./../models/userdetailsModel');
var product_vendorModel = require('./../models/product_vendorModel');


router.post('/create', async function(req, res) {
  try{
        await vendor_order_groupModel.create({
            v_order_id : req.body.v_order_id,
            v_user_id : req.body.v_user_id,
            v_shipping_address : req.body.v_shipping_address,
            v_payment_id : req.body.v_payment_id,
            v_vendor_id :req.body.vendor_id,
            v_product_details : req.body.v_product_details,
            v_order_product_count :req.body.v_order_product_count,
            v_order_price :req.body.v_order_price,
            v_order_image : req.body.v_order_image,
            v_order_booked_on : req.body.v_order_booked_on,
            v_order_status : req.body.v_order_status,
            v_order_text : req.body.v_order_text,
        }, 
        function (err, user) {
        res.json({Status:"Success",Message:"Demo screen Added successfully", Data : user ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});



router.post('/get_grouped_order_by_vendor', function (req, res) {
        req.body.skip_count = req.body.skip_count - 1 ;
        req.body.skip_count = req.body.skip_count * 5 ;
        // var product_list = await product_detailsModel.find({cat_id:req.body.cat_id}).skip(+req.body.skip_count).limit(5);
        vendor_order_groupModel.find({v_vendor_id:req.body.vendor_id,v_order_status:req.body.order_status}, function (err, StateList) {
           if(StateList.length == 0){
              res.json({Status:"Success",Message:"Vendor Order Grouped", Data : [] ,Code:200});
           } else {
           let final_data = [];
           for(let f = 0 ; f < StateList.length; f++){
             let c = {
            v_order_id : StateList[f].v_order_id,
            v_user_id : StateList[f].v_user_id,
            v_shipping_address : StateList[f].v_shipping_address,
            v_payment_id : StateList[f].v_payment_id,
            v_vendor_id : StateList[f].v_vendor_id,
            v_order_product_count :StateList[f].v_order_product_count,
            v_order_price : StateList[f].v_order_price,
            v_order_image : StateList[f].v_order_image,
            v_order_booked_on : StateList[f].v_order_booked_on,
            v_order_status : StateList[f].v_order_status,
            v_order_text : StateList[f].v_order_text,
            v_order_status : StateList[f].v_order_status || "",
            v_cancelled_date : StateList[f].v_cancelled_date,
            v_completed_date : StateList[f].v_completed_date,
            v_user_feedback : StateList[f].v_user_feedback,
            v_user_rate : StateList[f].v_user_rate,
             }
             final_data.push(c);
             if(f == StateList.length - 1)
             {
              res.json({Status:"Success",Message:"Vendor Order Grouped", Data : final_data ,Code:200});
             }
           }
           }
        }).skip(+req.body.skip_count).limit(5).sort({updatedAt:-1});
});



router.post('/get_product_list_by_vendor', function (req, res) {
        vendor_order_groupModel.find({v_order_id:req.body.order_id,v_vendor_id:req.body.vendor_id},async function (err, StateList) {
        var shipping_address = await shipping_addressModel.findOne({_id:"60797c16a20ca32d2668a30c"});
           if(StateList.length == 0){
              res.json({Status:"Success",Message:"Vendor Product Grouped", Data : [] ,Code:200});
           } else {
           let temp_data = StateList[0].v_product_details;
           let final_data = [];
           for(let f = 0 ; f < temp_data.length; f++){
            let c = {
              product_id : temp_data[f].product_order_id,
              product_image : temp_data[f].product_detail.product_img[0],
              product_name : temp_data[f].product_detail.product_name,
              product_count : temp_data[f].product_count,
              product_price : temp_data[f].product_detail.cost,
              product_discount : temp_data[f].product_detail.discount,
              product_total_price :  temp_data[f].product_detail.cost * temp_data[f].product_count,
              product_total_discount : temp_data[f].product_detail.discount * temp_data[f].product_count,
              product_stauts : temp_data[f].product_status,
              product_booked : StateList[0].v_order_booked_on,
            }
            final_data.push(c);
             if(f == temp_data.length - 1)
             {
             let c = {
              order_details : {
                order_id : StateList[0].v_order_id,
                order_product : StateList[0].v_order_product_count,
                order_status : StateList[0].v_order_status,
                order_text : StateList[0].v_order_text,
                order_payment_id : StateList[0].v_payment_id,
                order_price : StateList[0].v_order_price,
                order_booked : StateList[0].v_order_booked_on,
                order_image : StateList[0].v_order_image,
                order_cancelled : StateList[0].v_cancelled_date || "",
                order_completed : StateList[0].v_completed_date || "",
                user_feedback : StateList[0].v_completed_date,
                user_rate : StateList[0].v_user_feedback,
              },
              shipping_address : shipping_address,
              product_details : final_data
             }
              res.json({Status:"Success",Message:"Vendor Product Grouped", Data : c ,Code:200});
             }
           }
           }
        });
});








router.post('/fetch_single_product_detail', function (req, res) {
        vendor_order_groupModel.find({v_order_id:req.body.order_id,v_vendor_id:req.body.vendor_id},async function (err, StateList) {
           if(StateList.length == 0){
              res.json({Status:"Success",Message:"Vendor single product detail", Data : [] ,Code:200});
           } else {
           let temp_data = StateList[0].v_product_details;
           let final_data = [];
           for(let f = 0 ; f < temp_data.length; f++){
            if(temp_data[f].product_order_id == req.body.product_order_id){
            let c = {
              product_id : temp_data[f].product_order_id,
              product_image : temp_data[f].product_detail.product_img[0],
              product_name : temp_data[f].product_detail.product_name,
              product_count : temp_data[f].product_count,
              product_price : temp_data[f].product_detail.cost,
              product_discount : temp_data[f].product_detail.discount,
              product_total_price :  temp_data[f].product_detail.cost * temp_data[f].product_count,
              product_total_discount : temp_data[f].product_detail.discount * temp_data[f].product_count,
              product_stauts : temp_data[f].product_status,
              product_booked : StateList[0].v_order_booked_on,
              prodcut_track_details : temp_data[f].prodcut_track_details,
            }
            final_data.push(c);
              res.json({Status:"Success",Message:"Vendor single product detail", Data : final_data[0] ,Code:200});
          }
           }
           }
        });
});




router.post('/update_vendor_status1',async function (req, res) {
  var vendor_order_details = await vendor_order_groupModel.findOne({v_order_id:req.body.order_id,v_vendor_id:req.body.vendor_id});
  var petlover_order_details = await petlover_order_groupModel.findOne({p_order_id:req.body.order_id});
for(let r = 0 ; r < req.body.product_id.length ; r ++){
    let ven_temp_data = vendor_order_details.v_product_details;
    for(let a  = 0 ; a < ven_temp_data.length ; a ++){
      if(ven_temp_data[a].product_order_id == req.body.product_id[r]){
        ven_temp_data[a].product_status = "Order Accept";
        ven_temp_data[a].prodcut_track_details[1].date = req.body.date;
        ven_temp_data[a].prodcut_track_details[1].Status = true;
        ven_temp_data[a].prodcut_track_details[1].text = "Vendor Accept the order";
      }
    }
    let pet_temp_data = petlover_order_details.p_product_details;
    for(let a  = 0 ; a < pet_temp_data.length ; a ++){
      if(pet_temp_data[a].product_order_id == req.body.product_id[r]){
        pet_temp_data[a].product_status = "Order Accept";
        pet_temp_data[a].prodcut_track_details[1].date = req.body.date;
        pet_temp_data[a].prodcut_track_details[1].Status = true;
        pet_temp_data[a].prodcut_track_details[1].text = "Vendor Accept the order";
      }
    }
    // console.log("Good2",ven_temp_data);

    // res.json({Status:"Success",Message:"Vendor multi product detail update", Data : ven_temp_data,Code:200});

    vendor_order_details.v_product_details = ven_temp_data;

    petlover_order_details.p_product_details = pet_temp_data;
    let c = {
      _id : vendor_order_details._id,
      v_product_details : vendor_order_details.v_product_details
     }
     let d = {
      _id : petlover_order_details._id,
      p_product_details : petlover_order_details.p_product_details
     }
     // console.log("GOOD1",vendor_order_details.v_product_details);
     vendor_order_groupModel.findByIdAndUpdate(c._id, c, {new: true},async function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
     petlover_order_groupModel.findByIdAndUpdate(d._id, d, {new: true},async function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
    
     });
     });
if(r == req.body.product_id.length - 1){
var params = {"order_id":req.body.order_id,"status" : "New",v_vendor_id:req.body.vendor_id , "date" : req.body.date }
  request.post(
    'http://35.164.43.170:3000/api/vendor_order_group/check_order_status',
    { json: params },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
        }
    }
);
  res.json({Status:"Success",Message:"Vendor multi product detail update", Data : {},Code:200});
}
}
});




router.post('/update_vendor_status2',async function (req, res) {
  var vendor_order_details = await vendor_order_groupModel.findOne({v_order_id:req.body.order_id,v_vendor_id:req.body.vendor_id});
  var petlover_order_details = await petlover_order_groupModel.findOne({p_order_id:req.body.order_id});
for(let r = 0 ; r < req.body.product_id.length ; r ++){
    let ven_temp_data = vendor_order_details.v_product_details;
    for(let a  = 0 ; a < ven_temp_data.length ; a ++){
      if(ven_temp_data[a].product_order_id == req.body.product_id[r]){
        ven_temp_data[a].product_status = "Order Dispatch";
        ven_temp_data[a].prodcut_track_details[2].date = req.body.date;
        ven_temp_data[a].prodcut_track_details[2].Status = true;
        ven_temp_data[a].prodcut_track_details[2].text = req.body.track_id;
        ven_temp_data[a].prodcut_track_details[3].date = req.body.date;
        ven_temp_data[a].prodcut_track_details[3].Status = true;
        ven_temp_data[a].prodcut_track_details[3].text = "Vendor Dispatch the order";

      }
    }
    let pet_temp_data = petlover_order_details.p_product_details;
    for(let a  = 0 ; a < pet_temp_data.length ; a ++){
      if(pet_temp_data[a].product_order_id == req.body.product_id[r]){
        pet_temp_data[a].product_status = "Order Dispatch";
        pet_temp_data[a].prodcut_track_details[2].date = req.body.date;
        pet_temp_data[a].prodcut_track_details[2].Status = true;
        pet_temp_data[a].prodcut_track_details[2].text = req.body.track_id;

        pet_temp_data[a].prodcut_track_details[3].date = req.body.date;
        pet_temp_data[a].prodcut_track_details[3].Status = true;
        pet_temp_data[a].prodcut_track_details[3].text = "Vendor Dispatch the order";

      }
    }
    vendor_order_details.v_product_details = ven_temp_data;
    petlover_order_details.p_product_details = pet_temp_data;
    let c = {
      _id : vendor_order_details._id,
      v_completed_date : req.body.date,
      v_product_details : vendor_order_details.v_product_details
     }
     let d = {
      _id : petlover_order_details._id,
      p_completed_date : req.body.date,
      p_product_details : petlover_order_details.p_product_details
     }
     vendor_order_groupModel.findByIdAndUpdate(c._id, c, {new: true},async function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
     petlover_order_groupModel.findByIdAndUpdate(d._id, d, {new: true},async function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
     });
     });
if(r == req.body.product_id.length - 1){

  var params = {"order_id":req.body.order_id,"status" : "New",v_vendor_id:req.body.vendor_id , "date" : req.body.date }
  request.post(
    'http://35.164.43.170:3000/api/vendor_order_group/check_order_status',
    { json: params },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
        }
    }
);


  res.json({Status:"Success",Message:"Vendor multi product detail update", Data : {},Code:200});
}
}
});





router.post('/update_vendor_status3',async function (req, res) {
  var vendor_order_details = await vendor_order_groupModel.findOne({v_order_id:req.body.order_id,v_vendor_id:req.body.vendor_id});
  var petlover_order_details = await petlover_order_groupModel.findOne({p_order_id:req.body.order_id});
for(let r = 0 ; r < req.body.product_id.length ; r ++){
    let ven_temp_data = vendor_order_details.v_product_details;
    for(let a  = 0 ; a < ven_temp_data.length ; a ++){
      if(ven_temp_data[a].product_order_id == req.body.product_id[r]){
        ven_temp_data[a].product_status = "Vendor cancelled";
        ven_temp_data[a].prodcut_track_details[5].date = req.body.date;
        ven_temp_data[a].prodcut_track_details[5].Status = true;
        ven_temp_data[a].prodcut_track_details[5].text = req.body.reject_reason;
      }
    }
    let pet_temp_data = petlover_order_details.p_product_details;
    for(let a  = 0 ; a < pet_temp_data.length ; a ++){
      if(pet_temp_data[a].product_order_id == req.body.product_id[r]){
        pet_temp_data[a].product_status = "Vendor cancelled";
        pet_temp_data[a].prodcut_track_details[5].date = req.body.date;
        pet_temp_data[a].prodcut_track_details[5].Status = true;
        pet_temp_data[a].prodcut_track_details[5].text = req.body.reject_reason;
      }
    }
    vendor_order_details.v_product_details = ven_temp_data;
    petlover_order_details.p_product_details = pet_temp_data;
    let c = {
      _id : vendor_order_details._id,
      v_cancelled_date : req.body.date,
      v_product_details : vendor_order_details.v_product_details
     }
     let d = {
      _id : petlover_order_details._id,
      p_cancelled_date : req.body.date,
      p_product_details : petlover_order_details.p_product_details
     }
     vendor_order_groupModel.findByIdAndUpdate(c._id, c, {new: true},async function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
     petlover_order_groupModel.findByIdAndUpdate(d._id, d, {new: true},async function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});    
     });
     });
if(r == req.body.product_id.length - 1){
  var params = {"order_id":req.body.order_id,"status" : "New",v_vendor_id:req.body.vendor_id , "date" : req.body.date }
  request.post(
    'http://35.164.43.170:3000/api/vendor_order_group/check_order_status',
    { json: params },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
        }
    }
);
  res.json({Status:"Success",Message:"Vendor multi product detail update", Data : {},Code:200});
}
}
});




router.post('/update_vendor_status4',async function (req, res) {

   var temp_datasss = await vendor_order_groupModel.find({v_order_id:req.body.order_id});
   for(let p = 0 ;  p < temp_datasss.length ; p++){
  var vendor_order_details = await vendor_order_groupModel.findOne({v_vendor_id:temp_datasss[p].v_vendor_id,v_order_id:req.body.order_id});
  var petlover_order_details = await petlover_order_groupModel.findOne({p_order_id:req.body.order_id});
  for(let r = 0 ; r < req.body.product_id.length ; r ++){
    let ven_temp_data = vendor_order_details.v_product_details;
    for(let a  = 0 ; a < ven_temp_data.length ; a ++){
      if(ven_temp_data[a].product_order_id == req.body.product_id[r]){
        ven_temp_data[a].product_status = "Order Cancelled";
        ven_temp_data[a].prodcut_track_details[4].date = req.body.date;
        ven_temp_data[a].prodcut_track_details[4].Status = true;
        ven_temp_data[a].prodcut_track_details[4].text = req.body.reject_reason;
      }
    }
    let pet_temp_data = petlover_order_details.p_product_details;
    for(let a  = 0 ; a < pet_temp_data.length ; a ++){
      if(pet_temp_data[a].product_order_id == req.body.product_id[r]){
        pet_temp_data[a].product_status = "Order Cancelled";
        pet_temp_data[a].prodcut_track_details[4].date = req.body.date;
        pet_temp_data[a].prodcut_track_details[4].Status = true;
        pet_temp_data[a].prodcut_track_details[4].text = req.body.reject_reason;
      }
    }
    vendor_order_details.v_product_details = ven_temp_data;
    petlover_order_details.p_product_details = pet_temp_data;
    let c = {
      _id : vendor_order_details._id,
      v_cancelled_date : req.body.date,
      v_order_status: "Cancelled",
      v_product_details : vendor_order_details.v_product_details
     }
     let d = {
      _id : petlover_order_details._id,
      p_cancelled_date : req.body.date,
      p_order_status: "Cancelled",
      p_product_details : petlover_order_details.p_product_details
     }
     vendor_order_groupModel.findByIdAndUpdate(c._id, c, {new: true},async function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
     petlover_order_groupModel.findByIdAndUpdate(d._id, d, {new: true},async function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
    
     });
     });
if(r == req.body.product_id.length - 1){

  var params = {"order_id":req.body.order_id,"status" : "New", v_vendor_id:temp_datasss[p].v_vendor_id , "date" : req.body.date }
  request.post(
    'http://35.164.43.170:3000/api/vendor_order_group/check_order_status',
    { json: params },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
        }
    }
);
}
}
if(p == temp_datasss.length - 1){
  res.json({Status:"Success",Message:"Petlover multi product detail update", Data : {},Code:200});
}
}
});



router.post('/update_vendor_status5',async function (req, res) {
   var temp_datasss = await vendor_order_groupModel.find({v_order_id:req.body.order_id});
   for(let p = 0 ;  p < temp_datasss.length ; p++){
  var vendor_order_details = await vendor_order_groupModel.findOne({v_vendor_id:temp_datasss[p].v_vendor_id,v_order_id:req.body.order_id});
  var petlover_order_details = await petlover_order_groupModel.findOne({p_order_id:req.body.order_id});
    let ven_temp_data = vendor_order_details.v_product_details;
    for(let a  = 0 ; a < ven_temp_data.length ; a ++){
      if(ven_temp_data[a].product_order_id == req.body.product_id){
        ven_temp_data[a].product_status = "Order Cancelled";
        ven_temp_data[a].prodcut_track_details[4].date = req.body.date;
        ven_temp_data[a].prodcut_track_details[4].Status = true;
        ven_temp_data[a].prodcut_track_details[4].text = req.body.reject_reason || "";
      }
    }
    let pet_temp_data = petlover_order_details.p_product_details;
    for(let a  = 0 ; a < pet_temp_data.length ; a ++){
      if(pet_temp_data[a].product_order_id == req.body.product_id){
        pet_temp_data[a].product_status = "Order Cancelled";
        pet_temp_data[a].prodcut_track_details[4].date = req.body.date;
        pet_temp_data[a].prodcut_track_details[4].Status = true;
        pet_temp_data[a].prodcut_track_details[4].text = req.body.reject_reason || "";
      }
    }
    vendor_order_details.v_product_details = ven_temp_data;
    petlover_order_details.p_product_details = pet_temp_data;
    let c = {
      _id : vendor_order_details._id,
      v_cancelled_date : req.body.date,
      v_product_details : vendor_order_details.v_product_details
     }
     let d = {
      _id : petlover_order_details._id,
      p_cancelled_date : req.body.date,
      p_product_details : petlover_order_details.p_product_details
     }
     vendor_order_groupModel.findByIdAndUpdate(c._id, c, {new: true},async function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
     petlover_order_groupModel.findByIdAndUpdate(d._id, d, {new: true},async function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});

var params = {"order_id":req.body.order_id,"status" : "New",v_vendor_id:temp_datasss[p].v_vendor_id , "date" : req.body.date }
  request.post(
    'http://35.164.43.170:3000/api/vendor_order_group/check_order_status',
    { json: params },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
        }
    }
);
              // res.json({Status:"Success",Message:" single product detail update", Data : {},Code:200});
     });
     });
if(p == temp_datasss.length - 1){
  res.json({Status:"Success",Message:"Petlover multi product detail update", Data : {},Code:200});
}
   }
});



router.post('/check_order_status',async function (req, res) {
  var vendor_order_details = await vendor_order_groupModel.findOne({v_order_id:req.body.order_id,v_vendor_id:req.body.v_vendor_id});
  var petlover_order_details = await petlover_order_groupModel.findOne({p_order_id:req.body.order_id});
  let product_count = vendor_order_details.v_product_details.length;
  let temp_cancel_count = 0;
  let temp_dispatch_count = 0;
  let temp_order_book_count = 0;
  let product_details_temp = vendor_order_details.v_product_details;
  for(let a = 0 ; a < product_details_temp.length; a ++) {
    if(product_details_temp[a].product_status == 'Order Dispatch'){
        temp_dispatch_count = temp_dispatch_count + 1;
    }
    if(product_details_temp[a].product_status == 'Order Cancelled' || product_details_temp[a].product_status == 'Vendor cancelled'){
        temp_cancel_count = temp_cancel_count + 1;
    }
    if(product_details_temp[a].product_status == 'Order Booked'){
        temp_order_book_count = temp_order_book_count + 1;
    }
    if(a == product_details_temp.length - 1){
      let status = "New";
      let dates = "";
      if(temp_order_book_count == 0 && product_count ==  temp_dispatch_count+temp_cancel_count){
          status = "Complete";
      }
      if(temp_order_book_count !== 0){
         status = "New"
      }
      if(temp_order_book_count == 0 && temp_cancel_count == product_count && temp_dispatch_count == 0){
         status = "Cancelled"
      }
      let d = {
      _id : vendor_order_details._id,
      v_order_status : status
     }
      vendor_order_groupModel.findByIdAndUpdate(d._id, d, {new: true},async function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
              // res.json({Status:"Success",Message:"Vendor product detail update", Data : {},Code:200});
            console.log("Update Status",UpdatedDetails);
            var product_detail = await product_vendorModel.findOne({_id:UpdatedDetails.v_vendor_id});
            var user_token = await userdetailsModel.findOne({_id:product_detail.user_id});
            let status = '';
            if(UpdatedDetails.v_order_status == "New"){
              status = "New";
            }else if(UpdatedDetails.v_order_status == "Cancelled"){
              status = "Cancelled";
            }else if(UpdatedDetails.v_order_status == "Complete"){
              status = "Completed";
            }
            console.log("Status",status);
            var params = {
            "user_id":  user_token._id,
            "notify_title" : "Order Status Updated",
            "notify_descri" : "Your " + UpdatedDetails.v_order_id + " has be update check the status" ,
            "notify_img" : "",
            "notify_time" : "",
            "date_and_time" : req.body.date || "",
            "user_token" : user_token.fb_token,
            "data_type" : {
            "usertype":"3",
            "appintments":"",
            "orders":status
             }
             }
     request.post(
     'http://35.164.43.170:3000/api/notification/send_notifiation',
     { json: params },
     function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // console.log(body);
        }
     }
     );
     });
       product_count = petlover_order_details.p_product_details.length;
       temp_cancel_count = 0;
       temp_dispatch_count = 0;
       temp_order_book_count = 0;
       let product_details_temp = petlover_order_details.p_product_details;
       for(let b = 0; b < product_details_temp.length ; b++){
        if(product_details_temp[b].product_status == 'Order Dispatch'){
        temp_dispatch_count = temp_dispatch_count + 1;
        }
        if(product_details_temp[b].product_status == 'Order Cancelled' || product_details_temp[b].product_status == 'Vendor cancelled'){
        temp_cancel_count = temp_cancel_count + 1;
        }
        if(product_details_temp[b].product_status == 'Order Booked'){
        temp_order_book_count = temp_order_book_count + 1;
        }
        if(b == product_details_temp.length - 1){
          let status = "New";
          if(temp_order_book_count == 0 && product_count ==  temp_dispatch_count+temp_cancel_count){
          status = "Complete"
         }
        if(temp_order_book_count !== 0){
         status = "New"
        }
         if(temp_order_book_count == 0 && temp_cancel_count == product_count && temp_dispatch_count == 0){
         status = "Cancelled"
       }
           let e = {
          _id : petlover_order_details._id,
          p_order_status : status
          }
         petlover_order_groupModel.findByIdAndUpdate(e._id, e, {new: true},async function (err, UpdatedDetails) {
           if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});


            let status = '';
            if(UpdatedDetails.p_order_status == "New"){
              status = "New";
            }else if(UpdatedDetails.p_order_status == "Cancelled"){
              status = "Cancelled";
            }else if(UpdatedDetails.p_order_status == "Complete"){
              status = "Completed";
            }
            var user_token = await userdetailsModel.findOne({_id:UpdatedDetails.p_user_id});
            console.log(user_token);
            var params = {
            "user_id":  user_token._id,
            "notify_title" : "Order Status Updated",
            "notify_descri" : "Your " + UpdatedDetails.p_order_id + " has be update check the status" ,
            "notify_img" : "",
            "notify_time" : "",
            "date_and_time" : req.body.date || "",
            "user_token" : user_token.fb_token,
            "data_type" : {
            "usertype":""+user_token.user_type,
            "appintments":"",
            "orders":status
             }
             }
     request.post(
     'http://35.164.43.170:3000/api/notification/send_notifiation',
     { json: params },
     function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // console.log(body);
        }
     }
     );
              // res.json({Status:"Success",Message:"Petlover product detail update", Data : {},Code:200});    
         });
        }
       }
    }
  }
});













router.post('/update_rating_review',async function (req, res) {
  var vendor_order_details = await vendor_order_groupModel.findOne({v_order_id:req.body.order_id});
  var petlover_order_details = await petlover_order_groupModel.findOne({p_order_id:req.body.order_id}); 
  // console.log("vendor_order_details",vendor_order_details);
   let a = {
        v_user_feedback: req.body.user_feedback,
        v_user_rate: +req.body.user_rate,
   }
  vendor_order_groupModel.findByIdAndUpdate(vendor_order_details._id, a, {new: true},async function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
              // res.json({Status:"Success",Message:"Petlover product detail update", Data : {},Code:200});
  });
  let b = {
        p_user_feedback: req.body.user_feedback,
        p_user_rate: +req.body.user_rate,
   }
   petlover_order_groupModel.findByIdAndUpdate(petlover_order_details._id, b, {new: true},async function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
              // res.json({Status:"Success",Message:"Petlover product detail update", Data : {},Code:200});    
  });
   let temp_data = petlover_order_details.p_product_details;
   for(let c = 0; c < temp_data.length ; c ++){
        // console.log('Order Details',order_details);
        var product_detail = await product_detailsModel.findOne({_id:temp_data[c].product_detail._id});
        // console.log('Product Details',product_detail);
          await product_rate_reviewModel.create({
            user_id:  petlover_order_details.p_user_id,
            product_id : temp_data[c].product_detail._id,
            reviews : req.body.user_feedback,
            rating : req.body.user_rate
        },async function (err, user) {
        var test_rat_count = 0; 
        var final_rat_count = 0;
        var review_details = await product_rate_reviewModel.find({product_id:temp_data[c].product_detail._id});
        for(let a = 0 ; a < review_details.length ; a++) {
            test_rat_count = +review_details[a].rating + test_rat_count;
        }
        var final_rat_count = +test_rat_count / review_details.length;
        let d = {
        user_feedback : req.body.user_feedback,
        user_rate : req.body.user_rate,
        } 
        let a = {
          product_rating :  final_rat_count.toFixed(1),
          product_review :  review_details.length,
        }
        product_detailsModel.findByIdAndUpdate(temp_data[c].product_detail._id, a, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             // res.json({Status:"Success",Message:"Docotor Details Updated", Data : UpdatedDetails ,Code:200});
        });
      }); 
          if(c == temp_data.length - 1){
            res.json({Status:"Success",Message:"Feedback updated successfully", Data : {} ,Code:200});
          }
   }
});











router.get('/deletes', function (req, res) {
      vendor_order_groupModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"Demo screen  Deleted", Data : {} ,Code:200});     
      });
});

router.post('/getlist_id', function (req, res) {
        vendor_order_groupModel.find({Person_id:req.body.Person_id}, function (err, StateList) {
          res.json({Status:"Success",Message:"Demo screen  List", Data : StateList ,Code:200});
        });
});

router.post('/filter_date', function (req, res) {
        vendor_order_groupModel.find({}, function (err, StateList) {
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
        vendor_order_groupModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Demo screen  Details", Data : Functiondetails ,Code:200});
        });
});

router.get('/mobile/getlist', function (req, res) {
        vendor_order_groupModel.find({show_status:true}, function (err, Functiondetails) {
          let a = {
            Demodata : Functiondetails
          }
          res.json({Status:"Success",Message:"Demo screen Details", Data : a ,Code:200});
        });
});

router.post('/edit', function (req, res) {
        vendor_order_groupModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Demo screen  Updated", Data : UpdatedDetails ,Code:200});
        });
});

router.post('/delete', function (req, res) {
 let c = {
    delete_status : true
  }
  vendor_order_groupModel.findByIdAndUpdate(req.body._id, c, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Location Deleted successfully", Data : UpdatedDetails ,Code:200});
  });
});

//// DELETES A USER FROM THE DATABASE
router.post('/admin_delete', function (req, res) {
      vendor_order_groupModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Demo screen Deleted successfully", Data : {} ,Code:200});
      });
});


module.exports = router;
