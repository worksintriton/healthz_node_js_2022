var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var kitchen_user_detailModel = require('./../models/kitchen_user_detailModel');


var waiter_order_detailModel = require('./../models/waiter_order_detailModel');
var waiter_restaurantdetailModel = require('./../models/waiter_restaurantdetailModel');
var waiter_waiterdetailModel = require('./../models/waiter_waiterdetailModel');
var waiter_chefdetailModel = require('./../models/waiter_chefdetailModel');
var waiter_tabledetailModel = require('./../models/waiter_tabledetailModel');
var waiter_categorydetailModel = require('./../models/waiter_categorydetailModel');
var waiter_order_temModel = require('./../models/waiter_order_temModel');
var waiter_itemdetailModel = require('./../models/waiter_itemdetailModel');
var waiter_sosModel = require('./../models/waiter_sosModel');
var waiter_notificationModel = require('./../models/waiter_notificationModel');


router.post('/create', async function(req, res) {
  let user_details = await kitchen_user_detailModel.findOne({phone_no:req.body.phone_no});
 if(user_details !== null)  
  {
    res.json({Status:"Success",Message:"This number already Exist", Data : {} ,Code:400}); 
  }
  else{
  try{
  await kitchen_user_detailModel.create({
  user_name:  req.body.user_name,
  phone_no : req.body.phone_no,
  rest_id :req.body.rest_id,
  user_type : req.body.user_type,
  active_status : req.body.active_status,
  created_by : req.body.created_by
        }, 
        function (err, user) {
        res.json({Status:"Success",Message:"User created successfully", Data : user ,Code:200}); 
        });
 }
 catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
}

});




router.post('/login',async function (req, res) {
    var admin_user = await waiter_restaurantdetailModel.findOne({res_contact_no:+req.body.phone_no});
    var waiter_user = await waiter_waiterdetailModel.findOne({waiter_number:+req.body.phone_no});
    var chef_user = await waiter_chefdetailModel.findOne({chef_number:+req.body.phone_no});
   if(admin_user !== null){
        let status = true ;
        if(admin_user.res_status !== 'Active'){
          status = false;
        }
        let a =    
         {
        "_id": admin_user._id,
        "user_name":  admin_user.res_name,
        "phone_no": ""+admin_user.res_contact_no,
        "rest_id":  admin_user._id,
        "user_type": 1,
        "active_status": status,
        "created_by": admin_user.create_by,
        "updatedAt": admin_user.updatedAt,
        "createdAt": admin_user.createdAt,
        "__v": 0
        }
        if(a.active_status == false){
          res.json({Status:"Failed",Message:"Your account has been blocked. check with your admin", Data : {} ,Code:400}); 
        }else {
          res.json({Status:"Success",Message:"Admin Details", Data : a ,Code:200}); 
        }
    }else if(waiter_user !== null){
       let status = true ;
        if(waiter_user.waiter_status == 'false'){
          status = false;
        }
        let a =    
         {
        "_id": waiter_user._id,
        "user_name":  waiter_user.waiter_name,
        "phone_no": ""+waiter_user.waiter_number,
        "rest_id":  waiter_user.rest_id,
        "user_type": 2,
        "active_status": status,
        "created_by": waiter_user.create_by || "",
        "updatedAt": waiter_user.updatedAt,
        "createdAt": waiter_user.createdAt,
        "__v": 0
        }
         if(a.active_status == false){
          res.json({Status:"Failed",Message:"Your account has been blocked. check with your admin", Data : {} ,Code:400}); 
        }else {
          res.json({Status:"Success",Message:"Waiter Details", Data : a ,Code:200}); 
        }
    }else if(chef_user !== null){
        let status = true ;
        if(chef_user.chef_status == 'false'){
          status = false;
        }
        let a =    
         {
        "_id": chef_user._id,
        "user_name":  chef_user.chef_name,
        "phone_no": ""+chef_user.chef_number,
        "rest_id":  chef_user.rest_id,
        "user_type": 3,
        "active_status": status,
        "created_by": chef_user.create_by || "",
        "updatedAt": chef_user.updatedAt,
        "createdAt": chef_user.createdAt,
        "__v": 0
        }
        if(a.active_status == false){
          res.json({Status:"Failed",Message:"Your account has been blocked. check with your admin", Data : {} ,Code:400}); 
        }else {
          res.json({Status:"Success",Message:"Chef Details", Data : a ,Code:200}); 
        }
    }else{
      res.json({Status:"Failed",Message:"Invalid Account", Data : {} ,Code:400}); 
    }
});






