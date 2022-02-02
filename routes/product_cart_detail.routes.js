var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var product_cart_detailsModel = require('./../models/product_cart_detailsModel');
var notificationModel = require('./../models/notificationModel');


router.post('/add_product', async function(req, res) {
    var product_details = await product_cart_detailsModel.findOne({user_id :req.body.user_id,product_id:req.body.product_id});
    if(product_details == null){
  try{
        await product_cart_detailsModel.create({
            user_id:  req.body.user_id,
            product_id : req.body.product_id,
            cat_id : req.body.cat_id,
            product_count : 1
        }, 
        function (err, user) {
          res.json({Status:"Success",Message:"Product added to cart", Data : {} ,Code:200});
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}

        } else {
          let c = {
                product_count : product_details.product_count + 1
              }
             product_cart_detailsModel.findByIdAndUpdate(product_details._id, c, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500}); 
            res.json({Status:"Success",Message:"Product added successfully (Updated)", Data : {} ,Code:200}); 
          });
}
});




router.post('/cart_add_product', async function(req, res) {
    console.log(req.body);
    var product_details = await product_cart_detailsModel.findOne({user_id :req.body.user_id,product_id:req.body.product_id});
    if(product_details == null){
  try{
        await product_cart_detailsModel.create({
            user_id:  req.body.user_id,
            product_id : req.body.product_id,
            cat_id : req.body.cat_id,
            product_count : +req.body.count
        }, 
        function (err, user) {
          res.json({Status:"Success",Message:"Product added to cart", Data : {} ,Code:200});
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}

        } else {
          let c = {
                product_count : product_details.product_count + +req.body.count
              }
             product_cart_detailsModel.findByIdAndUpdate(product_details._id, c, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500}); 
            res.json({Status:"Success",Message:"Product added to cart", Data : {} ,Code:200}); 
          });
}
});





router.post('/remove_product', async function(req, res) {
    var product_details = await product_cart_detailsModel.findOne({user_id :req.body.user_id,product_id:req.body.product_id});
    let product_count = 0;
          let c = {
                product_count : product_details.product_count - 1
              }
          if(c.product_count == 0){
          product_cart_detailsModel.findByIdAndRemove(product_details._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Product Removed successfully", Data : {} ,Code:200});
           });
          }
          else{
          product_cart_detailsModel.findByIdAndUpdate(product_details._id, c, {new: true}, function (err, UpdatedDetails) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500}); 
          res.json({Status:"Success",Message:"Product Removed successfully", Data : {} ,Code:200}); 
          });
          }
});



router.post('/remove_overall_products', async function(req, res) {
    var product_details = await product_cart_detailsModel.find({user_id :req.body.user_id});
        if(product_details.length == 0){
          res.json({Status:"Success",Message:"Product Removed successfully", Data : {} ,Code:200});
        }else {
           for(let a  = 0 ; a < product_details.length ; a ++){
          product_cart_detailsModel.findByIdAndRemove(product_details[a]._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          if(a == product_details.length - 1){
            res.json({Status:"Success",Message:"Product Removed successfully", Data : {} ,Code:200});
          }          
         });
        }
        }
});



router.post('/remove_single_products', async function(req, res) {
    var product_details = await product_cart_detailsModel.find({user_id :req.body.user_id,product_id:req.body.product_id});
        if(product_details.length == 0){
          res.json({Status:"Success",Message:"Product Removed successfully", Data : {} ,Code:200});
        }else {
           for(let a  = 0 ; a < product_details.length ; a ++){
          product_cart_detailsModel.findByIdAndRemove(product_details[a]._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          if(a == product_details.length - 1){
            res.json({Status:"Success",Message:"Product Removed successfully", Data : {} ,Code:200});
          }          
         });
        }
        }
});


// router.post('/fetch_cart_details_by_userid', async function(req, res) {
//     var product_details = await product_cart_detailsModel.find({user_id :req.body.user_id}).populate('product_id');
//     var prodouct_total = 0 ;
//     var prodcut_count = 0;
//     var prodcut_item_count = 0;
//     var grand_total = 0;
//     if(product_details.length == 0){
//             res.json({Status:"Success",Message:"product cart successfully", Data : [] , prodouct_total : prodouct_total , shipping_charge : 0, discount_price : 0, grand_total : grand_total,prodcut_count : prodcut_count,prodcut_item_count : prodcut_item_count,Code:200});
//     }else{
//           for(let a = 0  ; a < product_details.length ; a ++){
//       prodouct_total = prodouct_total + product_details[a].product_id.cost * product_details[a].product_count;
//       prodcut_count = product_details.length;
//       prodcut_item_count =  prodcut_item_count + product_details[a].product_count;
//       grand_total = prodouct_total;
//       if(a == product_details.length - 1){
//             res.json({Status:"Success",Message:"product cart successfully", Data : product_details , prodouct_total : prodouct_total , shipping_charge : 0, discount_price : 0, grand_total : grand_total,prodcut_count : prodcut_count,prodcut_item_count : prodcut_item_count,Code:200});
//       }
//     }
//     }

