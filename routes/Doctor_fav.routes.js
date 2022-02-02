var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var Doctor_favModel = require('./../models/Doctor_favModel');
var doctordetailsModel = require('./../models/doctordetailsModel');



router.post('/create', async function(req, res) {
      var doc_fav = await Doctor_favModel.findOne({user_id:req.body.user_id,doctor_id:req.body.doctor_id});
      if(doc_fav == null){
  try{
    var doctor_detail = await doctordetailsModel.findOne({user_id:req.body.doctor_id});
    console.log(doctor_detail);
        await Doctor_favModel.create({
            user_id:  req.body.user_id,
            doctor_id : req.body.doctor_id,
            doctor_detail_id : doctor_detail._id,
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
      Doctor_favModel.findByIdAndRemove(doc_fav._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Failed",Message:"Favourites Removed", Data : {},Code:200});
      });
        
      }
});




router.post('/getlist_id', function (req, res) {
        Doctor_favModel.find({user_id:req.body.user_id}, function (err, StateList) {
          if(StateList.length == 0){
              res.json({Status:"Success",Message:"No Recode Found", Data : [] ,Code:200});
          }else {
            let final_docdetails = [];
            let tem_doctordetailsModel = StateList;
            console.log(StateList.length);
          for(let a = 0 ; a < StateList.length ; a ++ ){
            console.log(tem_doctordetailsModel[a].doctor_detail_id.clinic_pic[0].clinic_pic);
          let dd = {
             '_id' : tem_doctordetailsModel[a].doctor_detail_id.user_id || "",
             "doctor_name" : tem_doctordetailsModel[a].doctor_detail_id.dr_name || "",
             "doctor_img" : tem_doctordetailsModel[a].doctor_detail_id.thumbnail_image || "",
             "thumbnail_image" : tem_doctordetailsModel[a].doctor_detail_id.thumbnail_image || "",
             "specialization" : tem_doctordetailsModel[a].doctor_detail_id.specialization || "",
             "distance" : 0,
             "clinic_name" : tem_doctordetailsModel[a].doctor_detail_id.clinic_name || "",
             "fav" : true,
             // "star_count" : tem_doctordetailsModel[a].rating,
             // "review_count": tem_doctordetailsModel[a].comments
             "star_count" : tem_doctordetailsModel[a].rating || 5,
             "review_count": tem_doctordetailsModel[a].comments || 0,
          }
          final_docdetails.push(dd);
          if(a == StateList.length - 1){
            res.json({Status:"Success",Message:"Doctor fav list", Data : final_docdetails ,Code:200});
          }
          }
          }
        // res.json({Status:"Success",Message:"Splash screen  List", Data : StateList ,Code:200});
        }).populate('doctor_detail_id');
});












router.post('/filter_date', function (req, res) {
        Doctor_favModel.find({}, function (err, StateList) {
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
      Doctor_favModel.remove({}, function (err, user) {
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
        Doctor_favModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Splash screen  Details", Data : Functiondetails ,Code:200});
        });
});


router.get('/mobile/getlist', function (req, res) {
        Doctor_favModel.find({show_status:true}, function (err, Functiondetails) {
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
  Doctor_favModel.findByIdAndUpdate(req.body._id, c, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Location Deleted successfully", Data : UpdatedDetails ,Code:200});
  });
});



router.post('/edit', function (req, res) {
        Doctor_favModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Splash screen  Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/admin_delete', function (req, res) {
      Doctor_favModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Splash screen Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;