router.post('/update_fbtoken',async function (req, res) {
    var admin_user = await waiter_restaurantdetailModel.findOne({res_contact_no:+req.body.phone_no});
    var waiter_user = await waiter_waiterdetailModel.findOne({waiter_number:+req.body.phone_no});
    var chef_user = await waiter_chefdetailModel.findOne({chef_number:+req.body.phone_no});
   if(admin_user !== null){
        waiter_restaurantdetailModel.findByIdAndUpdate(admin_user._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Admin Token Updated", Data : UpdatedDetails ,Code:200});
        });
   }
   else if(waiter_user !== null){
       waiter_waiterdetailModel.findByIdAndUpdate(waiter_user._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Waiter Token Updated", Data : UpdatedDetails ,Code:200});
        });

   }else if(chef_user !== null){
      waiter_chefdetailModel.findByIdAndUpdate(chef_user._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Cheif Token Updated", Data : UpdatedDetails ,Code:200});
        });
   }
});













router.post('/dashboard',async function (req, res) {
  console.log(req.body);
 var order_detail = await waiter_order_detailModel.findOne({rest_id:req.body.rest_id}).count();
  var table_detail = await waiter_tabledetailModel.findOne({rest_id:req.body.rest_id}).count();
   var waiter_detail = await waiter_waiterdetailModel.findOne({rest_id:req.body.rest_id}).count();
    var chef_detail = await waiter_chefdetailModel.findOne({rest_id:req.body.rest_id}).count();
     var item_detail = await waiter_itemdetailModel.findOne({rest_id:req.body.rest_id}).count();
    var notify_detail = await waiter_notificationModel.findOne({rest_id:req.body.rest_id}).count();



     let a = {
       waiter_count : waiter_detail,
       user_count : waiter_detail,
       order_count : order_detail,
       notification_count : chef_detail,
       Today_sale : 2302,
       Table_count : table_detail,
       item_count : item_detail,
     }
     res.json({Status:"Success",Message:"Dashboard Details", Data : a ,Code:200});
});



router.post('/sos',async function (req, res) {
var sos_user = await waiter_sosModel.findOne({rest_id:req.body.rest_id});
console.log(sos_user);
  var SOS  = []; 
  if(sos_user == null){
      SOS = [];
  }else{
     SOS = sos_user.sos;
  }
     res.json({Status:"Success",Message:"SOS Details", Data : SOS ,Code:200});
});




router.post('/table_list',async function (req, res) {
 var table_details = await waiter_tabledetailModel.find({rest_id:req.body.rest_id});
 if(table_details.length == 0){
   res.json({Status:"Failed",Message:"Table Details", Data : a ,Code:404});
 }

 let final_data = [];
 for(let a = 0 ; a < table_details.length ; a ++){
  let status = true;
  if(table_details[a].table_status !== 'true'){
     status = false;
  }
  let c = {
       table_no : table_details[a].table_no,
       table_status : status,
       table_color_code : table_details[a].table_color_code,
       table_order_status : table_details[a].table_order_status,
       rest_id : table_details[a].rest_id,
  }
  final_data.push(c);
  if(a == table_details.length - 1){
    res.json({Status:"Success",Message:"Table Details", Data : final_data ,Code:200});
  }

 }
});




router.post('/kitchen_dashboard',async function (req, res) {
     var order_details = await waiter_order_detailModel.find({rest_id:req.body.rest_id});
     if(order_details.length == 0){
       res.json({Status:"Success",Message:"Kitchen Details", Data : [] ,Code:200});
     }else{
      let final_data = [];
      for(let a = 0 ; a < order_details.length ; a ++){
        let c = {
       _id :  order_details[a]._id,
       order_id : order_details[a].order_id,
       rest_id : order_details[a].rest_id,
       table_no :  order_details[a].table_no,
       table_name : order_details[a].table_no,
       taken_by :  order_details[a].taken_by,
       order_at : order_details[a].order_date_book,
       status :  order_details[a].order_status,
       chef_status :  order_details[a].chef_status,
        }
        final_data.push(c);
        if(a == order_details.length - 1){
        res.json({Status:"Success",Message:"Kitchen Details", Data : final_data ,Code:200});
        }
      }
     } 
});




router.post('/order/create', async function(req, res) {
  var waiter_detail = await waiter_waiterdetailModel.findOne({_id:req.body.taken_id});
  let Appointmentid = "" + new Date().getTime();
  try{
  await waiter_order_detailModel.create({
  rest_id: req.body.rest_id,
  order_id: ""+ new Date().getTime(),
  table_no: req.body.table_no,
  taken_by: waiter_detail.waiter_name,
  taken_id: req.body.taken_id,
  order_date_book: req.body.order_date_book,
  item_detail: req.body.item_detail,
  order_date_complete: "",
  remarks : "",
  order_cast : 0,
  chef_id: req.body.chef_id || "",
  order_status: "Booked",
  chef_status : "",
  waiter_status : "Booked",
        },async function (err, user) {
         let temp = user.item_detail;
         for(let a = 0 ; a < temp.length ; a ++){
           waiter_order_temModel.findByIdAndRemove(temp[a]._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          // res.json({Status:"Success",Message:"company type Deleted successfully", Data : {} ,Code:200});
            });
           if(a == temp.length - 1){
            res.json({Status:"Success",Message:"Order added successfully", Data : user ,Code:200}); 
           }
         }
        });
}catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});



