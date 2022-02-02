var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var vendor_order_bookingModel = require('./../models/vendor_order_bookingModel');
var product_cart_detailsModel = require('./../models/product_cart_detailsModel');
var shipping_addressModel = require('./../models/shipping_addressModel');
var product_detailsModel = require('./../models/product_detailsModel');

var userdetailsModel = require('./../models/userdetailsModel');
var vendor_order_groupModel = require('./../models/vendor_order_groupModel');
var petlover_order_groupModel = require('./../models/petlover_order_groupModel');
var product_vendorModel = require('./../models/product_vendorModel');
var refund_couponModel = require('./../models/refund_couponModel');


var request = require("request");


// router.post('/create', async function(req, res) {
//   try{
//     let Appointmentid = "ITEM-" + new Date().getTime();
//     for(let a  = 0 ; a < req.body.Data.length ; a ++){
//         var product_temp = req.body.Data[a];
//             var params = {
//             "user_id":  req.body.user_id,
//             "order_id" : Appointmentid,
//             "product_data" : [product_temp],
//             "product_quantity" : product_temp.product_count,
//             "date_of_booking" : req.body.date_of_booking,
//             "delivery_date" : "",
//             "date_of_booking_display" : "",
//             "delivery_date_display" :  "",
//             "order_status" :  "Booked",
//             "mobile_type" : req.body.mobile_type,
//             "prodouct_total" :  product_temp.product_count * product_temp.product_id.cost,
//             "shipping_charge" :  req.body.shipping_charge,
//             "discount_price" :  req.body.discount_price,
//             "grand_total" :  0,
//               }
//             request.post(
//                 'http://35.164.43.170:3000/api/vendor_order_detail/create',
//                 { json: params },
//                 function (error, response, body) {
//                     if (!error && response.statusCode == 200) {
//                     }
//                 }
//             );
//           }
//           console.log(req.body.Data);
//         await vendor_order_bookingModel.create({
//             user_id:  req.body.user_id,
//             order_id : Appointmentid,
//             product_data : req.body.Data,
//             product_quantity : req.body.product_quantity,
//             date_of_booking : req.body.date_of_booking,
//             delivery_date : "",
//             date_of_booking_display : "",
//             delivery_date_display :  "",
//             order_status :  "Booked",
//             mobile_type : req.body.mobile_type,
//             prodouct_total :  req.body.prodouct_total,
//             shipping_charge :  req.body.shipping_charge,
//             discount_price :  req.body.discount_price,
//             grand_total :  req.body.grand_total,
//             delete_status : false
//         }, 
//         function (err, user) {
//           // console.log(user)
//         res.json({Status:"Success",Message:"Demo screen Added successfully", Data : user ,Code:200}); 
//         });
// }
// catch(e){
//       res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
// }
// });




