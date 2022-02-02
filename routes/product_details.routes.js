var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var product_detailsModel = require('./../models/product_detailsModel');
var product_categoriesModel = require('./../models/product_categoriesModel');
var vendor_banner_detailModel = require('./../models/vendor_banner_detailModel');

var product_cart_detailsModel = require('./../models/product_cart_detailsModel');
var vendor_order_bookingModel = require('./../models/vendor_order_bookingModel');


var product_rate_reviewModel = require('./../models/product_rate_reviewModel');


var product_vendorModel = require('./../models/product_vendorModel');
var Product_favModel = require('./../models/Product_favModel');


router.post('/create', async function(req, res) {
    req.body.cost = +req.body.cost;
  try{
        await product_detailsModel.create({
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
            delete_status : false,
            fav_status : false,
            today_deal : false,
            cost : +req.body.cost.toFixed(0) || 0,
            discount : req.body.discount || 0,
            discount_amount : req.body.discount_amount || 0,
            discount_status : req.body.discount_status || false,
            discount_cal : req.body.discount_cal || 0,
            discount_start_date : req.body.discount_start_date || "",
            discount_end_date : req.body.discount_end_date || "",
            thumbnail_image : req.body.thumbnail_image || "",
            product_rating :  5,
            product_review :  0,
            
            condition : req.body.condition || "",
            price_type : req.body.price_type || "",
            addition_detail : req.body.addition_detail || "",

        }, 
        function (err, user) {
        res.json({Status:"Success",Message:"product details screen Added successfully", Data : user ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});








router.post('/test_create', async function(req, res) { 
  try{
        await product_detailsModel.create({
            user_id :  req.body.user_id,
            cat_id :  req.body.cat_id,
            sub_cat_id : req.body.sub_cat_id,
            pet_type : req.body.pet_type,
            breed_type : req.body.breed_type,
            age : req.body.age,
            cast : req.body.cast,
            threshould : req.body.threshould,
            product_discription : req.body.product_discription,
            product_img :req.body.product_img,
            discount : req.body.discount,
            related : req.body.related,
            count : req.body.count,
            status : req.body.status,
            verification_status : req.body.verification_status,
            date_and_time : req.body.date_and_time,
            mobile_type : req.body.mobile_type,
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




router.post('/today_deal',async function (req, res) {
        var product_list_count = await product_detailsModel.count({today_deal : true,delete_status : false});
        req.body.skip_count = req.body.skip_count - 1 ;
        req.body.skip_count = req.body.skip_count * 5 ;
        var product_list = await product_detailsModel.find({today_deal : true,delete_status : false}).skip(+req.body.skip_count).limit(5);
        var today_deals = [];
        if(product_list.length == 0) {
         res.json({Status:"Success",Message:"todays product list", Data : [] , product_list_count :product_list_count, Code:200});  
        }
         for(let y = 0 ; y < product_list.length;y++) {
         if(product_list[y].today_deal == true) {
            let k = {
                        "_id": product_list[y]._id,
                        "product_img":  product_list[y].product_img[0],
                        "product_title":  product_list[y].product_name,
                        "thumbnail_image" : product_list[y].thumbnail_image || "",
                        "product_price":  +product_list[y].cost.toFixed(0),
                        "product_discount":  product_list[y].discount,
                        "product_discount_price" :  +product_list[y].discount_amount.toFixed(0) || 0,
                        "product_fav": false,
                        "product_rating": product_list[y].product_rating || 5 ,
                        "product_review": product_list[y].product_review || 0 ,
                    }
            today_deals.push(k);
         }
         if(y == product_list.length - 1){
          res.json({Status:"Success",Message:"todays product list", Data : today_deals , product_list_count :product_list_count, Code:200});  
         }
        }
      // product_detailsModel.remove({}, function (err, user) {
      //     if (err) return res.status(500).send("There was a problem deleting the user.");
      //        res.json({Status:"Success",Message:"product details screen  Deleted", Data : {} ,Code:200});     
      // }).skip(2).limit(10);
});




router.post('/fetch_product_by_cat',async function (req, res) {
        var product_list_count = await product_detailsModel.count({cat_id:req.body.cat_id,delete_status : false});
        req.body.skip_count = req.body.skip_count - 1 ;
        req.body.skip_count = req.body.skip_count * 5 ;
        var product_list = await product_detailsModel.find({cat_id:req.body.cat_id,delete_status : false}).skip(+req.body.skip_count).limit(5);
        var today_deals = [];
        if(product_list.length == 0){
         res.json({Status:"Success",Message:"product list", Data : [] , product_list_count :product_list_count, Code:200});  
        }
         for(let y = 0 ; y < product_list.length;y++){
            let k = {
                        "_id": product_list[y]._id,
                        "product_img":  product_list[y].product_img[0],
                        "product_title":  product_list[y].product_name,
                        "product_price":  +product_list[y].cost.toFixed(0),
                        "thumbnail_image" : product_list[y].thumbnail_image || "",
                        "product_discount":  product_list[y].discount,
                        "product_discount_price" :  +product_list[y].discount_amount.toFixed(0) || 0,
                        "product_fav": false,
                        "product_rating": product_list[y].product_rating || 5 ,
                        "product_review": product_list[y].product_review || 0 ,
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
});



router.post('/fetch_product_by_id',async function (req, res) {
      var product_details = await product_cart_detailsModel.findOne({user_id :req.body.user_id,product_id:req.body.product_id,delete_status : false});

      // var vendor_details = await product_vendorModel.findOne({user_id :product_details.user_id});
      var product_list = await product_detailsModel.findOne({_id:req.body.product_id,delete_status : false}).populate('cat_id breed_type pet_type'); 

      var vendor_details = await product_vendorModel.findOne({_id :product_list.user_id,delete_status : false});
      var related_product_list = await product_detailsModel.find({product_name:product_list.product_name,delete_status : false}).limit(10);
      var final_related_product = [];
       for(let y = 0 ; y < related_product_list.length;y++){

        var pro_fav = await Product_favModel.findOne({user_id:req.body.user_id,product_id:related_product_list[y]._id,delete_status : false});
        var temp_fav = false;
        if(pro_fav !==  null){
               temp_fav = true;
        }
            let k = {
                        "_id": related_product_list[y]._id,
                        "product_img":  related_product_list[y].product_img[0],
                        "product_title":  related_product_list[y].product_name,
                        "product_price":  +related_product_list[y].cost.toFixed(0),
                        "thumbnail_image": related_product_list[y].thumbnail_image || 'http://54.212.108.156:3000/api/uploads/Pic_empty.jpg',
                        "product_discount":  related_product_list[y].discount,
                        "product_discount_price" :  +related_product_list[y].discount_amount.toFixed(0) || 0,
                        "product_fav": temp_fav,
                        "product_rating": related_product_list[y].product_rating || 5 ,
                        "product_review": related_product_list[y].product_review || 0 ,
                        "thumbnail_image" : related_product_list[y].thumbnail_image || "",
                    }
                  final_related_product.push(k);
        }
        var product_count = 0;
        if(product_details == null){
            product_count = 0;
        }else{
            product_count = product_details.product_count;
        }
        var pro_fav = await Product_favModel.findOne({user_id:req.body.user_id,product_id:product_list._id,delete_status : false});
        var temp_fav = false;
        if(pro_fav !==  null){
               temp_fav = true;
        }
     let a = {
                        "_id": product_list._id,
                        "product_img":  product_list.product_img,
                        "product_title":  product_list.product_name,
                        "product_price":  +product_list.cost.toFixed(0),
                        "product_discount":  product_list.discount,
                        "product_discount_price" :  +product_list.discount_amount.toFixed(0) || 0,
                        "thumbnail_image": product_list.thumbnail_image || 'http://54.212.108.156:3000/api/uploads/Pic_empty.jpg',
                        "breed_type"  : product_list.breed_type,
                        "pet_type" : product_list.pet_type,
                        "age" : product_list.age,
                        "cat_id" : product_list.cat_id,
                        "threshould" : product_list.threshould,
                        "product_discription" : product_list.product_discription,
                        "product_fav": temp_fav,
                        "product_rating": product_list.product_rating || 5 ,
                        "product_review": product_list.product_review || 0 ,
                        "product_related" : final_related_product,
                        "product_cart_count" : product_count
    }
      res.json({Status:"Success",Message:"product list",Product_details : a,vendor_details : vendor_details ,Code:200}); 
});





router.post('/getproductdetails_list',async function (req, res) {
    var product_list = await product_detailsModel.find({delete_status : false}).sort({_id:-1});
    // product_list.sort(function compare(a, b) {
    //            var dateA = new Date(a.updatedAt);
    //            var dateB = new Date(b.updatedAt);
    //            return dateB - dateA;
    //            });
    var today_deals = [];
    for(let y = 0 ; y < product_list.length ;  y ++){
         if(product_list[y].today_deal == true){
        if(today_deals.length < 5){
        var pro_fav = await Product_favModel.findOne({user_id:req.body.user_id,product_id:product_list[y]._id,delete_status : false});
        var temp_fav = false;
        if(pro_fav !==  null){
               temp_fav = true;
        }
            let k = {
                        "_id": product_list[y]._id,
                        "product_img":  product_list[y].product_img[0],
                        "product_title":  product_list[y].product_name,
                        'thumbnail_image' : product_list[y].thumbnail_image || 'http://54.212.108.156:3000/api/uploads/Pic_empty.jpg',
                        "product_price":  +product_list[y].cost.toFixed(0),
                        "product_discount":  product_list[y].discount || 0,
                        "product_discount_price" :  +product_list[y].discount_amount.toFixed(0) || 0,
                        "product_fav": temp_fav,
                        "product_rating": product_list[y].product_rating || 5 ,
                        "product_review": product_list[y].product_review || 0 ,
                    }
                  today_deals.push(k);
              }
         }
    }
    var Banner_details = [];
    var test_banner_details = await vendor_banner_detailModel.find({delete_status : false}).sort({_id:-1});
    for(let b  = 0 ; b < test_banner_details.length ; b ++){
        let c = {
                "banner_img": test_banner_details[b].img_path,
                "banner_title": test_banner_details[b].img_title,
            }
            Banner_details.push(c);
    }
    var product_list = await product_detailsModel.find({delete_status : false}).sort({_id:-1});
    var product_cate = await product_categoriesModel.find({delete_status : false}).sort({_id:-1});
    var Product_details = [];
    for(let a = 0 ; a < product_cate.length ; a ++){
          temp_product = [];
          for(let f = 0 ; f < product_list.length ; f++){
                if( ""+product_cate[a]._id ==  ""+product_list[f].cat_id){
      if(temp_product.length < 5){
        var pro_fav = await Product_favModel.findOne({user_id:req.body.user_id,product_id:product_list[f]._id,delete_status : false});
        var temp_fav = false;
        if(pro_fav !==  null){
               temp_fav = true;
        }

                  	let k = {
                        "_id": product_list[f]._id,
                        "product_img":  product_list[f].product_img[0],
                        "product_title":  product_list[f].product_name,
                        'thumbnail_image' : product_list[f].thumbnail_image || 'http://54.212.108.156:3000/api/uploads/Pic_empty.jpg',
                        "product_price":  +product_list[f].cost.toFixed(0),
                        "product_discount":  product_list[f].discount,
                        "product_discount_price" :  +product_list[f].discount_amount.toFixed(0) || 0,
                        "product_fav": temp_fav,
                        "product_rating": product_list[f].product_rating || 5 ,
                        "product_review": product_list[f].product_review || 0 ,
                    }
                  temp_product.push(k);
                  }
                }
            if(f == product_list.length - 1){
            let c = {
            "cat_id" : product_cate[a]._id,
            "cat_name": product_cate[a].product_cate,
            "product_list": temp_product
        }
        Product_details.push(c);
            }
          }
        if(a == product_cate.length - 1){
        }
    }
  let a =  {
        "Banner_details": [],
        "Today_Special": [],
        "Product_details": [],
        "product_cate" : product_cate
    }
    a.Today_Special = today_deals;
    a.Banner_details = Banner_details;
    a.Product_details = Product_details;


   res.json({Status:"Success",Message:"product list", Data : a ,Code:200});     

});




router.post('/filter',async function (req, res) {
   console.log("filter",req.body);
    let product_details  =  await product_detailsModel.find({delete_status : false});
    // console.log(product_details);
    var pet_type_data = [];
    var breed_type_data = [];
    var discount_data = [];
    var final_data = [];
    pet_type_check(product_details);
    function pet_type_check(product_details){
        if(req.body.pet_type == ''){
         pet_type_data = product_details;
         breed_type_check(pet_type_data);
            console.log("Test 1");
        } else {
         for(let a  = 0 ; a < product_details.length; a ++){
             let temp_type = product_details[a].pet_type;
             for(b = 0 ; b < temp_type.length ; b ++){
                 if(temp_type[b] == req.body.pet_type){
                    pet_type_data.push(product_details[a]);
                 }
             }
           if(a == product_details.length - 1){
              breed_type_check(pet_type_data);
              console.log("Test 1");
           }
         }
        }
    }    
    function breed_type_check(pet_type_data){
       if(req.body.pet_breed == ''){
         breed_type_data = pet_type_data;
         discount_type_check(breed_type_data);
            console.log("Test 2");
        } else {
        for(let a  = 0 ; a < pet_type_data.length; a ++){
             let temp_breed_type = pet_type_data[a].breed_type;
             for(b = 0 ; b < temp_breed_type.length ; b ++){
                 if(temp_breed_type[b] == req.body.pet_breed){
                    breed_type_data.push(pet_type_data[a]);
                 }
             }
           if(a == pet_type_data.length - 1){
              discount_type_check(breed_type_data);
                 console.log("Test 2");
           }
         }
        }
    }  
    function discount_type_check(breed_type_data){
        if(req.body.discount_value == ''){
         discount_data = breed_type_data;
            console.log("Test 3");
         cat_type_check(discount_data);
        } else {
          var discount_value = 0;
          if(req.body.discount_value == "0"){
            discount_value = 0;
          }
          else if(req.body.discount_value == "1")
          {
            discount_value = 10;
          } 
          else if(req.body.discount_value == "2")
          {
            discount_value = 20;
          } 
          else if(req.body.discount_value == "3")
          {
            discount_value = 30;
          } 
          if(req.body.discount_value == "0"){
               
               console.log(breed_type_data.length);
               console.log(breed_type_data);

             if(breed_type_data.length == 0){
                 cat_type_check(discount_data);
             }
             else{
            for(let a  = 0  ; a < breed_type_data.length ; a ++){
            if(10 > breed_type_data[a].discount){
               discount_data.push(breed_type_data[a]);
            }
            if(a == breed_type_data.length - 1){
               cat_type_check(discount_data);
            }
          }
        
         }




          }else{

              if(breed_type_data.length == 0){
                 cat_type_check(discount_data);
              }
             else{
            for(let a  = 0  ; a < breed_type_data.length ; a ++){

            if(discount_value <= breed_type_data[a].discount){
               discount_data.push(breed_type_data[a]);
            }
            if(a == breed_type_data.length - 1){
               cat_type_check(discount_data);
            }
          }
      }
          }
             console.log("Test 3");
        }  
    }  
    function cat_type_check(discount_data){
        if(req.body.cat_id == ''){
            console.log("Test 4");
             final_data = discount_data;
             var today_deals = [];
             var product_list = final_data
            for(let y = 0 ; y < product_list.length ;  y ++){
                let k = {
                        "_id": product_list[y]._id,
                        "product_img":  product_list[y].product_img[0],
                        "product_title":  product_list[y].product_name,
                        "product_price":  +product_list[y].cost.toFixed(0),
                        "product_discount":  product_list[y].discount,
                        "thumbnail_image" : product_list[y].thumbnail_image || "",
                        "product_discount_price" :  +product_details[y].discount_amount.toFixed(0) || 0,
                        "product_fav": false,
                        "product_rating": product_list[y].product_rating || 5 ,
                        "product_review": product_list[y].product_review || 0 ,
                    }
                  today_deals.push(k);
         }
            res.json({Status:"Success",Message:"product details", Data : today_deals ,Code:200});     
        }else{
            console.log("Test 4");
              final_data = discount_data;
             var today_deals = [];
             var product_list = final_data
            for(let y = 0 ; y < product_list.length ;  y ++){
                let k = {
                        "_id": product_list[y]._id,
                        "product_img":  product_list[y].product_img[0],
                        "product_title":  product_list[y].product_name,
                        "product_price":  +product_list[y].cost.toFixed(0),
                        "thumbnail_image" : product_list[y].thumbnail_image || "",
                        "product_discount":  product_list[y].discount,
                        "product_discount_price" :  +product_details[y].discount_amount.toFixed(0) || 0,
                        "product_fav": false,
                        "product_rating": product_list[y].product_rating || 5 ,
                        "product_review": product_list[y].product_review || 0 ,
                    }
                  today_deals.push(k);
         }
            res.json({Status:"Success",Message:"filter product list", Data : today_deals ,Code:200});  
        }
    }  

});





router.post('/text_search',async function (req, res) {
    let product_details  =  await product_detailsModel.find({delete_status : false});
    var keyword = req.body.search_string.toLowerCase();
    var final_data = [];
    for(let a  = 0 ; a < product_details.length; a ++){
    var doctorname = product_details[a].product_name.toLowerCase();
    if(doctorname.indexOf(keyword) !== -1 == true){

       let k = {
                        "_id": product_details[a]._id,
                        "product_img":  product_details[a].product_img[0],
                        "product_title":  product_details[a].product_name,
                        "product_price":  +product_details[a].cost.toFixed(0),
                        "product_discount":  product_details[a].discount,
                        "thumbnail_image" : product_details[a].thumbnail_image || "",
                        "product_fav": false,
                        "product_rating":  product_details[a].product_rating || 5 ,
                        "product_review":  product_details[a].product_review || 0 ,
                }
     final_data.push(k);
    }
    if(a == product_details.length - 1)
    {
     res.json({Status:"Success",Message:"text search product details", Data : final_data ,Code:200});     
    }
    }
});


router.post('/cat_text_search',async function (req, res) {
    let product_details  =  await product_detailsModel.find({cat_id : req.body.cat_id,delete_status : false});
    var keyword = req.body.search_string.toLowerCase();
    var final_data = [];
    for(let a  = 0 ; a < product_details.length; a ++){
    var doctorname = product_details[a].product_name.toLowerCase();
    if(doctorname.indexOf(keyword) !== -1 == true){

       let k = {
                        "_id": product_details[a]._id,
                        "product_img":  product_details[a].product_img[0],
                        "product_title":  product_details[a].product_name,
                        "product_price":  +product_details[a].cost.toFixed(0),
                        "product_discount":  product_details[a].discount,
                        "product_discount_price" :  +product_details[a].discount_amount.toFixed(0) || 0,
                        "thumbnail_image" : product_details[a].thumbnail_image || "",
                        "product_fav": false,
                        "product_rating":  product_details[a].product_rating || 5 ,
                        "product_review":  product_details[a].product_review || 0 ,
                }
     final_data.push(k);
    }
    if(a == product_details.length - 1)
    {
     res.json({Status:"Success",Message:"text search product details", Data : final_data ,Code:200});     
    }
    }
});



router.post('/todaydeal_text_search',async function (req, res) {
    let product_details  =  await product_detailsModel.find({today_deal : true,delete_status : false});
    var keyword = req.body.search_string.toLowerCase();
    var final_data = [];
    for(let a  = 0 ; a < product_details.length; a ++){
    var doctorname = product_details[a].product_name.toLowerCase();
    if(doctorname.indexOf(keyword) !== -1 == true){
       let k = {
                        "_id": product_details[a]._id,
                        "product_img":  product_details[a].product_img[0],
                        "product_title":  product_details[a].product_name,
                        "product_price":  +product_details[a].cost.toFixed(0),
                        "product_discount":  product_details[a].discount,
                        "product_discount_price" :  +product_details[a].discount_amount.toFixed(0) || 0,
                        "thumbnail_image" : product_details[a].thumbnail_image || "",
                        "product_fav": false,
                        "product_rating":   product_details[a].product_rating || 5 ,
                        "product_review":   product_details[a].product_review || 0 ,
                }
     final_data.push(k);
    }
    if(a == product_details.length - 1)
    {
     res.json({Status:"Success",Message:"text search product details", Data : final_data ,Code:200});     
    }
    }
});





router.post('/mobile/getlist_from_vendor_id1', function (req, res) {
     if(req.body.search_string == ""){
        product_detailsModel.find({user_id:req.body.vendor_id,delete_status : false}, function (err, StateList) {
            var  final_data  = [];
            if(StateList.length == 0 ){
            res.json({Status:"Success",Message:"Product details list", Data : StateList ,Code:200});
            }
            else{
             for(let a  = 0 ; a < StateList.length ; a ++){
                 if(+StateList[a].cost.toFixed(0) == 0){
                    StateList[a].cost = 1;             
                 } 
                   // let c = {
                   //      cat_id : StateList[a].cat_id,
                   //      product_id : StateList[a]._id,
                   //      products_image : StateList[a].product_img,
                   //      thumbnail_image :  StateList[a].thumbnail_image,
                   //      product_name : StateList[a].product_name,
                   //      product_desc : StateList[a].product_discription,
                   //      product_price : +StateList[a].cost.toFixed(0),
                   //      pet_threshold :  StateList[a].threshould,
                   //      today_deal : StateList[a].today_deal,
                   // }
                   // final_data.push(c);
                if(a == StateList.length - 1){
                    console.log(final_data);
                   res.json({Status:"Success",Message:"Product details list", Data : StateList ,Code:200});
 
                }
            }
            }
        }).populate('cat_id');
     }else{

          var keyword = req.body.search_string.toLowerCase();
          product_detailsModel.find({user_id:req.body.vendor_id,delete_status : false}, function (err, StateList) {
            var  final_data  = [];
            if(StateList.length == 0 ){
                      console.log(StateList);
            res.json({Status:"Success",Message:"Product details list", Data : StateList ,Code:200});
            }
            else{

             for(let b  = 0 ; b < StateList.length ; b ++){
     var doctorname = StateList[b].product_name.toLowerCase();
     if(doctorname.indexOf(keyword) !== -1 == true){
                 if(+StateList[b].cost.toFixed(0) == 0){
                    StateList[b].cost = 1;             
                 } 
                   // let c = {
                   //      cat_id : StateList[b].cat_id,
                   //      product_id : StateList[b]._id,
                   //      thumbnail_image :  StateList[b].thumbnail_image,
                   //      products_image : StateList[b].product_img,
                   //      product_name : StateList[b].product_name,
                   //      product_price : +StateList[b].cost.toFixed(0),
                   //      pet_threshold :  StateList[b].threshould,
                   //      today_deal : StateList[b].today_deal,
                   // }
                   // final_data.push(c);
                 }   
                if(b == StateList.length - 1){
                       console.log(final_data);
                   res.json({Status:"Success",Message:"Product details list", Data : StateList ,Code:200});
 
                }
            }
            }
        }).populate('cat_id');
     }
});






// router.post('/vendor_text_search',async function (req, res) {
//     let product_details  =  await product_detailsModel.find({user_id : req.body.vendor_id});
//     var keyword = req.body.search_string.toLowerCase();
//     var final_data = [];
//     for(let a  = 0 ; a < product_details.length; a ++){
//     var doctorname = product_details[a].product_name.toLowerCase();
//     if(doctorname.indexOf(keyword) !== -1 == true){
//        let k = {
//                         "_id": product_details[a]._id,
//                         "product_img":  product_details[a].product_img[0],
//                         "product_title":  product_details[a].product_name,
//                         "product_price":  product_details[a].cost.toFixed(0),
//                         "product_discount":  product_details[a].discount,
//                         "product_fav": false,
//                         "product_rating": 4.8,
//                         "product_review": 232
//                 }
//      final_data.push(k);
//     }
//     if(a == product_details.length - 1)
//     {
//      res.json({Status:"Success",Message:"product details", Data : final_data ,Code:200});     
//     }
//     }
// });

router.post('/sort1',async function (req, res) {
    let product_details  =  await product_detailsModel.find({delete_status : false});
    // var ascending = product_details.sort((a, b) => Number(a.cost) - Number(b.cost));
    // var descending_discount = product_details.sort((a, b) => Number(b.discount) - Number(a.discount));
    // var descending = product_details.sort((a, b) => Number(b.cost) - Number(a.cost));
    var final_data = [];
    if(req.body.recent == 1){
        product_details.sort(function compare(a, b) {
               var dateA = new Date(a.updatedAt);
               var dateB = new Date(b.updatedAt);
               return dateB - dateA;
        });
        for(let a  = 0 ; a < product_details.length; a ++){
            let k = {
                            "_id": product_details[a]._id,
                            "product_img":  product_details[a].product_img[0],
                            "product_title":  product_details[a].product_name,
                            "product_price":  +product_details[a].cost.toFixed(0),
                            "product_discount":  product_details[a].discount,
                            "thumbnail_image" : product_list[a].thumbnail_image || "",
                            "product_fav": false,
                            "product_rating":  product_details[a].product_rating || 5 ,
                            "product_review":  product_details[a].product_review || 0 ,
                            "createdAt" : product_details[a].updatedAt
                    }
         final_data.push(k);
        if(a == product_details.length - 1)
        {
         res.json({Status:"Success",Message:"product details", Data : final_data ,Code:200});     
        }
        }
    } else if(req.body.high_discount == 1){
   product_details.sort(function(a,b) {
    return b.discount - a.discount;
   });
for(let a  = 0 ; a < product_details.length; a ++){
            let k = {
                            "_id": product_details[a]._id,
                            "product_img":  product_details[a].product_img[0],
                            "product_title":  product_details[a].product_name,
                            "product_price":  +product_details[a].cost.toFixed(0),
                            "product_discount":  product_details[a].discount,
                            "thumbnail_image" : product_list[a].thumbnail_image || "",
                            "product_fav": false,
                            "product_rating":  product_details[a].product_rating || 5 ,
                            "product_review":  product_details[a].product_review || 0 ,
                            "createdAt" : product_details[a].updatedAt
                    }
         final_data.push(k);
        if(a == product_details.length - 1)
        {
         res.json({Status:"Success",Message:"product details", Data : final_data ,Code:200});     
        }
        }
    } else if(req.body.best_sellers == 1){




    } else if(req.body.high_to_low == 1){
 product_details.sort(function(a,b) {
    return b.cost - a.cost;
   });
for(let a  = 0 ; a < product_details.length; a ++){
            let k = {
                            "_id": product_details[a]._id,
                            "product_img":  product_details[a].product_img[0],
                            "product_title":  product_details[a].product_name,
                            "product_price":  +product_details[a].cost.toFixed(0),
                            "product_discount":  product_details[a].discount,
                            "thumbnail_image" : product_list[a].thumbnail_image || "",
                            "product_fav": false,
                            "product_rating":   product_details[a].product_rating || 5 ,
                            "product_review":   product_details[a].product_review || 0 ,
                            "createdAt" : product_details[a].updatedAt
                    }
         final_data.push(k);
        if(a == product_details.length - 1)
        {
         res.json({Status:"Success",Message:"product details", Data : final_data ,Code:200});     
        }
        }


    } else if(req.body.low_to_high == 1){
 product_details.sort(function(a,b) {
    return a.cost - b.cost;
   });
for(let a  = 0 ; a < product_details.length; a ++){
            let k = {
                            "_id": product_details[a]._id,
                            "product_img":  product_details[a].product_img[0],
                            "product_title":  product_details[a].product_name,
                            "product_price":  +product_details[a].cost.toFixed(0),
                            "product_discount":  product_details[a].discount,
                            "thumbnail_image" : product_list[a].thumbnail_image || "",
                            "product_fav": false,
                            "product_rating":   product_details[a].product_rating || 5 ,
                            "product_review":   product_details[a].product_review || 0 ,
                            "createdAt" : product_details[a].updatedAt
                    }
         final_data.push(k);
        if(a == product_details.length - 1)
        {
         res.json({Status:"Success",Message:"product details", Data : final_data ,Code:200});     
        }
        }
    }
});






router.post('/sort',async function (req, res) {
if(req.body.today_deals == false) 
{
    let product_details  =  await product_detailsModel.find({cat_id:req.body.cat_id,delete_status : false});
    // var ascending = product_details.sort((a, b) => Number(a.cost) - Number(b.cost));
    // var descending_discount = product_details.sort((a, b) => Number(b.discount) - Number(a.discount));
    // var descending = product_details.sort((a, b) => Number(b.cost) - Number(a.cost));
    var final_data = [];
    if(req.body.recent == 1){
        product_details.sort(function compare(a, b) {
               var dateA = new Date(a.updatedAt);
               var dateB = new Date(b.updatedAt);
               return dateB - dateA;
        });
        for(let a  = 0 ; a < product_details.length; a ++){
            let k = {
                            "_id": product_details[a]._id,
                            "product_img":  product_details[a].product_img[0],
                            "product_title":  product_details[a].product_name,
                            "product_price":  +product_details[a].cost.toFixed(0),
                            "product_discount":  product_details[a].discount,
                            "thumbnail_image" : product_list[a].thumbnail_image || "",
                            "product_fav": false,
                            "product_rating":   product_details[a].product_rating || 5 ,
                            "product_review":   product_details[a].product_review || 0 ,
                            "createdAt" : product_details[a].updatedAt
                    }
         final_data.push(k);
        if(a == product_details.length - 1)
        {
         res.json({Status:"Success",Message:"Sort product details", Data : final_data ,Code:200});     
        }
        }
    } else if(req.body.high_discount == 1){
   product_details.sort(function(a,b) {
    return b.discount - a.discount;
   });
for(let a  = 0 ; a < product_details.length; a ++){
            let k = {
                            "_id": product_details[a]._id,
                            "product_img":  product_details[a].product_img[0],
                            "product_title":  product_details[a].product_name,
                            "product_price":  +product_details[a].cost.toFixed(0),
                            "product_discount":  product_details[a].discount,
                            "thumbnail_image" : product_list[a].thumbnail_image || "",
                            "product_fav": false,
                            "product_rating":   product_details[a].product_rating || 5 ,
                            "product_review":   product_details[a].product_review || 0 ,
                            "createdAt" : product_details[a].updatedAt
                    }
         final_data.push(k);
        if(a == product_details.length - 1)
        {
         res.json({Status:"Success",Message:"Sort product details", Data : final_data ,Code:200});     
        }
        }
    } else if(req.body.best_sellers == 1){


    } else if(req.body.high_to_low == 1){
 product_details.sort(function(a,b) {
    return b.cost - a.cost;
   });
for(let a  = 0 ; a < product_details.length; a ++){
            let k = {
                            "_id": product_details[a]._id,
                            "product_img":  product_details[a].product_img[0],
                            "product_title":  product_details[a].product_name,
                            "product_price":  +product_details[a].cost.toFixed(0),
                            "product_discount":  product_details[a].discount,
                            "thumbnail_image" : product_list[a].thumbnail_image || "",
                            "product_fav": false,
                            "product_rating":   product_details[a].product_rating || 5 ,
                            "product_review":   product_details[a].product_review || 0 ,
                            "createdAt" : product_details[a].updatedAt
                    }
         final_data.push(k);
        if(a == product_details.length - 1)
        {
         res.json({Status:"Success",Message:"Sort product details", Data : final_data ,Code:200});     
        }
        }
    } else if(req.body.low_to_high == 1){
 product_details.sort(function(a,b) {
    return a.cost - b.cost;
   });
for(let a  = 0 ; a < product_details.length; a ++){
            let k = {
                            "_id": product_details[a]._id,
                            "product_img":  product_details[a].product_img[0],
                            "product_title":  product_details[a].product_name,
                            "product_price":  +product_details[a].cost.toFixed(0),
                            "product_discount":  product_details[a].discount,
                            "thumbnail_image" : product_list[a].thumbnail_image || "",
                            "product_fav": false,
                            "product_rating":  product_details[a].product_rating || 5 ,
                            "product_review":  product_details[a].product_review || 0 ,
                            "createdAt" : product_details[a].updatedAt
                    }
         final_data.push(k);
        if(a == product_details.length - 1)
        {
         res.json({Status:"Success",Message:"Sort product details", Data : final_data ,Code:200});     
        }
        }
    }
    }

else{

let product_details  =  await product_detailsModel.find({today_deal:true,delete_status : false});
    // var ascending = product_details.sort((a, b) => Number(a.cost) - Number(b.cost));
    // var descending_discount = product_details.sort((a, b) => Number(b.discount) - Number(a.discount));
    // var descending = product_details.sort((a, b) => Number(b.cost) - Number(a.cost));
    var final_data = [];
    if(req.body.recent == 1){
        product_details.sort(function compare(a, b) {
               var dateA = new Date(a.updatedAt);
               var dateB = new Date(b.updatedAt);
               return dateB - dateA;
        });
        for(let a  = 0 ; a < product_details.length; a ++){
            let k = {
                            "_id": product_details[a]._id,
                            "product_img":  product_details[a].product_img[0],
                            "product_title":  product_details[a].product_name,
                            "product_price":  +product_details[a].cost.toFixed(0),
                            "product_discount":  product_details[a].discount,
                            "thumbnail_image" : product_list[a].thumbnail_image || "",
                            "product_fav": false,
                            "product_rating":  product_details[a].product_rating || 5 ,
                            "product_review":  product_details[a].product_review || 0 ,
                            "createdAt" : product_details[a].updatedAt
                    }
         final_data.push(k);
        if(a == product_details.length - 1)
        {
         res.json({Status:"Success",Message:"Todays Deal Sort product details", Data : final_data ,Code:200});     
        }
        }
    } else if(req.body.high_discount == 1){
   product_details.sort(function(a,b) {
    return b.discount - a.discount;
   });
for(let a  = 0 ; a < product_details.length; a ++){
            let k = {
                            "_id": product_details[a]._id,
                            "product_img":  product_details[a].product_img[0],
                            "product_title":  product_details[a].product_name,
                            "product_price":  +product_details[a].cost.toFixed(0),
                            "product_discount":  product_details[a].discount,
                            "thumbnail_image" : product_list[a].thumbnail_image || "",
                            "product_fav": false,
                            "product_rating":  product_details[a].product_rating || 5 ,
                            "product_review":  product_details[a].product_review || 0 ,
                            "createdAt" : product_details[a].updatedAt
                    }
         final_data.push(k);
        if(a == product_details.length - 1)
        {
         res.json({Status:"Success",Message:"Todays Deal Sort product details", Data : final_data ,Code:200});     
        }
        }
    } else if(req.body.best_sellers == 1){


    } else if(req.body.high_to_low == 1){
 product_details.sort(function(a,b) {
    return b.cost - a.cost;
   });
for(let a  = 0 ; a < product_details.length; a ++){
            let k = {
                            "_id": product_details[a]._id,
                            "product_img":  product_details[a].product_img[0],
                            "product_title":  product_details[a].product_name,
                            "product_price":  +product_details[a].cost.toFixed(0),
                            "product_discount":  product_details[a].discount,
                            "thumbnail_image" : product_list[a].thumbnail_image || "",
                            "product_fav": false,
                            "product_rating":  product_details[a].product_rating || 5 ,
                            "product_review":  product_details[a].product_review || 0 ,
                            "createdAt" : product_details[a].updatedAt
                    }
         final_data.push(k);
        if(a == product_details.length - 1)
        {
         res.json({Status:"Success",Message:"Todays Deal Sort product details", Data : final_data ,Code:200});     
        }
        }
    } else if(req.body.low_to_high == 1){
 product_details.sort(function(a,b) {
    return a.cost - b.cost;
   });
for(let a  = 0 ; a < product_details.length; a ++){
            let k = {
                            "_id": product_details[a]._id,
                            "product_img":  product_details[a].product_img[0],
                            "product_title":  product_details[a].product_name,
                            "product_price":  +product_details[a].cost.toFixed(0),
                            "product_discount":  product_details[a].discount,
                            "thumbnail_image" : product_list[a].thumbnail_image || "",
                            "product_fav": false,
                            "product_rating":   product_details[a].product_rating || 5 ,
                            "product_review":   product_details[a].product_review || 0 ,
                            "createdAt" : product_details[a].updatedAt
                    }
         final_data.push(k);
        if(a == product_details.length - 1)
        {
         res.json({Status:"Success",Message:"Todays Deal Sort product details", Data : final_data ,Code:200});     
        }
        }
    }


}

});





router.post('/todaysdeal_sort',async function (req, res) {
    let product_details  =  await product_detailsModel.find({today_deal:true,delete_status : false});
    // var ascending = product_details.sort((a, b) => Number(a.cost) - Number(b.cost));
    // var descending_discount = product_details.sort((a, b) => Number(b.discount) - Number(a.discount));
    // var descending = product_details.sort((a, b) => Number(b.cost) - Number(a.cost));
    var final_data = [];
    if(req.body.recent == 1){
        product_details.sort(function compare(a, b) {
               var dateA = new Date(a.updatedAt);
               var dateB = new Date(b.updatedAt);
               return dateB - dateA;
        });
        for(let a  = 0 ; a < product_details.length; a ++){
            let k = {
                            "_id": product_details[a]._id,
                            "product_img":  product_details[a].product_img[0],
                            "product_title":  product_details[a].product_name,
                            "product_price":  +product_details[a].cost.toFixed(0),
                            "product_discount":  product_details[a].discount,
                            "thumbnail_image" : product_list[a].thumbnail_image || "",
                            "product_fav": false,
                            "product_rating": product_details[a].product_rating || 5 ,
                            "product_review": product_details[a].product_review || 0 ,
                            "createdAt" : product_details[a].updatedAt
                    }
         final_data.push(k);
        if(a == product_details.length - 1)
        {
         res.json({Status:"Success",Message:"Todays Deal Sort product details", Data : final_data ,Code:200});     
        }
        }
    } else if(req.body.high_discount == 1){
   product_details.sort(function(a,b) {
    return b.discount - a.discount;
   });
for(let a  = 0 ; a < product_details.length; a ++){
            let k = {
                            "_id": product_details[a]._id,
                            "product_img":  product_details[a].product_img[0],
                            "product_title":  product_details[a].product_name,
                            "product_price":  +product_details[a].cost.toFixed(0),
                            "product_discount":  product_details[a].discount,
                            "thumbnail_image" : product_list[a].thumbnail_image || "",
                            "product_fav": false,
                            "product_rating":  product_details[a].product_rating || 5 ,
                            "product_review":  product_details[a].product_review || 0 ,
                            "createdAt" : product_details[a].updatedAt
                    }
         final_data.push(k);
        if(a == product_details.length - 1)
        {
         res.json({Status:"Success",Message:"Todays Deal Sort product details", Data : final_data ,Code:200});     
        }
        }
    } else if(req.body.best_sellers == 1){


    } else if(req.body.high_to_low == 1){
 product_details.sort(function(a,b) {
    return b.cost - a.cost;
   });
for(let a  = 0 ; a < product_details.length; a ++){
            let k = {
                            "_id": product_details[a]._id,
                            "product_img":  product_details[a].product_img[0],
                            "product_title":  product_details[a].product_name,
                            "product_price":  +product_details[a].cost.toFixed(0),
                            "product_discount":  product_details[a].discount,
                            "thumbnail_image" : product_list[a].thumbnail_image || "",
                            "product_fav": false,
                            "product_rating":  product_details[a].product_rating || 5 ,
                            "product_review":  product_details[a].product_review || 0 ,
                            "createdAt" : product_details[a].updatedAt
                    }
         final_data.push(k);
        if(a == product_details.length - 1)
        {
         res.json({Status:"Success",Message:"Todays Deal Sort product details", Data : final_data ,Code:200});     
        }
        }
    } else if(req.body.low_to_high == 1){
 product_details.sort(function(a,b) {
    return a.cost - b.cost;
   });
for(let a  = 0 ; a < product_details.length; a ++){
            let k = {
                            "_id": product_details[a]._id,
                            "product_img":  product_details[a].product_img[0],
                            "product_title":  product_details[a].product_name,
                            "thumbnail_image" : product_list[a].thumbnail_image || "",
                            "product_price":  +product_details[a].cost.toFixed(0),
                            "product_discount":  product_details[a].discount,
                            "product_fav": false,
                            "product_rating":  product_details[a].product_rating || 5 ,
                            "product_review":  product_details[a].product_review || 0 ,
                            "createdAt" : product_details[a].updatedAt
                    }
         final_data.push(k);
        if(a == product_details.length - 1)
        {
         res.json({Status:"Success",Message:"Todays Deal Sort product details", Data : final_data ,Code:200});     
        }
        }
    }
});



router.post('/getdetails', async function (req, res) {
	if(req.body.pet_type=="ALL"&& req.body.breed_type=="ALL"&&req.body.age=="ALL"){
		var Flitered_Data = await product_detailsModel.find({});
		res.json({Status:"Success",Message:"Demo screen List1", Data : Flitered_Data ,Code:200});
	}
	else if(req.body.breed_type=="ALL"&& req.body.age=="ALL"){
		var Flitered_Data = await product_detailsModel.find({pet_type:{$in:req.body.pet_type}});
		res.json({Status:"Success",Message:"Demo screen List2", Data : Flitered_Data ,Code:200});
	}
	else if(req.body.breed_type=="ALL"){
		var Flitered_Data = await product_detailsModel.find({Pet_Type:{$in:req.body.pet_type},Age:{$in:req.body.age}});
		res.json({Status:"Success",Message:"Demo screen List2", Data : Flitered_Data ,Code:200});
	}
	else if(req.body.pet_type=="ALL"){
		var Flitered_Data = await product_detailsModel.find({Breed_Type:{$in:req.body.breed_type},Age:{$in:req.body.age}});
		res.json({Status:"Success",Message:"Demo screen List2", Data : Flitered_Data ,Code:200});
	}
	else{
		var Flitered_Data = await product_detailsModel.find({Pet_Type:{$in:req.body.pet_type},Breed_Type:{$in:req.body.breed_type},Age:{$in:req.body.age}});
       res.json({Status:"Success",Message:"Demo screen List3", Data : Flitered_Data ,Code:200});
	}
   
});

router.post('/filter_date', function (req, res) {
        product_detailsModel.find({delete_status : false}, function (err, StateList) {
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
      product_detailsModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"product details screen  Deleted", Data : {} ,Code:200});     
      });
});


router.post('/getlist_id', function (req, res) {
        product_detailsModel.find({Person_id:req.body.Person_id,delete_status : false}, function (err, StateList) {
          res.json({Status:"Success",Message:"product details screen  List", Data : StateList ,Code:200});
        });
});



router.post('/getlist_from_vendor_id', function (req, res) {
        product_detailsModel.find({user_id:req.body.user_id,delete_status : false}, function (err, StateList) {
          res.json({Status:"Success",Message:"product details screen  List", Data : StateList ,Code:200});
        }).populate('cat_id sub_cat_id breed_type pet_type');
});


router.post('/mobile/getlist_from_vendor_id', function (req, res) {
        product_detailsModel.find({user_id:req.body.vendor_id,delete_status : false}, function (err, StateList) {
            var  final_data  = [];
            if(StateList.length == 0 ){
            res.json({Status:"Success",Message:"product details screen  List", Data : StateList ,Code:200});
            }
            else{
             for(let a  = 0 ; a < StateList.length ; a ++){
                   let c = {
                        product_id : StateList[a]._id,
                        products_image : StateList[a].product_img,
                        product_name : StateList[a].product_name,
                        'thumbnail_image' : StateList[a].thumbnail_image || 'http://54.212.108.156:3000/api/uploads/Pic_empty.jpg',
                        product_price : +StateList[a].cost.toFixed(0),
                        pet_type :  StateList[a].pet_type,
                        pet_breed :  StateList[a].breed_type,
                        pet_age :  StateList[a].age,
                        pet_threshold :  StateList[a].threshould,

                   }
                   final_data.push(c);
                if(a == StateList.length - 1){
                   res.json({Status:"Success",Message:"product details screen  List", Data : final_data ,Code:200});
 
                }
            }
            }
        }).populate('cat_id sub_cat_id breed_type pet_type');
});

router.post('/discount_single',async function (req, res) {
    if(req.body.discount_status ==  true){
     var product_Details = await product_detailsModel.findOne({_id:req.body._id,delete_status : false});
    let calcualtions =  ((req.body.discount/ 100) * product_Details.cost).toFixed(2);
    let cost =   product_Details.cost - calcualtions;
    cost = cost.toFixed(0);
     let a = {
            "cost" : cost || 0,
            "discount" : req.body.discount || 0,
            "discount_amount" : product_Details.cost || 0,
            "discount_status" : req.body.discount_status || false,
            "discount_cal" : product_Details.cost.toFixed(0) || 0,
            "discount_start_date" : req.body.discount_start_date || "",
            "discount_end_date" : req.body.discount_end_date || "",
            "today_deal" : true
     }
     product_detailsModel.findByIdAndUpdate(req.body._id, a, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"product details screen  Updated", Data : UpdatedDetails ,Code:200});
     });
 } else
{
 var product_Details = await product_detailsModel.findOne({_id:req.body._id,delete_status : false});
    let cost = product_Details.cost - req.body.discount_amount;
    cost = cost.toFixed(0);
    // let cost =   product_Details.cost - calcualtions;
     let a = {
            "cost" : cost || 0,
            "discount" : req.body.discount || 0,
            "discount_amount" : product_Details.cost || 0,
            "discount_status" : req.body.discount_status || false,
            "discount_cal" : product_Details.cost.toFixed(0) || 0,
            "discount_start_date" : req.body.discount_start_date || "",
            "discount_end_date" : req.body.discount_end_date || "",
            "today_deal" : true
     }
     product_detailsModel.findByIdAndUpdate(req.body._id, a, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"product details screen  Updated", Data : UpdatedDetails ,Code:200});
     }); 
 }
});




router.post('/cal_discount_single',async function (req, res) {

    if(req.body.discount_status ==  true){
     var product_Details = await product_detailsModel.findOne({_id:req.body._id,delete_status : false});
    let calcualtions =  ((req.body.discount/ 100) * product_Details.cost).toFixed(2);
    let cost =   +product_Details.cost - +calcualtions;
    cost = +cost.toFixed(0);
     let a = {
            "cost" : +cost || 0,
            "discount" : +req.body.discount || 0,
            "discount_amount" : +req.body.discount_amount || 0,
            "discount_status" : req.body.discount_status || false,
            "discount_cal" : +product_Details.cost.toFixed(0) || 0,
            "discount_start_date" : req.body.discount_start_date || "",
            "discount_end_date" : req.body.discount_end_date || "",
            "today_deal" : true
     }

      res.json({Status:"Success",Message:"Discount added to product", Data : a ,Code:200});
     // product_detailsModel.findByIdAndUpdate(req.body._id, a, {new: true}, function (err, UpdatedDetails) {
     //        if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
            
     // });
 } else
{
 var product_Details = await product_detailsModel.findOne({_id:req.body._id,delete_status : false});
    let cost = +product_Details.cost - +req.body.discount_amount;
    cost = +cost.toFixed(0);
    // let cost =   product_Details.cost - calcualtions;
     let a = {
            "cost" : +cost || 0,
            "discount" : +req.body.discount || 0,
            "discount_amount" : +req.body.discount_amount || 0,
            "discount_status" : req.body.discount_status || false,
            "discount_cal" : +product_Details.cost.toFixed(0) || 0,
            "discount_start_date" : req.body.discount_start_date || "",
            "discount_end_date" : req.body.discount_end_date || "",
            "today_deal" : true
     }

     res.json({Status:"Success",Message:"product details screen  Updated", Data : a ,Code:200});
     // product_detailsModel.findByIdAndUpdate(req.body._id, a, {new: true}, function (err, UpdatedDetails) {
     //        if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
     //         res.json({Status:"Success",Message:"product details screen  Updated", Data : UpdatedDetails ,Code:200});
     // }); 
 }



});





router.post('/discount_multi',async function (req, res) {
let array_data = req.body._id;
  if(req.body.discount_status ==  true){
 for(let c = 0 ; c < array_data.length ; c ++){
    var product_Details = await product_detailsModel.findOne({_id:array_data[c],delete_status : false});
    let calcualtions =  ((req.body.discount/ 100) * product_Details.cost).toFixed(2);
    let cost =   product_Details.cost - calcualtions;
    cost = cost.toFixed(0);
     let a = {
            "cost" : cost || 0,
            "discount" : req.body.discount || 0,
            "discount_amount" : req.body.discount_amount || 0,
            "discount_status" : req.body.discount_status || false,
            "discount_cal" : product_Details.cost.toFixed(0) || 0,
            "discount_start_date" : req.body.discount_start_date || "",
            "discount_end_date" : req.body.discount_end_date || "",
            "today_deal" : true
     }
     product_detailsModel.findByIdAndUpdate(array_data[c], a, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});    
     });
  if(c == array_data.length - 1){
     res.json({Status:"Success",Message:"Discount added to product", Data : {} ,Code:200});
  }
 }
}else{
 for(let c = 0 ; c < array_data.length ; c ++){
    var product_Details = await product_detailsModel.findOne({_id:array_data[c],delete_status : false});
    // let calcualtions =  ((req.body.discount/ 100) * product_Details.cost).toFixed(2);
   let cost = product_Details.cost - req.body.discount_amount;
   cost = cost.toFixed(0);
    // console.log(calcualtions , cost);
     let a = {
            "cost" : cost || 0,
            "discount" : req.body.discount || 0,
            "discount_amount" : req.body.discount_amount || 0,
            "discount_status" : req.body.discount_status || false,
            "discount_cal" : product_Details.cost.toFixed(0) || 0,
            "today_deal" : true
     }
     product_detailsModel.findByIdAndUpdate(array_data[c], a, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});    
     });
  if(c == array_data.length - 1){
     res.json({Status:"Success",Message:"Discount added to product", Data : {} ,Code:200});
  }
 }
}
});