// });





router.post('/fetch_cart_details_by_userid', async function(req, res) {
    var product_details = await product_cart_detailsModel.find({user_id :req.body.user_id}).populate('product_id cat_id');
    var prodouct_total = 0 ;
    var prodcut_count = 0;
    var prodcut_item_count = 0;
    var discount_price = 0;
    var grand_total = 0;
    if(product_details.length == 0){
            res.json({Status:"Success",Message:"Fetch cart details", Data : [] , prodouct_total : prodouct_total , shipping_charge : 0, discount_price : 0, grand_total : grand_total,prodcut_count : prodcut_count,prodcut_item_count : prodcut_item_count,Code:200});
    }else{
          for(let a = 0  ; a < product_details.length ; a ++){
      if(product_details[a].product_id.discount_amount !== 0 ){
      prodouct_total = prodouct_total + product_details[a].product_id.discount_amount * product_details[a].product_count;
      let temp = (product_details[a].product_id.discount_amount - product_details[a].product_id.cost) * product_details[a].product_count;
      discount_price = discount_price + temp;
      } else {
      prodouct_total = prodouct_total + product_details[a].product_id.cost * product_details[a].product_count;
      }
      // prodouct_total = prodouct_total + product_details[a].product_id.cost * product_details[a].product_count;
      prodcut_count = product_details.length;
      prodcut_item_count =  prodcut_item_count + product_details[a].product_count;
      if(a == product_details.length - 1){
            grand_total =  prodouct_total - discount_price;
            res.json({Status:"Success",Message:"Fetch cart details", Data : product_details , prodouct_total : prodouct_total , shipping_charge : 0, discount_price : discount_price, grand_total : grand_total,prodcut_count : prodcut_count,prodcut_item_count : prodcut_item_count,Code:200});
      }
    }
    }

});













router.post('/filter_date', function (req, res) {
        product_cart_detailsModel.find({}, function (err, StateList) {
          var final_Date = [];
          for(let a = 0; a < StateList.length; a ++){
            var fromdate = new Date(req.body.fromdate);
            var todate = new Date(req.body.todate);
            var checkdate = new Date(StateList[a].createdAt);
            if(checkdate >= fromdate && checkdate <= todate){
              final_Date.push(StateList[a]);
            }
            if(a == StateList.length - 1){
              res.json({Status:"Success",Message:"Demo screen List", Data : final_Date ,Code:200});
            }
          }
        });
});


router.get('/deletes', function (req, res) {
      product_cart_detailsModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"product categories screen  Deleted", Data : {} ,Code:200});     
      });
});


router.post('/getlist_id', function (req, res) {
        product_cart_detailsModel.find({Person_id:req.body.Person_id}, function (err, StateList) {
          res.json({Status:"Success",Message:"product categories screen  List", Data : StateList ,Code:200});
        });
});


router.post('/getlist_count',async function (req, res) {
        var notification_details = await notificationModel.find({user_id :req.body.user_id,delete_status:false}).count();
        product_cart_detailsModel.find({user_id:req.body.user_id}, function (err, StateList) {
         let count = 0;
         if(StateList.length == 0){
          let c = {
              notification_count : notification_details,
              product_count : count
             }
            res.json({Status:"Success",Message:"Product Count List", Data : c ,Code:200});
         }else{
           for(let a  = 0 ; a < StateList.length ; a ++){
          count = count +  StateList[a].product_count;

          if(a == StateList.length - 1){
             let c = {
              notification_count : notification_details,
              product_count : count
             }
             console.log(c);
             res.json({Status:"Success",Message:"Product Count List", Data : c ,Code:200});
          }
         }
         }
        });
});



router.get('/getlist', function (req, res) {
        product_cart_detailsModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"product categories screen  Details", Data : Functiondetails ,Code:200});
        }).populate('product_id');
});


router.get('/mobile/getlist', function (req, res) {
        product_cart_detailsModel.find({show_status:true}, function (err, Functiondetails) {
          let a ={
             SplashScreendata : Functiondetails
          }
          res.json({Status:"Success",Message:"product categories screen  Details", Data : a ,Code:200});
        });
});


router.post('/edit', function (req, res) {
        product_cart_detailsModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"product categories screen  Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      product_cart_detailsModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"product categories screen Deleted successfully", Data : {} ,Code:200});
      });
});

module.exports = router;