router.post('/order/waiter/history', async function(req, res) {
  var order_history_waiter = await waiter_order_detailModel.find({taken_id:req.body.waiter_id});
   res.json({Status:"Success",Message:"Waiter history list", Data : order_history_waiter ,Code:200}); 
});


router.post('/order/waiter/update', async function(req, res) {
 waiter_order_detailModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"company type Updated", Data : UpdatedDetails ,Code:200});
  });
});





router.post('/categroies_list',async function (req, res) {
 var category_details = await waiter_categorydetailModel.find({rest_id:req.body.rest_id,category_status : 'true'});
  if(category_details.length == 0){
   res.json({Status:"Failed",Message:"categroies Details", Data : {} ,Code:404});
  } else {
    let final_data = [];
    for(let a = 0 ; a < category_details.length ; a ++ ){
      let c = {
         cat_id : category_details[a]._id,
         cat_name : category_details[a].category_name,
         rest_id : category_details[a].rest_id,
      }
      final_data.push(c);
      if(a == category_details.length - 1){
         res.json({Status:"Success",Message:"categroies Details", Data : final_data ,Code:200});
      }
    }
  }
});




router.post('/add_item', async function(req, res) {
let tem_order = await waiter_order_temModel.findOne({rest_id:req.body.rest_id,waiter_id:req.body.waiter_id,item_id:req.body.item_id,table_no:req.body.table_no});
if(tem_order == null){
  try{
  await waiter_order_temModel.create({
  rest_id: req.body.rest_id,
  category_id : req.body.category_id,
  item_id : req.body.item_id,
  waiter_id : req.body.waiter_id,
  table_no : req.body.table_no,
  item_name : req.body.item_name,
  item_price : req.body.item_price,
  item_status : "Booked",
  item_count : 1,
  date_of_create : ""+ new Date(),
        }, 
        function (err, user) {
        res.json({Status:"Success",Message:"Item added successfully", Data : {} ,Code:200}); 
        });
}catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
}else {
     item_count = +tem_order.item_count + 1
  let a = {
    item_count : item_count
  }
   waiter_order_temModel.findByIdAndUpdate(tem_order._id, a, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Item Updated", Data : {} ,Code:200});
   });
}
});



router.post('/remove_item', async function(req, res) {
let tem_order = await waiter_order_temModel.findOne({rest_id:req.body.rest_id,waiter_id:req.body.waiter_id,item_id:req.body.item_id,table_no:req.body.table_no});
if(tem_order == null){
       res.json({Status:"Success",Message:"No data found", Data : {} ,Code:400});
}else {
  item_count = +tem_order.item_count - 1
  let a = {
    item_count : item_count
  }
  if(item_count == 0){
    waiter_order_temModel.findByIdAndRemove(tem_order._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Item Deleted", Data : {} ,Code:200});
      });
  }else {
   waiter_order_temModel.findByIdAndUpdate(tem_order._id, a, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
            res.json({Status:"Success",Message:"Item Updated", Data : {} ,Code:200});
   });
  }
}
});



router.post('/remove_all_item', async function(req, res) {
let tem_order = await waiter_order_temModel.find({rest_id:req.body.rest_id,waiter_id:req.body.waiter_id,table_no:req.body.table_no});
if(tem_order.length == 0){
  res.json({Status:"Success",Message:"No data found", Data : {} ,Code:400});
}else {
    for(let a = 0 ; a < tem_order.length ; a ++){
       waiter_order_temModel.findByIdAndRemove(tem_order[a]._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
      });
     if(a == tem_order.length - 1){
       res.json({Status:"Success",Message:"Item Deleted", Data : {} ,Code:200});
     }
    }
}
});



router.post('/over_view_item', async function(req, res) {
let tem_order = await waiter_order_temModel.find({rest_id:req.body.rest_id,waiter_id:req.body.waiter_id,table_no:req.body.table_no});
res.json({Status:"Success",Message:"Over all item details", Data : tem_order ,Code:200});
});


router.get('/over_view/deletes', function (req, res) {
      waiter_order_temModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"company type Deleted", Data : {} ,Code:200});     
      });
});