router.post('/create', async function(req, res) {
  try{
    console.log("********Order Booking Req**********",req.body);
     var shipping_address_text = "";
     var shipping_details = await shipping_addressModel.findOne({user_id:req.body.user_id,user_address_stauts:"Last Used"});
     if(shipping_details == null){
      shipping_address_text  = ""
     }else{  
      shipping_address_text  = "No :"+shipping_details.user_flat_no + ", " +shipping_details.user_stree+", "+shipping_details.user_city+", "+shipping_details.user_state+", "+"ZIP CODE - "+shipping_details.user_picocode;
     }
    let Appointmentid = "ITEM-" + new Date().getTime();
    for(let a  = 0 ; a < req.body.Data.length ; a ++){
        let product_details = req.body.Data[a].product_id;
        // console.log(req.body.user_id,product_details._id);
        var outofstackdata = await product_detailsModel.findOne({_id:product_details._id});
        console.log("Outofstackdata",outofstackdata);
        let stock_count    =   +outofstackdata.threshould - +req.body.Data[a].product_count;
        var update_product_details = await product_detailsModel.findByIdAndUpdate({_id:outofstackdata._id},{threshould: ""+stock_count},{new: true});
        console.log("Quantity Count",update_product_details);
        var product_detailsss = await product_cart_detailsModel.findOne({user_id :req.body.user_id,product_id:product_details._id});
        // console.log(product_detailsss);
        if(product_detailsss != null){
          var deleted = await product_cart_detailsModel.findByIdAndRemove({_id:product_detailsss._id});
        }
        // console.log(req.body.Data);
        await vendor_order_bookingModel.create({
            user_id:  req.body.user_id,
            order_id : Appointmentid,
            vendor_id : product_details.user_id,
            product_id : product_details._id,
            product_data : [req.body.Data[a]],
            product_quantity : req.body.Data[a].product_count,
            prodcut_track_details:[
            {"id": 0,"title" : "Order Booked","date" : req.body.date_of_booking_display, "text" : "", "Status" :  true},
            {"id": 1,"title" : "Order Accept","date" : '',  "text" : "", "Status" :  false },
            {"id": 2,"title" : "Order Dispatch","date" : '',  "text" : "", "Status" :  false},
            {"id": 3,"title" : "In Transit","date" : '',  "text" : "", "Status" :  false},
            {"id": 4,"title" : "Order Cancelled","date" : '',  "text" : "", "Status" :  false},
            {"id": 5,"title" : "Vendor cancelled","date" : '',  "text" : "", "Status" :  false}
            ],
            date_of_booking : req.body.date_of_booking,
            delivery_date : "",
            date_of_booking_display : req.body.date_of_booking_display,
            delivery_date_display :  "",
            order_status :  "New",
            mobile_type : req.body.mobile_type,
            prodouct_total :   product_details.cost *  req.body.Data[a].product_count,
            shipping_address_id : req.body.shipping_address_id || "",
            billling_address_id :  req.body.billling_address_id || "", 
            shipping_address :  req.body.shipping_address|| "",
            billing_address :  req.body.billing_address|| "",
            shipping_charge  : req.body.shipping_charge,
            over_all_total : req.body.prodouct_total,
            discount_price : req.body.discount_price,
            grand_total : req.body.grand_total,
            coupon_code : req.body.coupon_code,
            delete_status : false,
            user_cancell_info : "",
            user_cancell_date : "",
            user_return_info : "",
            user_return_date : "",
            user_return_pic : "",
            vendor_cancell_info : "",
            vendor_cancell_date : "",
            vendor_accept_cancel : "",
            vendor_accept_cancel_date : "",
            vendor_cancel_return_date :  "",
            vendor_cancel_retune_info : "",
            vendor_complete_date : "",
            vendor_complete_info : "",
            payment_id : req.body.payment_id,
            shipping_details_id:   req.body.shipping_details_id,
            shipping_details : shipping_address_text,
            user_rate : "0",
            user_feedback : "",
        },async function (err, user) {

        });
        if(a == req.body.Data.length - 1){
          // console.log(Appointmentid,req.body.prodouct_total,req.body.discount_price,req.body.grand_total,req.body.date_of_booking_display);
          let c = {
            "Booking_id" : Appointmentid,
            "prodouct_total" : req.body.prodouct_total,
            "discount_price" : req.body.discount_price,
            "grand_total" : req.body.grand_total,
            "date_of_booking_display" : req.body.date_of_booking_display
          }
        // console.log("respose Send", c);
        res.json({Status:"Success",Message:"Order Booked successfully", Data : c ,Code:200});
        }
        } 
}
catch(e){
      console.log("error",e);
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});





router.post('/get_order_details_user_id', function (req, res) {
        vendor_order_bookingModel.find({user_id:req.body.user_id, order_status : req.body.order_status}, function (err, StateList) {
           console.log(req.body);
            // StateList.sort(function compare(a, b) {
            //    var dateA = new Date(a.updatedAt);
            //    var dateB = new Date(b.updatedAt);
            //    console.log(dateA,dateB);
            //    return dateB - dateA;
            //    });
         if(StateList.length == 0){
              res.json({Status:"Success",Message:"No Data Found", Data : [],Code:200});
         }else{
          var final_data = [];
        for(let a = 0 ; a < StateList.length;a ++){
           let c = {
               _id : StateList[a]._id,
               order_id : StateList[a].order_id,
               product_name :  StateList[a].product_data[0].product_id.product_name,
               product_quantity : StateList[a].product_quantity,
               product_price :  StateList[a].prodouct_total,
               prodcut_image : StateList[a].product_data[0].product_id.product_img[0],
               date_of_booking : StateList[a].date_of_booking_display,
               status : StateList[a].order_status,
               user_cancell_info : StateList[a].user_cancell_info,
               user_cancell_date : StateList[a].user_cancell_date,
               vendor_cancell_info : StateList[a].vendor_cancell_info,
               vendor_cancell_date : StateList[a].vendor_cancell_date,
               vendor_accept_cancel : StateList[a].vendor_accept_cancel,
               vendor_accept_cancel_data : StateList[a].vendor_accept_cancel_data,
               mobile_type : StateList[a].mobile_type,
               vendor_complete_date : StateList[a].vendor_complete_date,
               vendor_complete_info : StateList[a].vendor_complete_info,
               user_cancell_info : StateList[a].user_cancell_info,
               user_cancell_date : StateList[a].user_cancell_date,
               user_return_info : StateList[a].user_return_info,
               user_return_date : StateList[a].user_return_date,
               user_return_pic : StateList[a].user_return_pic,
               vendor_cancell_info : StateList[a].vendor_cancell_info,
               vendor_cancell_date : StateList[a].vendor_cancell_date,
               vendor_accept_cancel :  StateList[a].vendor_accept_cancel,
               vendor_accept_cancel_date :  StateList[a].vendor_accept_cancel_date,
               user_rate : StateList[a].user_rate,
               user_feedback : StateList[a].user_feedback,
           }
           final_data.push(c);
           if(a == StateList.length - 1){
             res.json({Status:"Success",Message:"User Order Details List", Data : final_data,Code:200});
           }
        }
         }          
        }).sort({_id:-1});
});



router.post('/get_order_details_vendor_id', function (req, res) {
        vendor_order_bookingModel.find({vendor_id:req.body.vendor_id, order_status : req.body.order_status}, function (err, StateList) {
             console.log(req.body);
           // StateList.sort(function compare(a, b) {
           //     var dateA = new Date(a.updatedAt);
           //     var dateB = new Date(b.updatedAt);
           //     console.log(dateA,dateB);
           //     return dateB - dateA;
           //     });
         if(StateList.length == 0){
              res.json({Status:"Success",Message:"No Data Found", Data : [],Code:200});
         }else{
          var final_data = [];
        for(let a = 0 ; a < StateList.length;a ++){
           let c = {
               _id : StateList[a]._id,
               order_id : StateList[a].order_id,
               product_name :  StateList[a].product_data[0].product_id.product_name,
               product_quantity : StateList[a].product_quantity,
               product_price :  StateList[a].prodouct_total,
               prodcut_image : StateList[a].product_data[0].product_id.product_img[0],
               date_of_booking : StateList[a].date_of_booking_display,
               status : StateList[a].order_status,
               user_cancell_info : StateList[a].user_cancell_info,
               user_cancell_date : StateList[a].user_cancell_date,
               vendor_cancell_info : StateList[a].vendor_cancell_info,
               vendor_cancell_date : StateList[a].vendor_cancell_date,
               vendor_accept_cancel : StateList[a].vendor_accept_cancel,
               vendor_accept_cancel_data : StateList[a].vendor_accept_cancel_data,
               mobile_type : StateList[a].mobile_type,
               vendor_complete_date : StateList[a].vendor_complete_date,
               vendor_complete_info : StateList[a].vendor_complete_info,
               user_return_info : StateList[a].user_return_info,
               user_return_date : StateList[a].user_return_date,
               user_return_pic : StateList[a].user_return_pic,
               vendor_accept_cancel_date :  StateList[a].vendor_accept_cancel_date,
               user_rate : StateList[a].user_rate,
               user_feedback : StateList[a].user_feedback,
           }
           final_data.push(c);
           if(a == StateList.length - 1){
             res.json({Status:"Success",Message:"Vendor Order Details List", Data : final_data,Code:200});
           }
        }
         }          
        }).sort({_id:-1});
});



router.post('/fetch_order_details_id', function (req, res) {
        vendor_order_bookingModel.findOne({_id:req.body._id}, function (err, StateList) {
          let c = {
               _id : StateList._id,
               order_id : StateList.order_id,
               product_name :  StateList.product_data[0].product_id.product_name,
               product_quantity : StateList.product_quantity,
               product_price :  StateList.prodouct_total,
               prodcut_image : StateList.product_data[0].product_id.product_img[0],
               date_of_booking : StateList.date_of_booking_display,
               status : StateList.order_status,
               user_cancell_info : StateList.user_cancell_info,
               user_cancell_date : StateList.user_cancell_date,
               vendor_cancell_info : StateList.vendor_cancell_info,
               vendor_cancell_date : StateList.vendor_cancell_date,
               vendor_accept_cancel : StateList.vendor_accept_cancel,
               vendor_accept_cancel_data : StateList.vendor_accept_cancel_data,
               // mobile_type : StateList[a].mobile_type,
               vendor_complete_date : StateList.vendor_complete_date,
               vendor_complete_info : StateList.vendor_complete_info,
               prodcut_track_details:StateList.prodcut_track_details,
                delivery_date :StateList.delivery_date,
                date_of_booking_display : StateList.date_of_booking_display,
                delivery_date_display : StateList.delivery_date_display,
                order_status :  StateList.order_status,
                prodouct_total :  StateList.prodouct_total, 
                shipping_address_id : StateList.shipping_address_id,
                billling_address_id :  StateList.billling_address_id,
                shipping_address :  StateList.shipping_address,
                billing_address :  StateList.billing_address,
                shipping_charge  : StateList.shipping_charge,
                over_all_total : StateList.over_all_total,
                discount_price : StateList.discount_price,
                grand_total : StateList.grand_total,
                coupon_code : StateList.coupon_code,
                payment_id : StateList.payment_id,
                shipping_details_id : StateList.shipping_details_id,
                shipping_details: StateList.shipping_details,
               user_rate : StateList.user_rate,
               user_feedback : StateList.user_feedback,
           }
          res.json({Status:"Success",Message:"Order Details", Data : c ,Code:200});
        }).populate('shipping_details_id');
});




router.post('/update_status_dispatch',async function (req, res) {
  var order_details = await vendor_order_bookingModel.findOne({_id:req.body._id});
  order_details.prodcut_track_details[req.body.activity_id] = {"id": req.body.activity_id,"title" : req.body.activity_title,"date" : req.body.activity_date, Status :  true};
  order_details.prodcut_track_details[req.body.activity_id + 1] = {"id": req.body.activity_id + 1,"title" : "In Transit","date" : req.body.activity_date, Status :  true};
 let c = {
     prodcut_track_details: order_details.prodcut_track_details,
     order_status : req.body.order_status,
     vendor_complete_date : req.body.vendor_complete_date,
     vendor_complete_info : req.body.vendor_complete_info,
  }
  vendor_order_bookingModel.findByIdAndUpdate(req.body._id, c, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Order Booked Updated successfully", Data : UpdatedDetails ,Code:200});
  });
        // vendor_order_bookingModel.find({Person_id:req.body.Person_id}, function (err, StateList) {
        //   res.json({Status:"Success",Message:"Order Booked  List", Data : StateList ,Code:200});
        // });
});