router.post('/reviews/update',async function (req, res) {
        var order_details = await vendor_order_bookingModel.findOne({_id:req.body.order_id,delete_status : false});
        // console.log('Order Details',order_details);
        var product_detail = await product_detailsModel.findOne({_id:order_details.product_id,delete_status : false});
        // console.log('Product Details',product_detail);
          await product_rate_reviewModel.create({
            user_id:  order_details.user_id,
            product_id : order_details.product_id,
            reviews : req.body.user_feedback,
            rating : req.body.user_rate
        },async function (err, user) {

        var test_rat_count = 0; 
        var final_rat_count = 0;
        var review_details = await product_rate_reviewModel.find({product_id:order_details.product_id,delete_status : false});

        for(let a = 0 ; a < review_details.length ; a++) {
            test_rat_count = +review_details[a].rating + test_rat_count;
        }

        var final_rat_count = +test_rat_count / review_details.length;

        let c = {
        user_feedback : req.body.user_feedback,
        user_rate : req.body.user_rate,
        } 

        let a = {
          product_rating :  final_rat_count.toFixed(1),
          product_review :  review_details.length,
        }
        product_detailsModel.findByIdAndUpdate(order_details.product_id, a, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             // res.json({Status:"Success",Message:"Docotor Details Updated", Data : UpdatedDetails ,Code:200});

        });
        vendor_order_bookingModel.findByIdAndUpdate(req.body.order_id, c, {new: true}, function (err, UpdatedDetails) {
             if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Feedback updated successfully", Data : UpdatedDetails ,Code:200});
        });
          }); 





        








     





        // await reviewdetailsModel.create({
        //     user_id:  user_id,
        //     product_id : product_id,
        //     reviews : req.body.reviews,
        //     rating : req.body.rating
        // },async function (err, user) {
        // console.log(user)
        // var test_rat_count = 0; 
        // var review_details = await reviewdetailsModel.find({product_id:req.body.product_id});
        // for(let a = 0 ; a < review_details.length ; a++) {
        //     test_rat_count = +review_details[a].rating + test_rat_count;
        //  }
        //  var final_rat_count = test_rat_count / review_details.length;
        // let c = {
        // comments : review_details.length,
        // rating : final_rat_count
        // } 
        // console.log(c);
        // product_detailsModel.findByIdAndUpdate(req.body.product_id, c, {new: true}, function (err, UpdatedDetails) {
        //     if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
        //      // res.json({Status:"Success",Message:"Docotor Details Updated", Data : UpdatedDetails ,Code:200});
        //        console.log("DAtA updated in Doctor Details");
        // });
        // AppointmentsModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
        //      if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
        //      res.json({Status:"Success",Message:"Feedback updated successfully", Data : UpdatedDetails ,Code:200});
        // });

        // });    
});



