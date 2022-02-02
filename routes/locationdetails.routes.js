var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var locationdetailsModel = require('./../models/locationdetailsModel');


router.post('/create', async function(req, res) {
   let default_Status = true
   console.log(req.body);
   let location_details  =  await locationdetailsModel.findOne({user_id:req.body.user_id});
   console.log(location_details);
   if(location_details == null){
   default_Status = true;
      try{
        await locationdetailsModel.create({
            user_id:  req.body.user_id || "",
            location_state : req.body.location_state || "",
            location_country : req.body.location_country || "",
            location_city : req.body.location_city || "",
            location_pin : req.body.location_pin || "",
            location_address : req.body.location_address || "",
            location_lat : req.body.location_lat || 0,
            location_long : req.body.location_long || 0,
            location_title : req.body.location_title || "",
            location_nickname : req.body.location_nickname || "",
            default_status : default_Status || false,
            date_and_time : req.body.date_and_time || "",
            mobile_type : req.body.mobile_type || "",
            delete_status : false
        }, 
        function (err, user) {
          console.log(user)
        res.json({Status:"Success",Message:"Location Added successfully", Data : user ,Code:200}); 
        });
   }
   catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
   }
   } 
   else {
        if(req.body.default_status == false){
      default_Status = false;
      try{
        await locationdetailsModel.create({
            user_id:  req.body.user_id || "",
            location_state : req.body.location_state || "",
            location_country : req.body.location_country || "",
            location_city : req.body.location_city || "",
            location_pin : req.body.location_pin || "",
            location_address : req.body.location_address || "",
            location_lat : req.body.location_lat || 0,
            location_long : req.body.location_long || 0,
            location_title : req.body.location_title || "",
            location_nickname : req.body.location_nickname || "",
            default_status : default_Status || false,
            date_and_time : req.body.date_and_time || "",
            mobile_type : req.body.mobile_type || "",
            delete_status : false
        }, 
        function (err, user) {
          console.log(user)
        res.json({Status:"Success",Message:"Location Added successfully", Data : user ,Code:200}); 
        });
      }
     catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
   }
        }else{
          let default_loc  =  await locationdetailsModel.findOne({user_id:req.body.user_id,default_status : true});
          let c = {
          default_status : false
          }
            locationdetailsModel.findByIdAndUpdate(default_loc._id, c, {new: true},async function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
            console.log("default_loc_change Changed into fasle");
      default_Status = true;
      try{
        await locationdetailsModel.create({
            user_id:  req.body.user_id || "",
            location_state : req.body.location_state || "",
            location_country : req.body.location_country || "",
            location_city : req.body.location_city || "",
            location_pin : req.body.location_pin || "",
            location_address : req.body.location_address || "",
            location_lat : req.body.location_lat || 0,
            location_long : req.body.location_long || 0,
            location_title : req.body.location_title || "",
            location_nickname : req.body.location_nickname || "",
            default_status : default_Status || false,
            date_and_time : req.body.date_and_time || "",
            mobile_type : req.body.mobile_type || "",
            delete_status : false
        }, 
        function (err, user) {
          console.log(user)
        res.json({Status:"Success",Message:"Location Added successfully", Data : user ,Code:200}); 
        });
      }
      catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
       }
             // res.json({Status:"Success",Message:"Location Deleted successfully", Data : UpdatedDetails ,Code:200});
            });
        }
   }
   // console.log(default_Status);
});


router.post('/filter_date', function (req, res) {
        locationdetailsModel.find({}, function (err, StateList) {
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
      locationdetailsModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"Location Deleted", Data : {} ,Code:200});     
      });
});


router.post('/mobile/getlist_id', function (req, res) {
        locationdetailsModel.find({user_id:req.body.user_id,delete_status : false}, function (err, StateList) {
          res.json({Status:"Success",Message:"Location List", Data : StateList ,Code:200});
        });
});


router.post('/mobile/getlist_id1', function (req, res) {
        locationdetailsModel.findOne({user_id:req.body.user_id,delete_status : false,"default_status": true}, function (err, StateList) {
          if(StateList == null){
          res.json({Status:"Failed",Message:"Location List", Data : {} ,Code:404});
          }else{
          res.json({Status:"Success",Message:"Location List", Data : StateList ,Code:200});
          }
        });
});


router.get('/getlist', function (req, res) {
        locationdetailsModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Location Details", Data : Functiondetails ,Code:200});
        });
});


router.get('/mobile/getlist', function (req, res) {
        locationdetailsModel.find({}, function (err, Functiondetails) {
          let a = {
            usertypedata : Functiondetails
          }
          res.json({Status:"Success",Message:"Location Details", Data : a ,Code:200});
        });
});


router.post('/default/edit',async function (req, res) {
         let location_details  =  await locationdetailsModel.findOne({user_id:req.body.user_id,default_status:true});
           const update = { default_status : false};
            var Corporatecodeupdate = await locationdetailsModel.findByIdAndUpdate({_id:location_details._id},update,{
           new: true
          });
        locationdetailsModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Location Updated", Data : UpdatedDetails ,Code:200});
        });
});


router.post('/edit',async function (req, res) {
    if(req.body.default_status == false){
        locationdetailsModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Location Updated", Data : UpdatedDetails ,Code:200});
        });
    }else {
          let default_loc  =  await locationdetailsModel.findOne({user_id:req.body.user_id,default_status : true});
          let c = {
          default_status : false
          }
            locationdetailsModel.findByIdAndUpdate(default_loc._id, c, {new: true},async function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
            locationdetailsModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Location Updated", Data : UpdatedDetails ,Code:200});
            })
            });
    }      
});


router.post('/delete', function (req, res) {
 let c = {
    delete_status : true
  }
  locationdetailsModel.findByIdAndUpdate(req.body._id, c, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Location Deleted successfully", Data : UpdatedDetails ,Code:200});
  });
});


router.post('/edits', function (req, res) {
        locationdetailsModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"PET type Updated", Data : UpdatedDetails ,Code:200});
        });
});



// // DELETES A USER FROM THE DATABASE
router.post('/admin_delete', function (req, res) {
      locationdetailsModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Location Deleted successfully", Data : {} ,Code:200});
      });
});


module.exports = router;
