var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var newproduct_detailModel = require('./../models/newproduct_detailModel');
var product_detailsModel = require('./../models/product_detailsModel');

router.post('/create', async function(req, res) {
    req.body.cost = +req.body.cost;
    console.log(req.body);
  try{
        await newproduct_detailModel.create({
            user_id :  req.body.user_id,
            cat_id :  req.body.cat_id,
            // sub_cat_id:req.body.sub_cat_id,
            breed_type : req.body.breed_type,
            pet_type : req.body.pet_type,
            age : req.body.age,
            threshould : req.body.threshould || "",
            product_name : req.body.product_name || "",
            product_discription : req.body.product_discription || "",
            product_img :req.body.product_img || [],
            related : req.body.related || "",
            count : req.body.count || 0,
            status : req.body.status || "",
            verification_status : req.body.verification_status || "",
            date_and_time : req.body.date_and_time || "",
            mobile_type : req.body.mobile_type || "",
            delete_status : req.body.delete_status || false,
            fav_status : false,
            today_deal : false,
            cost : +req.body.cost.toFixed(0) || 0,
            discount : req.body.discount || 0,
            discount_amount : req.body.discount_amount || 0,
            discount_status : req.body.discount_status || false,
            discount_cal : req.body.discount_cal || 0,
            discount_start_date : req.body.discount_start_date || "",
            discount_end_date : req.body.discount_end_date || "",
            product_rating :  5,
            product_review :  0,
        }, 
        function (err, user) {
        console.log(err);
        res.json({Status:"Success",Message:"product details screen Added successfully", Data : user ,Code:200}); 
        });
}
catch(e){
    console.log(e);
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});



















router.post('/vendor_product_create', async function(req, res) {
// var new_product_detail = await newproduct_detailModel.findOne({_id: req.body._id});
// console.log(new_product_detail);
    req.body.cost = +req.body.cost;
    console.log("Product_details***********",req.body);
  try{
        await product_detailsModel.create({
            user_id :  req.body.vendor_id,
            cat_id :  req.body.cat_id,
            thumbnail_image : req.body.thumbnail_image,
            product_img : req.body.product_img || [],
            product_name : req.body.product_name || "",
            cost : +req.body.cost.toFixed(0) || 0,
            product_discription : req.body.product_discription || "",
            condition : req.body.condition || "",
            price_type : req.body.price_type || "",
            addition_detail : req.body.addition_detail || "",
            date_and_time : req.body.date_and_time || "",
            threshould : req.body.threshould || "",
            mobile_type : req.body.mobile_type || "",
            related :  "",
            count :  0,
            status :  "true",
            verification_status :  "Not Verified",
            delete_status : false,
            fav_status : false,
            today_deal : false,
            discount :  0,
            discount_amount :  0,
            discount_status :  false,
            discount_cal :  0,
            discount_start_date :  "",
            discount_end_date :  "",
            product_rating :  5,
            product_review :  0,
        }, 
        function (err, user) {
        console.log(err);
        console.log("Product_details***********1",user);
        res.json({Status:"Success",Message:"product details added successfully", Data : user ,Code:200}); 
        });
}
catch(e){
    console.log(e);
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});








router.post('/test_create', async function(req, res) { 
  try{
        await newproduct_detailModel.create({
            cat_id :  req.body.cat_id,
            sub_cat_id : req.body.sub_cat_id,
            pet_type : req.body.pet_type,
            breed_type : req.body.breed_type,
            age : req.body.age,
            product_discription : req.body.product_discription,
            product_img :req.body.product_img,
            product_name : req.body.product_name,
            date_and_time : req.body.date_and_time,
            delete_status : req.body.delete_status,
        }, 
        function (err, user) {
        res.json({Status:"Success",Message:"product details screen Added successfully", Data : user ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});



router.post('/filter_date', function (req, res) {
       // console.log(req.body);
        newproduct_detailModel.find({}, function (err, StateList) {
          console.log(err);
          // console.log("StateList",StateList);
          var final_Date = [];
          for(let a = 0; a < StateList.length; a ++){
            var fromdate = new Date(req.body.fromdate);
            var todate = new Date(req.body.todate);
            console.log(StateList[a].createdAt);
            var checkdate = new Date(StateList[a].createdAt);
            console.log(fromdate,todate,checkdate);
            if(checkdate >= fromdate && checkdate <= todate){
              final_Date.push(StateList[a]);
            }
            if(a == StateList.length - 1){
              res.json({Status:"Success",Message:"doctor_specModels  List", Data : final_Date ,Code:200});
            }
          }
        });
});




router.post('/mark_deal', function (req, res) {
 let c = {
    today_deal : req.body.status
  }
  newproduct_detailModel.findByIdAndUpdate(req.body._id, c, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Product Updated", Data : {} ,Code:200});
  });
});


router.post('/fetch_product_by_cat',async function (req, res) {
     if(req.body.cat_id == ""){
        req.body.skip_count = req.body.skip_count - 1 ;
        req.body.skip_count = req.body.skip_count * 5 ;
        var product_list = await newproduct_detailModel.find({}).skip(+req.body.skip_count).limit(5);
        var today_deals = [];
        if(product_list.length == 0){
         res.json({Status:"Success",Message:"product list", Data : [] , product_list_count :product_list_count, Code:200});  
        }
         for(let y = 0 ; y < product_list.length;y++){
          var product_lists = await product_detailsModel.findOne({user_id : req.body.vendor_id,product_name:product_list[y].product_name});
          let status = false;
          if(product_lists == null){
             status = false;
          }else{
             status = true;
          }
          console.log(product_list[y]);
            let k = {
                        "_id": product_list[y]._id,
                        "product_img":  product_list[y].product_img[0],
                        "product_title":  product_list[y].product_name,
                        "product_discription" : product_list[y].product_discription,
                        "status" : status
                    }
                  today_deals.push(k);
         if(y == product_list.length - 1){
          res.json({Status:"Success",Message:"product list", Data : today_deals , product_list_count :product_list_count, Code:200});  
         }
        }
     }else{
        var product_list_count = await newproduct_detailModel.count({cat_id:req.body.cat_id});
        req.body.skip_count = req.body.skip_count - 1 ;
        req.body.skip_count = req.body.skip_count * 5 ;
        var product_list = await newproduct_detailModel.find({cat_id:req.body.cat_id}).skip(+req.body.skip_count).limit(5);
        var today_deals = [];
        if(product_list.length == 0){
         res.json({Status:"Success",Message:"product list", Data : [] , product_list_count :product_list_count, Code:200});  
        }
         for(let y = 0 ; y < product_list.length;y++){
          var product_lists = await product_detailsModel.findOne({user_id : req.body.vendor_id,product_name:product_list[y].product_name});
          let status = false;
          if(product_lists == null){
             status = false;
          }else{
             status = true;
          }
            let k = {
                        "_id": product_list[y]._id,
                        "product_img":  product_list[y].product_img[0],
                        "product_title":  product_list[y].product_name,
                        "product_discription" : product_list[y].product_discription,
                        "status" : status
                    }
                  today_deals.push(k);
         if(y == product_list.length - 1){
          res.json({Status:"Success",Message:"product list", Data : today_deals , product_list_count :product_list_count, Code:200});  
         }
        }
      // product_detailsModel.remove({}, function (err, user) {
      //     if (err) return res.status(500).send("There was a problem deleting the user.");
      //        res.json({Status:"Success",Message:"product details screen  Deleted", Data : {} ,Code:200});     
      // }).skip(2).limit(10);

     }
});




router.get('/getlist', function (req, res) {
        newproduct_detailModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"product details screen  Details", Data : Functiondetails ,Code:200});
        }).populate('cat_id sub_cat_id breed_type pet_type');
});


router.get('/mobile/getlist', function (req, res) {
        newproduct_detailModel.find({show_status:true}, function (err, Functiondetails) {
          let a ={
             SplashScreendata : Functiondetails
          }
          res.json({Status:"Success",Message:"product details screen  Details", Data : a ,Code:200});
        });
});


router.post('/delete', function (req, res) {
 let c = {
    delete_status : true
  }
  newproduct_detailModel.findByIdAndUpdate(req.body._id, c, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Location Deleted successfully", Data : UpdatedDetails ,Code:200});
  });
});

router.get('/deletes', function (req, res) {
      newproduct_detailModel.remove({}, function (err, user) {
      if (err) return res.status(500).send("There was a problem deleting the user.");
      res.json({Status:"Success",Message:"Doctor_time Details Deleted", Data : {} ,Code:200});     
      });
});


router.post('/edit', function (req, res) {
        product_detailsModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"product details screen  Updated", Data : UpdatedDetails ,Code:200});
        });
});


// // DELETES A USER FROM THE DATABASE
router.post('/admin_delete', function (req, res) {
      newproduct_detailModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"product details screen Deleted successfully", Data : {} ,Code:200});
      });
});

module.exports = router;