router.post('/update_status_cancel',async function (req, res) {
  var order_details = await vendor_order_bookingModel.findOne({_id:req.body._id});
  order_details.prodcut_track_details[req.body.activity_id] = {"id": req.body.activity_id,"title" : req.body.activity_title,"date" : req.body.activity_date,  Status :  true};
 let c = {
     prodcut_track_details: order_details.prodcut_track_details,
     order_status : req.body.order_status,
  user_cancell_info : req.body.user_cancell_info,
  user_cancell_date : req.body.user_cancell_date,
  }
  vendor_order_bookingModel.findByIdAndUpdate(req.body._id, c, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Order Booked Updated successfully", Data : UpdatedDetails ,Code:200});
  });
        // vendor_order_bookingModel.find({Person_id:req.body.Person_id}, function (err, StateList) {
        //   res.json({Status:"Success",Message:"Order Booked  List", Data : StateList ,Code:200});
        // });
});



router.post('/update_status_return',async function (req, res) {
  var order_details = await vendor_order_bookingModel.findOne({_id:req.body._id});
 let c = {
  order_status : req.body.order_status,
  user_return_info : req.body.user_return_info,
  user_return_date : req.body.user_return_date,
  user_return_pic : req.body.user_return_pic,
  }
  vendor_order_bookingModel.findByIdAndUpdate(req.body._id, c, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Order Booked Updated successfully", Data : UpdatedDetails ,Code:200});
  });
        // vendor_order_bookingModel.find({Person_id:req.body.Person_id}, function (err, StateList) {
        //   res.json({Status:"Success",Message:"Order Booked  List", Data : StateList ,Code:200});
        // });
});



