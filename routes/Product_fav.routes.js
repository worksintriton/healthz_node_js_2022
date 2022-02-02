var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var Product_favModel = require('./../models/Product_favModel');


router.post('/create', async function(req, res) {
      var doc_fav = await Product_favModel.findOne({user_id:req.body.user_id,product_id:req.body.product_id});
      if(doc_fav == null){
  try{
        await Product_favModel.create({
            user_id:  req.body.user_id,
            product_id : req.body.product_id,
            mobile_type : req.body.mobile_type || "",
            delete_status : false
        }, 
        function (err, user) {
          console.log(user)
        res.json({Status:"Success",Message:"Added to Favourites", Data : user ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
      }

      else
      {
         Product_favModel.findByIdAndRemove(doc_fav._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Failed",Message:"Favourites Removed", Data : {},Code:200});
      });
      }
});




router.post('/getlist_id', function (req, res) {
        Product_favModel.find({user_id:req.body.user_id}, function (err, StateList) {
          if(StateList.length == 0){
              res.json({Status:"Success",Message:"No Recode Found", Data : [] ,Code:200});
          }else {
            let final_docdetails = [];
            let product_list = StateList;
          for(let a = 0 ; a < StateList.length ; a ++ ){
            console.log()
          let dd = {
                        "_id": product_list[a].product_id._id,
                        "product_img":  product_list[a].product_id.thumbnail_image || "",
                        "thumbnail_image" : product_list[a].product_id.thumbnail_image || "",
                        "product_title":  product_list[a].product_id.product_name,
                        "product_price":  +product_list[a].product_id.cost.toFixed(0),
                        "product_discount":  product_list[a].product_id.discount,
                        "product_discount_price" : product_list[a].product_id.discount_amount || 0,
                        "product_fav": true,
                        "product_rating": product_list[a].product_id.product_rating || 5 ,
                        "product_review": product_list[a].product_id.product_review || 0 ,
                    }
          final_docdetails.push(dd);
          if(a == StateList.length - 1){
            res.json({Status:"Success",Message:"Product Fav", Data : final_docdetails ,Code:200});
          }
          }
          }
        // res.json({Status:"Success",Message:"Splash screen  List", Data : StateList ,Code:200});
        }).populate('product_id');
});












router.post('/filter_date', function (req, res) {
        Product_favModel.find({}, function (err, StateList) {
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


router.get('/deletes', function (req, res) {
      Product_favModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"Splash screen  Deleted", Data : {} ,Code:200});     
      });
});


// router.post('/getlist_id', function (req, res) {
//         Doctor_favModel.find({Person_id:req.body.Person_id}, function (err, StateList) {
//           res.json({Status:"Success",Message:"Splash screen  List", Data : StateList ,Code:200});
//         });
// });



router.get('/getlist', function (req, res) {
        Product_favModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Splash screen  Details", Data : Functiondetails ,Code:200});
        });
});


router.get('/mobile/getlist', function (req, res) {
        Product_favModel.find({show_status:true}, function (err, Functiondetails) {
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
  Product_favModel.findByIdAndUpdate(req.body._id, c, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Location Deleted successfully", Data : UpdatedDetails ,Code:200});
  });
});



router.post('/edit', function (req, res) {
        Product_favModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Splash screen  Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/admin_delete', function (req, res) {
      Product_favModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Splash screen Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;