router.post('/mark_deal', function (req, res) {
 let c = {
    today_deal : req.body.status
  }
  product_detailsModel.findByIdAndUpdate(req.body._id, c, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Product Updated", Data : {} ,Code:200});
  });
});


router.get('/getlist', function (req, res) {
        product_detailsModel.find({delete_status : false}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"product details screen  Details", Data : Functiondetails ,Code:200});
        }).populate('cat_id user_id');
});


router.post('/dashboard_getlist', function (req, res) {
        product_detailsModel.find({user_id:req.body.vendor_id,delete_status : false}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Dashboard Product details", Data : Functiondetails ,Code:200});
        }).populate('cat_id');
});



router.get('/mobile/getlist', function (req, res) {
        product_detailsModel.find({show_status:true}, function (err, Functiondetails) {
          let a ={
             SplashScreendata : Functiondetails
          }
          res.json({Status:"Success",Message:"product details screen  Details", Data : a ,Code:200});
        });
});



router.post('/mobile/edit_product',async function (req, res) {
    var product_details = await product_detailsModel.findOne({_id: req.body._id,delete_status : false});
    let final_update_data = {};
    if(product_details.discount_status ==  false){
      final_update_data = {
      cost : req.body.cost,
      threshould : req.body.threshould,
      product_name : req.body.product_name,
      product_discription : req.body.product_discription
      }

        product_detailsModel.findByIdAndUpdate(req.body._id, final_update_data, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Product Details Update successfully", Data : {} ,Code:200});
         });
    } else {
      final_update_data = {
      cost : req.body.cost,
      threshould : req.body.threshould,
      product_name : req.body.product_name,
      product_discription : req.body.product_discription,
      discount : 0,
      "discount_amount": 0,
      "discount_cal": 0,
      "discount_end_date": "",
      "discount_start_date": "",
      "discount_status": false,
      }

        product_detailsModel.findByIdAndUpdate(req.body._id, final_update_data, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Product Details Update successfully", Data : {} ,Code:200});
         });
    }
});




router.post('/delete', function (req, res) {
 let c = {
    delete_status : true
  }
  product_detailsModel.findByIdAndUpdate(req.body._id, c, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Location Deleted successfully", Data : UpdatedDetails ,Code:200});
  });
});


router.get('/change_threshold',async function (req, res) {
    var product_details = await product_detailsModel.find({});
    for(let a = 0; a < product_details.length ; a ++){
    let c = {
      threshould : "2000"
    }
     product_detailsModel.findByIdAndUpdate(product_details[a]._id, c, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
        });
    if(a ==  product_details.length - 1){
             res.json({Status:"Success",Message:"product details screen  Updated", Data : {} ,Code:200});
    }
    }   
});

router.post('/edit', function (req, res) {
        product_detailsModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"product details screen  Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/admin_delete', function (req, res) {
      product_detailsModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"product details screen Deleted successfully", Data : {} ,Code:200});
      });
});

module.exports = router;