router.post('/update_status_accept_return',async function (req, res) {
  var order_details = await vendor_order_bookingModel.findOne({_id:req.body._id});
 let c = {
    "vendor_accept_cancel": req.body.vendor_accept_cancel,
    "vendor_accept_cancel_date": req.body.vendor_accept_cancel_date,
  }
  vendor_order_bookingModel.findByIdAndUpdate(req.body._id, c, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Order Booked Updated successfully", Data : UpdatedDetails ,Code:200});
  });
        // vendor_order_bookingModel.find({Person_id:req.body.Person_id}, function (err, StateList) {
        //   res.json({Status:"Success",Message:"Order Booked  List", Data : StateList ,Code:200});
        // });
});



router.post('/update_status_reject_return',async function (req, res) {
  var order_details = await vendor_order_bookingModel.findOne({_id:req.body._id});
 let c = {
    "vendor_cancel_return_date": req.body.vendor_cancel_return_date,
    "vendor_cancel_retune_info": req.body.vendor_cancel_retune_info,
  }
  vendor_order_bookingModel.findByIdAndUpdate(req.body._id, c, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Order Booked Updated successfully", Data : UpdatedDetails ,Code:200});
  });
        // vendor_order_bookingModel.find({Person_id:req.body.Person_id}, function (err, StateList) {
        //   res.json({Status:"Success",Message:"Order Booked  List", Data : StateList ,Code:200});
        // });
});


router.post('/update_status_vendor_cancel',async function (req, res) {
  var order_details = await vendor_order_bookingModel.findOne({_id:req.body._id});
  order_details.prodcut_track_details[req.body.activity_id] = {"id": req.body.activity_id,"title" : req.body.activity_title,"date" : req.body.activity_date,  Status :  true};
 let c = {
     order_status : req.body.order_status,
     prodcut_track_details: order_details.prodcut_track_details,
     vendor_cancell_info : req.body.vendor_cancell_info,
     vendor_cancell_date : req.body.vendor_cancell_date,
  }
  vendor_order_bookingModel.findByIdAndUpdate(req.body._id, c, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Order Booked Updated successfully", Data : UpdatedDetails ,Code:200});
  });
        // vendor_order_bookingModel.find({Person_id:req.body.Person_id}, function (err, StateList) {
        //   res.json({Status:"Success",Message:"Order Booked  List", Data : StateList ,Code:200});
        // });
});