router.post('/items_list',async function (req, res) {
let item_detail = await waiter_itemdetailModel.find({rest_id:req.body.rest_id,category_id:req.body.cat_id});
let final_data = [];
if(item_detail.length == 0){
 res.json({Status:"Success",Message:"Item list details", Data : [],Code:200});
}else {
  let tem_order_detail = await waiter_order_temModel.find({rest_id:req.body.rest_id,category_id:req.body.cat_id,table_no:req.body.table_no});
  for(let a = 0 ; a < item_detail.length ; a ++){
        let count = 0;
        if(tem_order_detail.length == 0){
       let b = {
       cat_id : item_detail[a].category_id,
       item_id : item_detail[a]._id,
       item_count : 0,
       item_name : item_detail[a].item_name,
       price : item_detail[a].item_price,
      } 
      final_data.push(b);
        }
      else{
        for(let b = 0; b < tem_order_detail.length ; b ++){                
        if(item_detail[a]._id == tem_order_detail[b].item_id){
          count = tem_order_detail[b].item_count;
        }
        }
       let b = {
       cat_id : item_detail[a].category_id,
       item_id : item_detail[a]._id,
       item_count : count,
       item_name : item_detail[a].item_name,
       price : item_detail[a].item_price,
      } 
            final_data.push(b);
        }
   if(a == item_detail.length - 1){
    res.json({Status:"Success",Message:"Item list details", Data : final_data ,Code:200});
   }
  }
}
  
});




router.post('/check_table_status',async function (req, res) {
var table_details = await waiter_tabledetailModel.findOne({rest_id:req.body.rest_id,table_no:req.body.table_no,table_order_status: ""});
if(table_details !== null){
    let a = {
       "table_color_code": "#E59866",
       "table_order_status": "Order_inprogess",
    }
    waiter_tabledetailModel.findByIdAndUpdate(table_details._id, a, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Table Updated", Data : UpdatedDetails ,Code:200});
    });
} else {
  res.json({Status:"Success",Message:"Table not Available, Current under processing, Check with your admin", Data : {} ,Code:400});
}
});


router.post('/clear_table',async function (req, res) {
var table_details = await waiter_tabledetailModel.findOne({rest_id:req.body.rest_id,table_no:req.body.table_no});
if(table_details !== null){
    let a = {
       "table_color_code": "#0262f7",
       "table_order_status": "",
    }
    waiter_tabledetailModel.findByIdAndUpdate(table_details._id, a, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Table Updated", Data : UpdatedDetails ,Code:200});
    });
} else {
  res.json({Status:"Success",Message:"Currently this table available", Data : {} ,Code:200});
}
});


router.post('/order_booking',async function (req, res) {
var table_details = await waiter_tabledetailModel.findOne({rest_id:req.body.rest_id,table_no:req.body.table_no});
if(table_details !== null){
    let a = {
       "table_color_code": "#F2F4F4",
       "table_order_status": "",
    }
    waiter_tabledetailModel.findByIdAndUpdate(table_details._id, a, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Table Updated", Data : UpdatedDetails ,Code:200});
    });
} else {
  res.json({Status:"Success",Message:"Currently this table available", Data : {} ,Code:200});
}
});
































router.post('/fetch_order_by_id',async function (req, res) {
     var order_details = await waiter_order_detailModel.findOne({order_id: req.body.order_id});
     res.json({Status:"Success",Message:"order list details", Data : order_details ,Code:200});
});








router.post('/getting_shop_name', function (req, res) {
        kitchen_user_detailModel.findOne({shop_link_name:req.body.shop_link_name}, function (err, StateList) {
          let a = {
            Vendor_details : StateList
          }
          res.json({Status:"Success",Message:"company type List", Data : a ,Code:200});
        });
});



router.get('/deletes', function (req, res) {
      kitchen_user_detailModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"company type Deleted", Data : {} ,Code:200});     
      });
});


router.post('/getlist_id', function (req, res) {
        kitchen_user_detailModel.find({vendor_id:req.body._id}, function (err, StateList) {
          res.json({Status:"Success",Message:"company type List", Data : StateList ,Code:200});
        });
});



router.get('/getlist', function (req, res) {
        kitchen_user_detailModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"company type Details", Data : Functiondetails ,Code:200});
        });
});


router.get('/mobile/getlist', function (req, res) {
        kitchen_user_detailModel.find({}, function (err, Functiondetails) {
          let a = {
            usertypedata : Functiondetails
          }
          res.json({Status:"Success",Message:"company type Details", Data : a ,Code:200});
        });
});

router.post('/edit', function (req, res) {
        kitchen_user_detailModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"company type Updated", Data : UpdatedDetails ,Code:200});
        });
});



// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      kitchen_user_detailModel.findByIdAndRemove(req.body.Activity_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"company type Deleted successfully", Data : {} ,Code:200});
      });
});


module.exports = router;
