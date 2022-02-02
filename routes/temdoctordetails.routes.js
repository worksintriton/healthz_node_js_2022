var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var doctordetailsModel = require('./../models/temdoctordetailsModel');
var locationdetailsModel = require('./../models/locationdetailsModel');
var GeoPoint = require('geopoint');


router.post('/create', async function(req, res) {
 console.log(req.body);
 console.log(req.body.experience_details);
 var exp = 0;
 for(let a = 0 ; a  < req.body.experience_details.length ; a ++){
      exp = exp + req.body.experience_details[a].yearsofexperience;
 }
 console.log("Expr",exp);
  try{
    console.log(req.body);
        await doctordetailsModel.create({
            user_id:  req.body.user_id,
            dr_title : req.body.dr_title,
            dr_name : req.body.dr_name,
            clinic_name : req.body.clinic_name,
            clinic_loc : req.body.clinic_loc,
            clinic_lat : req.body.clinic_lat,
            clinic_long : req.body.clinic_long,
            education_details : req.body.education_details,
            experience_details : req.body.experience_details,
            specialization : req.body.specialization,
            pet_handled : req.body.pet_handled,
            clinic_pic : req.body.clinic_pic,
            certificate_pic : req.body.certificate_pic,
            thumbnail_image : req.body.thumbnail_image || '',
            govt_id_pic : req.body.govt_id_pic,
            photo_id_pic : req.body.photo_id_pic,
            profile_status : req.body.profile_status,
            profile_verification_status : req.body.profile_verification_status,
            slot_type : req.body.slot_type,
            date_and_time : req.body.date_and_time,
            signature : req.body.signature,
            mobile_type : req.body.mobile_type,
            communication_type : req.body.communication_type,
            live_status : req.body.live_status,
            live_by : req.body.live_by,
            delete_status : req.body.delete_status,
            consultancy_fees : req.body.consultancy_fees,
            calender_status : req.body.calender_status,
            comments : req.body.comments,
            rating : req.body.rating,
            doctor_exp : exp || 0
        }, 
        function (err, user) {
          console.log(err);
          console.log(user)
        res.json({Status:"Success",Message:"Docotor Details Added successfully", Data : user ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});


router.post('/filter_date', function (req, res) {
        doctordetailsModel.find({}, function (err, StateList) {
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
      doctordetailsModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"Docotor Details Deleted", Data : {} ,Code:200});     
      });
});


router.post('/getlist_id', function (req, res) {
        doctordetailsModel.find({Person_id:req.body.Person_id}, function (err, StateList) {
          res.json({Status:"Success",Message:"Docotor Details List", Data : StateList ,Code:200});
        });
});


router.post('/fetch_by_user_id', function (req, res) {
        doctordetailsModel.find({user_id:req.body.user_id}, function (err, StateList) {
          res.json({Status:"Success",Message:"Docotor Details", Data : StateList ,Code:200});
        }).populate('user_id');
});



router.post('/text_search',async function (req, res) {
        console.log(req.body);
        let userlocation  =  await locationdetailsModel.findOne({user_id:req.body.user_id,default_status: true});
        var user_lat = userlocation.location_lat;
        var user_long = userlocation.location_long;
         console.log(user_lat,user_long);
        doctordetailsModel.find({}, function (err, StateList) {
        var final_data = [];
        var keyword = req.body.search_string.toLowerCase();
        for(let a = 0 ; a  < StateList.length ; a ++){
            var point1 = new GeoPoint(+user_lat, +user_long);
            var point2 = new GeoPoint(+StateList[a].clinic_lat,+StateList[a].clinic_long);
            var distance = point1.distanceTo(point2, true)//output in kilometers
            console.log(distance);
          var doctorname = StateList[a].dr_name.toLowerCase();
          if(doctorname.indexOf(keyword) !== -1 == true){
                if(req.body.communication_type == 0){
          if(StateList[a].communication_type == 'Online Or Visit' || StateList[a].communication_type == 'Online'){
            let d = {
            "_id": StateList[a]._id,
            "user_id": StateList[a].user_id,
            "dr_title": StateList[a].dr_title,
            "doctor_name": StateList[a].dr_name,
            "clinic_name": StateList[a].clinic_name,
            "specialization": StateList[a].specialization,
            "doctor_img": StateList[a].clinic_pic[0].clinic_pic,
            "clinic_loc" : StateList[a].clinic_loc,
            "communication_type" : StateList[a].communication_type,
            "distance" : ""+distance.toFixed(2),
            "star_count" : 2.5,
            "review_count" : 234,
            "amount" : StateList[a].consultancy_fees
          }
            final_data.push(d);
                  }      
                } else if(req.body.communication_type == 1){
            if(StateList[a].communication_type == 'Online Or Visit' || StateList[a].communication_type == 'Visit'){
          let d = {
            "_id": StateList[a]._id,
            "user_id": StateList[a].user_id,
            "dr_title": StateList[a].dr_title,
            "doctor_name": StateList[a].dr_name,
            "clinic_name": StateList[a].clinic_name,
            "specialization": StateList[a].specialization,
            "doctor_img": StateList[a].clinic_pic[0].clinic_pic,
            "clinic_loc" : StateList[a].clinic_loc,
            "communication_type" : StateList[a].communication_type,
            "distance" : ""+distance.toFixed(2),
            "star_count" : 2.5,
            "review_count" : 234,
            "amount" : StateList[a].consultancy_fees
          }
            final_data.push(d);
                  }

                }
          } else 
          {
            for(let b = 0; b < StateList[a].specialization.length ; b++){
              let spec = StateList[a].specialization[b].specialization.toLowerCase();
              if(spec.indexOf(keyword) !== -1 == true){
          if(req.body.communication_type == 0){
          if(StateList[a].communication_type == 'Online Or Visit' || StateList[a].communication_type == 'Online'){
            let d = {
            "_id": StateList[a]._id,
            "user_id": StateList[a].user_id,
            "dr_title": StateList[a].dr_title,
            "doctor_name": StateList[a].dr_name,
            "clinic_name": StateList[a].clinic_name,
            "specialization": StateList[a].specialization,
            "doctor_img": StateList[a].clinic_pic[0].clinic_pic,
            "clinic_loc" : StateList[a].clinic_loc,
            "communication_type" : StateList[a].communication_type,
            "distance" : ""+distance.toFixed(2),
            "star_count" : 2.5,
            "review_count" : 234,
            "amount" : StateList[a].consultancy_fees,
          }
            final_data.push(d);
                  }      
                } else if(req.body.communication_type == 1){
            if(StateList[a].communication_type == 'Online Or Visit' || StateList[a].communication_type == 'Visit'){
          let d = {
            "_id": StateList[a]._id,
            "user_id": StateList[a].user_id,
            "dr_title": StateList[a].dr_title,
            "doctor_name": StateList[a].dr_name,
            "clinic_name": StateList[a].clinic_name,
            "specialization": StateList[a].specialization,
            "doctor_img": StateList[a].clinic_pic[0].clinic_pic,
            "clinic_loc" : StateList[a].clinic_loc,
            "communication_type" : StateList[a].communication_type,
            "distance" : ""+distance.toFixed(2),
            "star_count" : 2.5,
            "review_count" : 234,
            "amount" : StateList[a].consultancy_fees,
          }
            final_data.push(d);
                  }

                }
              }
            }           
          }
          if(a == StateList.length - 1){
             if(req.body.communication_type == 0){
              let final_data_chat = [];
              for(let c  = 0 ; c < final_data.length ; c ++){
                 if(+final_data[c].distance < 15){
                   final_data_chat.push(final_data[c]);
                 }
                 if(c == final_data.length - 1){
                  if(final_data_chat.length == 0){
                  res.json({Status:"Success",Message:"No result found check with Online.", Data : final_data_chat ,Code:200});

                  }else{
                  res.json({Status:"Success",Message:"Text Search Details.", Data : final_data_chat ,Code:200});
                  }
                 }
              }
             } else 
             {
             res.json({Status:"Success",Message:"Text Search Result", Data : final_data ,Code:200});
             }
          }
        }
        });
});



router.post('/filter_doctor',async function (req, res) {
      let userlocation  =  await locationdetailsModel.findOne({user_id:req.body.user_id,default_status: true});
      var user_lat = userlocation.location_lat;
      var user_long = userlocation.location_long;
        doctordetailsModel.find({}, function (err, StateList) {
        final_data = [];
        for(let a = 0 ; a < StateList.length ; a ++){
          var point1 = new GeoPoint(+user_lat, +user_long);
          var point2 = new GeoPoint(+StateList[a].clinic_lat,+StateList[a].clinic_long);
          var distance = point1.distanceTo(point2, true)//output in kilometers
          let d = {
            "_id": StateList[a]._id,
            "user_id": StateList[a].user_id,
            "dr_title": StateList[a].dr_title,
            "doctor_name": StateList[a].dr_name,
            "clinic_name": StateList[a].clinic_name,
            "specialization": StateList[a].specialization,
            "doctor_img": StateList[a].clinic_pic[0].clinic_pic,
            "clinic_loc" : StateList[a].clinic_loc,
            "communication_type" : StateList[a].communication_type,
            "distance" : ""+distance.toFixed(2),
            "star_count" : 2.5,
            "review_count" : 234,
            "amount" : StateList[a].consultancy_fees,
          }
          final_data.push(d);
         if(a == StateList.length - 1){
        console.log('Check 1');
        var specialization_filter_data = [];
        if(req.body.specialization == '') {
          console.log('Check 2');
          specialization_filter_data = final_data;
           var star_count_filter_data = [];
            if(req.body.Review_count == 0){
              star_count_filter_data = specialization_filter_data;
            res.json({Status:"Success",Message:"Filtered Doctor List", Data : star_count_filter_data ,Code:200});
            }else{
              star_count_filter_data = [];
              for(let t = 0 ; t < specialization_filter_data.length ; t++){
                console.log("in");
                console.log(specialization_filter_data[t].star_count,req.body.Review_count);
                 if(specialization_filter_data[t].star_count <= req.body.Review_count){
                        star_count_filter_data.push(specialization_filter_data[t]);
                 }                  
                 if(t == specialization_filter_data.length - 1){
                  console.log("Output");
                    res.json({Status:"Success",Message:"Filtered Doctor List", Data : star_count_filter_data ,Code:200});

                 }
              }
            }
        } 
        else
        {
          console.log('check 3');
        for(let c = 0 ; c < final_data.length; c++){
          console.log(final_data[c]);
          console.log(final_data[c].specialization);
          for(let b = 0; b < final_data[c].specialization.length ; b++){
            console.log('check 4');
            console.log(final_data[c].specialization[b].specialization,req.body.specialization);
            if(final_data[c].specialization[b].specialization == req.body.specialization){
                  specialization_filter_data.push(final_data[c]);
            }
          }
          if(c == final_data.length - 1){
            console.log('check 5');
            var star_count_filter_data = [];
            if(req.body.Review_count == 0){
              star_count_filter_data = specialization_filter_data;
            res.json({Status:"Success",Message:"Filtered Doctor List", Data : star_count_filter_data ,Code:200});
            }else{
              for(let t = 0 ; t < specialization_filter_data.length ; t++){
                console.log("in");
                 if(specialization_filter_data[t].review_count > req.body.Review_count){
                        star_count_filter_data.push(specialization_filter_data[t]);
                 }                  
                 if(t == specialization_filter_data.length - 1){
                    res.json({Status:"Success",Message:"Filtered Doctor List", Data : star_count_filter_data ,Code:200});

                 }
              }
            }
          }
        }
        }
         }
        }
        });
});




// router.post('/filter_doctor', function (req, res) {
//         doctordetailsModel.find({}, function (err, StateList) {
//         // res.json({Status:"Success",Message:"Filtered Doctor List", Data : StateList ,Code:200});
//         final_data = [];
//         for(let a = 0 ; a < StateList.length ; a ++){
//           console.log(StateList[a]);
//           let d = {
//             "_id": StateList[a]._id,
//             "user_id": StateList[a].user_id,
//             "dr_title": StateList[a].dr_title,
//             "doctor_name": StateList[a].dr_name,
//             "clinic_name": StateList[a].clinic_name,
//             "specialization": StateList[a].specialization,
//             "doctor_img": StateList[a].clinic_pic[0].clinic_pic,
//             "clinic_loc" : StateList[a].clinic_loc,
//             "communication_type" : StateList[a].communication_type,
//             "distance" : "2" ,
//             "star_count" : 2.5,
//             "review_count" : 234
//           }
//           final_data.push(d);
//          if(a == StateList.length - 1){
//           res.json({Status:"Success",Message:"Filtered Doctor List", Data : final_data ,Code:200});
//          }
//         }
//         });
// });





router.post('/fetch_doctor_id', function (req, res) {
        doctordetailsModel.findOne({user_id:req.body.user_id}, function (err, StateList) {
          console.log(StateList);
          console.log(err);
      let dd = {
            '_id' : StateList._id,
            'user_id':  StateList.user_id,
            'dr_title' : StateList.dr_title,
            'dr_name' : StateList.dr_name,
            'clinic_name' : StateList.clinic_name,
            'clinic_loc' : StateList.clinic_loc,
            'clinic_lat' : StateList.clinic_lat,
            'clinic_long' : StateList.clinic_long,
            'education_details' : StateList.education_details,
            'experience_details' : StateList.experience_details,
            'specialization' : StateList.specialization,
            'pet_handled' : StateList.pet_handled,
            'clinic_pic' : StateList.clinic_pic,
            'certificate_pic' : StateList.certificate_pic,
            'govt_id_pic' : StateList.govt_id_pic,
            'photo_id_pic' : StateList.photo_id_pic,
            'profile_status' : StateList.profile_status,
            'profile_verification_status' : StateList.profile_verification_status,
            'slot_type' : StateList.slot_type,
            'date_and_time' : StateList.date_and_time,
            'descri' : "A class of medical instruction in which patients are examined and discussed. 2 : a group meeting devoted to the analysis and solution of concrete problems or to the acquiring of specific skills or knowledge writing clinics golf clinic",
            "star_count" : 4,
            "review_count": 223,
            "amount" : StateList.consultancy_fees,
            "mobile_type" : StateList.mobile_type,
            "communication_type" : StateList.communication_type,
            "doctor_exp" : StateList.doctor_exp
          }
          res.json({Status:"Success",Message:"Docotor Details", Data : dd ,Code:200});
        });
});


router.post('/fetch_doctor_user_id', function (req, res) {
        doctordetailsModel.findOne({user_id:req.body.user_id}, function (err, StateList) {
          console.log(StateList);
          res.json({Status:"Success",Message:"Docotor Details", Data : StateList ,Code:200});
        });
});





router.post('/check_status', function (req, res) {
        doctordetailsModel.findOne({user_id:req.body.user_id}, function (err, StateList) {
          console.log(StateList);
          let message = "Dear Doctor, We appreciate your interest and look forward to have you as part of Petfolio Team. Our team is reviewing your profile and will get in touch with you to close the formalities. Your profile is pending verification.";
         if(StateList == null){
          let dd = {
            'user_id' : req.body.user_id,
            'profile_status' : false,
            'profile_verification_status' : "Not verified",
            'calender_status' : false,
          }
          if(dd.profile_verification_status == "Not verified"){
             res.json({Status:"Success",Message:message, Data : dd ,Code:200});           
          } else if(dd.profile_verification_status == 0) {
              res.json({Status:"Success",Message:"Profile not updated", Data : dd ,Code:200});
          }else if(dd.calender_status  == 0) {
            res.json({Status:"Success",Message:"Doctor Calendor not updated", Data : dd ,Code:200});
          }else {
             res.json({Status:"Success",Message:"Doctor status", Data : dd ,Code:200});
          }
        }else {
          let dd = {
            'user_id' : req.body.user_id,
            'profile_status' : StateList.profile_status,
            'profile_verification_status' : StateList.profile_verification_status,
            'calender_status' : StateList.calender_status,
          }
          if(dd.profile_verification_status == "Not verified"){
             res.json({Status:"Success",Message:message, Data : dd ,Code:200});
          } else if(dd.profile_verification_status == 0) {
              res.json({Status:"Success",Message:"Profile not updated", Data : dd ,Code:200});
          } else if(dd.profile_verification_status == 0) {
              res.json({Status:"Success",Message:"Doctor Calendor not updated", Data : dd ,Code:200});
          }
          else {
            res.json({Status:"Success",Message:"Doctor Status", Data : dd ,Code:200});
          }
        }
        });
});


router.post('/update_calendar_status',async function (req, res) {
        let doctordetails  =  await doctordetailsModel.findOne({user_id:req.body.user_id});
        console.log(doctordetails);
        doctordetailsModel.findByIdAndUpdate(doctordetails._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Docotor Details Updated", Data : UpdatedDetails ,Code:200});
        });
});




router.get('/getlist', function (req, res) {
        doctordetailsModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Docotor Details Details", Data : Functiondetails ,Code:200});
        });
});