router.post('/update_status_accept',async function (req, res) {
  var order_details = await vendor_order_bookingModel.findOne({_id:req.body._id});
  order_details.prodcut_track_details[req.body.activity_id] = {"id": req.body.activity_id,"title" : req.body.activity_title,"date" : req.body.activity_date, Status :  true};
 let c = {
     prodcut_track_details: order_details.prodcut_track_details
  }
  vendor_order_bookingModel.findByIdAndUpdate(req.body._id, c, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Order Booked Updated successfully", Data : {} ,Code:200});
  });
});




router.get('/deletes', function (req, res) {
      vendor_order_bookingModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"Order Booked  Deleted", Data : {} ,Code:200});     
      });
});


router.post('/getlist_id', function (req, res) {
        vendor_order_bookingModel.find({Person_id:req.body.Person_id}, function (err, StateList) {
          res.json({Status:"Success",Message:"Order Booked  List", Data : StateList ,Code:200});
        });
});




router.post('/filter_date', function (req, res) {
        vendor_order_bookingModel.find({}, function (err, StateList) {
          var final_Date = [];
          for(let a = 0; a < StateList.length; a ++){
            var fromdate = new Date(req.body.fromdate);
            var todate = new Date(req.body.todate);
            var checkdate = new Date(StateList[a].createdAt);
            if(checkdate >= fromdate && checkdate <= todate){
              final_Date.push(StateList[a]);
            }
            if(a == StateList.length - 1){
              res.json({Status:"Success",Message:"Order Booked  List", Data : final_Date ,Code:200});
            }
          }
        });
});





router.get('/getlist', function (req, res) {
        vendor_order_bookingModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Order Booked  Details", Data : Functiondetails ,Code:200});
        });
});



router.get('/cancel_status', function (req, res) {
      let cancel_status = [
      {
        "title" : "Expected delivery date has changed and the product is arriving at a later date."
      },
      {
        "title" : "Product is being delivered to a wrong address"
      },
      {
        "title" : "Product is not required anymore."
      },
      {
        "title" : "Cheaper alternative available for lesser price."
      },
      {
        "title" : "Bad review from friends/relatives after ordering the product"
      },
      {
        "title" : "Other"
      }
      ];

      let return_status = [
      {
        "title" : "Product No Longer Needed"
      },
      {
        "title" : "Product Does Not Match Description on Website or in Catalog"
      },
      {
        "title" : "Product Did Not Meet Customer's Expectations"
      },
      {
        "title" : "Company Shipped Wrong Product or Size"
      },
      {
        "title" : "Other"
      }
      ];
      var term_cond = "https://www.nappets.com/refund-return/"
      let c = {
        cancel_status : cancel_status,
        return_status : return_status,
        term_cond : term_cond
      }
      res.json({Status:"Success",Message:"Cancel Status & Return Status", Data : c ,Code:200});
});





