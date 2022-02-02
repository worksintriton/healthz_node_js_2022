var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var Sp_favModel = require('./../models/Sp_favModel');


router.post('/create', async function(req, res) {
  console.log("SP_FAV", req.body);
      var doc_fav = await Sp_favModel.findOne({user_id:req.body.user_id,sp_id:req.body.sp_id});
      if(doc_fav == null){
  try{
        await Sp_favModel.create({
            user_id:  req.body.user_id,
            sp_id : req.body.sp_id,
            cat_id : req.body.cat_id,
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
      Sp_favModel.findByIdAndRemove(doc_fav._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Failed",Message:"Favourites Removed", Data : {},Code:200});
      });
        // res.json({Status:"Failed",Message:"SP FAV Already Marked", Data : {},Code:500});
      }
});




router.post('/getlist_id', function (req, res) {
        Sp_favModel.find({user_id:req.body.user_id}, function (err, StateList) {
          console.log(StateList);
          if(StateList.length == 0){
              res.json({Status:"Success",Message:"No Recode Found", Data : [] ,Code:200});
          }else {
            let final_docdetails = [];
            let vendordetailsModels = StateList;
          for(let a = 0 ; a < StateList.length ; a ++ ){
           let c =  {
        "_id" : vendordetailsModels[a].sp_id._id,
        "cat_id" : vendordetailsModels[a].cat_id,
        "image": vendordetailsModels[a].sp_id.thumbnail_image || "",
        "thumbnail_image" : vendordetailsModels[a].sp_id.thumbnail_image || "",
        "service_provider_name": vendordetailsModels[a].sp_id.bussiness_name,
        "user_name" :  vendordetailsModels[a].sp_id.bus_user_name, 
        "service_price": 0,
        "service_offer": 0,
        "service_place":vendordetailsModels[a].sp_id.sp_loc,
        "distance": 0,
        "rating_count" : 5,
        "comments_count":12,
        "fav" : true
        }
          final_docdetails.push(c);
          if(a == StateList.length - 1){
            res.json({Status:"Success",Message:"SP FAV LIST", Data : final_docdetails ,Code:200});
          }
          }
          }
        // res.json({Status:"Success",Message:"Splash screen  List", Data : StateList ,Code:200});
        }).populate('sp_id');
});












router.post('/filter_date', function (req, res) {
        Sp_favModel.find({}, function (err, StateList) {
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
      Sp_favModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"Splash screen  Deleted", Data : {} ,Code:200});     
      });
});


// router.post('/getlist_id', function (req, res) {
//         Sp_favModel.find({Person_id:req.body.Person_id}, function (err, StateList) {
//           res.json({Status:"Success",Message:"Splash screen  List", Data : StateList ,Code:200});
//         });
// });



router.get('/getlist', function (req, res) {
        Sp_favModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Splash screen  Details", Data : Functiondetails ,Code:200});
        });
});


router.get('/mobile/getlist', function (req, res) {
        Sp_favModel.find({show_status:true}, function (err, Functiondetails) {
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
  Sp_favModel.findByIdAndUpdate(req.body._id, c, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Location Deleted successfully", Data : UpdatedDetails ,Code:200});
  });
});



router.post('/edit', function (req, res) {
        Sp_favModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Splash screen  Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/admin_delete', function (req, res) {
      Sp_favModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Splash screen Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;