router.get('/admin/getlist', function (req, res) {
        doctordetailsModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Docotor Details Details", Data : Functiondetails ,Code:200});
        }).populate('user_id');
});


router.get('/mobile/getlist', function (req, res) {
        doctordetailsModel.find({}, function (err, Functiondetails) {
          let a = {
            usertypedata : Functiondetails
          }
          res.json({Status:"Success",Message:"Docotor Details Details", Data : a ,Code:200});
        });
});

router.post('/edit', function (req, res) {
 console.log(req.body);
 console.log(req.body.experience_details);
 var exp = 0;
 for(let a = 0 ; a  < req.body.experience_details.length ; a ++){
      exp = exp + req.body.experience_details[a].yearsofexperience;
 }
 console.log("Expr",exp);
 req.body.doctor_exp = exp;
  doctordetailsModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Docotor Details Updated", Data : UpdatedDetails ,Code:200});
        });
});


router.post('/adminedit', function (req, res) {
  doctordetailsModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Docotor Details Updated", Data : UpdatedDetails ,Code:200});
        });
});



router.post('/delete', function (req, res) {
 let c = {
    delete_status : true
  }
  doctordetailsModel.findByIdAndUpdate(req.body._id, c, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Location Deleted successfully", Data : UpdatedDetails ,Code:200});
  });
});




// // DELETES A USER FROM THE DATABASE
router.post('/admin_delete', function (req, res) {
      doctordetailsModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Docotor Details Deleted successfully", Data : {} ,Code:200});
      });
});


module.exports = router;