////New Create API////////////////////
router.post('/create1', async function(req, res) {
  try{
    if(req.body.coupon_code !== ""){
              var refund_detail = await refund_couponModel.findOne({code:req.body.coupon_code,user_details:req.body.user_id});
              if(refund_detail == null){
              }
              else{
              let update = {
                 used_status : "Used"
              }
              refund_couponModel.findByIdAndUpdate(refund_detail._id, update, {new: true},async function (err, tokenupdate) {
              });
              }
             }
     var shipping_address_text = "";
     var shipping_details = await shipping_addressModel.findOne({user_id:req.body.user_id,user_address_stauts:"Last Used"});
     if(shipping_details == null){
      shipping_address_text  = ""
     } else {  
      shipping_address_text  = "No :"+shipping_details.user_flat_no + ", " +shipping_details.user_stree+", "+shipping_details.user_city+", "+shipping_details.user_state+", "+"ZIP CODE - "+shipping_details.user_picocode;
     }
    let Appointmentid = "ORDER-" + new Date().getTime();
    let vendor_order_group = [];
    let petlover_order_group = [];
    let temp_data = req.body.Data;
    for(let a  = 0 ; a < temp_data.length; a ++) {
        let product_details = req.body.Data[a].product_id;
        // console.log(req.body.user_id,product_details._id);
        var outofstackdata = await product_detailsModel.findOne({_id:product_details._id});
        let stock_count    =   +outofstackdata.threshould - +req.body.Data[a].product_count;
        var update_product_details = await product_detailsModel.findByIdAndUpdate({_id:outofstackdata._id},{threshould: ""+stock_count},{new: true});
        var product_detailsss = await product_cart_detailsModel.findOne({user_id :req.body.user_id,product_id:product_details._id});
        // console.log(product_detailsss);
        if(product_detailsss != null){
          var deleted = await product_cart_detailsModel.findByIdAndRemove({_id:product_detailsss._id});
        }
    	if(vendor_order_group.length == 0) {
    		let amt = temp_data[a].product_id.cost * temp_data[a].product_count;
        let item_count = temp_data[a].product_count;
    		let c = {
    			order_id : Appointmentid,
          user_id : req.body.user_id,
          shipping_id : req.body.shipping_details_id,
          payment_id :  req.body.payment_id,
    			vendor_id : temp_data[a].product_id.user_id,
    			product_details : [
                 {
                  "product_order_id" : a,
                 	"product_detail" : temp_data[a].product_id,
                 	"product_count" : temp_data[a].product_count,
                  prodcut_track_details:[
                  {"id": 0,"title" : "Order Booked","date" : req.body.date_of_booking_display,  "text" : "", "Status" :  true},
                  {"id": 1,"title" : "Order Accept","date" : '', "text" : "", "Status" :  false },
                  {"id": 2,"title" : "Order Dispatch","date" : '', "text" : "", "Status" :  false},
                  {"id": 3,"title" : "In Transit","date" : '', "text" : "", "Status" :  false},
                  {"id": 4,"title" : "Order Cancelled","date" : '', "text" : "", "Status" :  false},
                  {"id": 5,"title" : "Vendor cancelled","date" : '', "text" : "", "Status" :  false}
                  ],
                  product_status : "Order Booked",
                  user_feedback : "",
                  user_rate : 0
                 }
    			],
          order_product_count : 1,
          order_price : amt,
          order_image : temp_data[a].product_id.thumbnail_image || '',
          order_booked_on : req.body.date_of_booking_display,
          order_status : "Order Booked",
          order_text : "Food Products",
    		}
    		vendor_order_group.push(c);


          let d = {
          order_id : Appointmentid,
          user_id : req.body.user_id,
          shipping_id : req.body.shipping_details_id,
          payment_id :  req.body.payment_id,
          vendor_id : temp_data[a].product_id.user_id,
          product_details : [
                 {
                  "product_order_id" : a,
                  "product_detail" : temp_data[a].product_id,
                  "product_count" : temp_data[a].product_count,
                  prodcut_track_details:[
                  {"id": 0,"title" : "Order Booked","date" : req.body.date_of_booking_display, "text" : "", "Status" :  true},
                  {"id": 1,"title" : "Order Accept","date" : '', "text" : "", "Status" :  false },
                  {"id": 2,"title" : "Order Dispatch","date" : '', "text" : "", "Status" :  false},
                  {"id": 3,"title" : "In Transit","date" : '', "text" : "", "Status" :  false},
                  {"id": 4,"title" : "Order Cancelled","date" : '', "text" : "", "Status" :  false},
                  {"id": 5,"title" : "Vendor cancelled","date" : '',  "text" : "","Status" :  false}
                  ],
                  product_status : "Order Booked",
                  user_feedback : "",
                  user_rate : 0
                 }
          ],
          order_product_count : 1,
          order_price : amt,
          order_image : temp_data[a].product_id.thumbnail_image || '',
          order_booked_on : req.body.date_of_booking_display,
          order_status : "Order Booked",
          order_text : "Food Products",
        }
        petlover_order_group.push(d);
    	}
       else	if(vendor_order_group.length !== 0){
            let vendor_order_group_count = vendor_order_group.length;
            let check = 0; 
            let amt = temp_data[a].product_id.cost * temp_data[a].product_count;
            let item_count = temp_data[a].product_count;
            let d = {
                  "product_order_id" : a,
                  "product_detail" : temp_data[a].product_id,
                  "product_count" : temp_data[a].product_count,
                  prodcut_track_details:[
                  {"id": 0,"title" : "Order Booked","date" : req.body.date_of_booking_display,  "text" : "","Status" :  true},
                  {"id": 1,"title" : "Order Accept","date" : '', "text" : "", "Status" :  false },
                  {"id": 2,"title" : "Order Dispatch","date" : '',  "text" : "","Status" :  false},
                  {"id": 3,"title" : "In Transit","date" : '', "text" : "", "Status" :  false},
                  {"id": 4,"title" : "Order Cancelled","date" : '', "text" : "", "Status" :  false},
                  {"id": 5,"title" : "Vendor cancelled","date" : '', "text" : "", "Status" :  false}
                  ],
                  product_status : "Order Booked",
                  user_feedback : "",
                  user_rate : 0
                 }
            petlover_order_group[0].product_details.push(d);
            petlover_order_group[0].order_price = petlover_order_group[0].order_price + amt;
            petlover_order_group[0].order_product_count = petlover_order_group[0].order_product_count + 1;

    		for(let c  = 0 ; c < vendor_order_group_count; c ++) {
    			if(vendor_order_group[c].vendor_id == temp_data[a].product_id.user_id){
    				check = 1 
    				let amt = temp_data[a].product_id.cost * temp_data[a].product_count;
            let item_count = temp_data[a].product_count;
    				let d = {
                  "product_order_id" : a,
                  "product_detail" : temp_data[a].product_id,
                  "product_count" : temp_data[a].product_count,
                  prodcut_track_details:[
                  {"id": 0,"title" : "Order Booked","date" : req.body.date_of_booking_display, "text" : "", "Status" :  true},
                  {"id": 1,"title" : "Order Accept","date" : '', "text" : "", "Status" :  false },
                  {"id": 2,"title" : "Order Dispatch","date" : '', "text" : "", "Status" :  false},
                  {"id": 3,"title" : "In Transit","date" : '', "text" : "", "Status" :  false},
                  {"id": 4,"title" : "Order Cancelled","date" : '', "text" : "", "Status" :  false},
                  {"id": 5,"title" : "Vendor cancelled","date" : '',  "text" : "","Status" :  false}
                  ],
                  product_status : "Order Booked",
                  user_feedback : "",
                  user_rate : 0
                 }
                    vendor_order_group[c].product_details.push(d);
                    vendor_order_group[c].order_price = vendor_order_group[c].order_price + amt;
                    vendor_order_group[c].order_product_count = vendor_order_group[c].order_product_count + 1;
    			}
    			if(c == vendor_order_group_count - 1){
    			if(check == 0){
    		    let amt = temp_data[a].product_id.cost * temp_data[a].product_count;	
            let item_count = temp_data[a].product_count;
    		    let c = {
          order_id : Appointmentid,
          user_id : req.body.user_id,
          shipping_id : req.body.shipping_details_id,
          payment_id :  req.body.payment_id,
          vendor_id : temp_data[a].product_id.user_id,
          product_details : [
                 {
                  "product_order_id" : a,
                  "product_detail" : temp_data[a].product_id,
                  "product_count" : temp_data[a].product_count,
                  prodcut_track_details:[
                  {"id": 0,"title" : "Order Booked","date" : req.body.date_of_booking_display,  "text" : "", "Status" :  true},
                  {"id": 1,"title" : "Order Accept","date" : '',  "text" : "", "Status" :  false },
                  {"id": 2,"title" : "Order Dispatch","date" : '',  "text" : "", "Status" :  false},
                  {"id": 3,"title" : "In Transit","date" : '',  "text" : "", "Status" :  false},
                  {"id": 4,"title" : "Order Cancelled","date" : '',  "text" : "", "Status" :  false},
                  {"id": 5,"title" : "Vendor cancelled","date" : '',  "text" : "", "Status" :  false}
                  ],
                  product_status : "Order Booked",
                  user_feedback : "",
                  user_rate : 0
                 }
          ],
          order_product_count : 1,
          order_price : amt,
          order_image : temp_data[a].product_id.thumbnail_image || '',
          order_booked_on : req.body.date_of_booking_display,
          order_status : "Order Booked",
          order_text : "Food Products",
        }
    		    vendor_order_group.push(c);
    			}
    			}
    		}
    	}
    	if(a == temp_data.length - 1) {
         for(let f = 0 ; f < vendor_order_group.length; f++){
        try{
        await vendor_order_groupModel.create({
            v_order_id : vendor_order_group[f].order_id,
            v_user_id : vendor_order_group[f].user_id,
            v_shipping_address : vendor_order_group[f].shipping_id,
            v_payment_id : vendor_order_group[f].payment_id,
            v_vendor_id : vendor_order_group[f].vendor_id,
            v_product_details : vendor_order_group[f].product_details,
            v_order_product_count :vendor_order_group[f].order_product_count,
            v_order_price : vendor_order_group[f].order_price,
            v_order_image : vendor_order_group[f].order_image,
            v_order_booked_on : vendor_order_group[f].order_booked_on,
            v_order_status : vendor_order_group[f].order_status,
            v_order_text : vendor_order_group[f].order_text,
            v_order_status : "New",
            v_cancelled_date : "",
            v_completed_date : "",
            v_user_feedback : "",
            v_user_rate : 0
        },async function (err, user) {
            console.log(err);
            var user_token = await userdetailsModel.findOne({_id:user.v_user_id});
            console.log("user_detail",user_token);
             var params = {
            "user_id":  user_token._id,
            "notify_title" : "New Order Booked",
            "notify_descri" : "Order Booked successfully " + user.v_order_id + " at " + user.v_order_booked_on,
            "notify_img" : "",
            "notify_time" : "",
            "date_and_time" : user.v_order_booked_on,
            "user_token" : user_token.fb_token,
            "data_type" : {
            "usertype":""+user_token.user_type,
            "appintments":"",
            "orders":"New"
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
        // res.json({Status:"Success",Message:"product Sub categories screen Added successfully", Data : user ,Code:200}); 
        });
         }
        catch(e){
      // res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
      }
        if(f == vendor_order_group.length - 1){
        try{
        await petlover_order_groupModel.create({
            p_order_id : petlover_order_group[0].order_id,
            p_user_id : petlover_order_group[0].user_id,
            p_shipping_address : petlover_order_group[0].shipping_id,
            p_payment_id : petlover_order_group[0].payment_id,
            p_vendor_id : petlover_order_group[0].vendor_id,
            p_product_details : petlover_order_group[0].product_details,
            p_order_product_count : petlover_order_group[0].order_product_count,
            p_order_price : req.body.total_price,
            p_order_image : petlover_order_group[0].order_image,
            p_order_booked_on : petlover_order_group[0].order_booked_on,
            p_order_status : petlover_order_group[0].order_status,
            p_order_text : petlover_order_group[0].order_text,
            p_order_status : "New",
            p_discount_price : req.body.discount_price,
            p_grand_total : req.body.grand_total,
            p_cancelled_date : "",
            p_completed_date : "",
            p_user_feedback : "",
            p_user_rate : 0,
            coupon_status : req.body.coupon_status || "",
            coupon_code : req.body.coupon_code || "",
            original_price : req.body.original_price || 0,
            coupon_discount_price : req.body.coupon_discount_price || 0,
            total_price : req.body.total_price || 0,
        },async function (err, user) {
          var vendor_detail = await product_vendorModel.findOne({_id:user.p_vendor_id});
          var user_token = await userdetailsModel.findOne({_id:vendor_detail.user_id});
             var params = {
            "user_id":  user_token._id,
            "notify_title" : "New Order Booked",
             "notify_descri" : "You have a new Order " + user.p_order_id + " at " + user.p_order_booked_on,
            "notify_img" : "",
            "notify_time" : "",
            "date_and_time" : user.p_order_booked_on,
            "user_token" : user_token.fb_token,
            "data_type" : {
            "usertype":""+user_token.user_type,
            "appintments":"",
            "orders":"New"
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
          // console.log("**********Order head **********",user);
        let r = {"Booking_id": Appointmentid,"prodouct_total":req.body.prodouct_total,"discount_price":req.body.discount_price,"grand_total":req.body.grand_total,"date_of_booking_display":req.body.date_of_booking}
        res.json({Status:"Success",Message:"Order booked successfully", Data : r, Code:200});
          // res.json({Status:"Success",Message:"Order booked successfully", Data : vendor_order_group, Data1 : petlover_order_group, Code:200});
        });
         }
        catch(e){
      // res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
      }

        }
      }
    	}
    }
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});











router.post('/reviews/update',async function (req, res) {
        // var order_details = await vendor_order_bookingModel.findOne({_id:req.body.order_id});
        // // console.log('Order Details',order_details);
        // var product_detail = await product_detailsModel.findOne({_id:order_details.product_id});
        // // console.log('Product Details',product_detail);
        //   await product_rate_reviewModel.create({
        //     user_id:  order_details.user_id,
        //     product_id : order_details.product_id,
        //     reviews : req.body.user_feedback,
        //     rating : req.body.user_rate
        // },async function (err, user) {
        //     console.log("Rating Created", user);
        // var test_rat_count = 0; 
        // var final_rat_count = 0;
        // var review_details = await product_rate_reviewModel.find({product_id:order_details.product_id});
        // console.log('Review Details',review_details);
        // for(let a = 0 ; a < review_details.length ; a++) {
        //     test_rat_count = +review_details[a].rating + test_rat_count;
        // }
        // console.log(test_rat_count,review_details.length);
        // var final_rat_count = +test_rat_count / review_details.length;
        // console.log(final_rat_count);
        // let c = {
        // user_feedback : req.body.user_feedback,
        // user_rate : req.body.user_rate,
        // } 
        // console.log("Rating Details",c);
        // let a = {
        //   product_rating :  final_rat_count.toFixed(1),
        //   product_review :  review_details.length,
        // }
        // product_detailsModel.findByIdAndUpdate(order_details.product_id, a, {new: true}, function (err, UpdatedDetails) {
        //     if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
        //      // res.json({Status:"Success",Message:"Docotor Details Updated", Data : UpdatedDetails ,Code:200});
        //        console.log("Update in Product Details");
        //   res.json({Status:"Success",Message:"Feedback updated successfully", Data : {} ,Code:200});
        // });
        // // vendor_order_bookingModel.findByIdAndUpdate(req.body.order_id, c, {new: true}, function (err, UpdatedDetails) {
        // //      if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
        // //      res.json({Status:"Success",Message:"Feedback updated successfully", Data : UpdatedDetails ,Code:200});
        // // });
        //   });  

        res.json({Status:"Success",Message:"Feedback updated successfully", Data : {} ,Code:200});

});





















router.get('/mobile/getlist', function (req, res) {
        vendor_order_bookingModel.find({show_status:true}, function (err, Functiondetails) {
          let a = {
            Demodata : Functiondetails
          }
          res.json({Status:"Success",Message:"Order Booked Details", Data : a ,Code:200});
        });
});

router.post('/edit', function (req, res) {
        vendor_order_bookingModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Order Booked  Updated", Data : UpdatedDetails ,Code:200});
        });
});


router.post('/delete', function (req, res) {
 let c = {
    delete_status : true
  }
  vendor_order_bookingModel.findByIdAndUpdate(req.body._id, c, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Order Booked Deleted successfully", Data : UpdatedDetails ,Code:200});
  });
});



// // DELETES A USER FROM THE DATABASE
router.post('/admin_delete', function (req, res) {
      vendor_order_bookingModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Order Booked Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;
