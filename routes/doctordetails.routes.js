var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var doctordetailsModel = require('./../models/doctordetailsModel');
var temdoctordetailsModel = require('./../models/temdoctordetailsModel');
var locationdetailsModel = require('./../models/locationdetailsModel');
var GeoPoint = require('geopoint');

var Doctor_favModel = require('./../models/Doctor_favModel');

var AppointmentsModel = require('./../models/AppointmentsModel');
var walkin_appointmentModel = require('./../models/walkin_appointmentModel');
var doctorbannerModel = require('./../models/doctorbannerModel');


router.post('/create', async function(req, res) {
 var exp = 0;
 for(let a = 0 ; a  < req.body.experience_details.length ; a ++){
      exp = exp + req.body.experience_details[a].yearsofexperience;
 }
  try{
        await doctordetailsModel.create({
            user_id:  req.body.user_id,
            dr_title : req.body.dr_title || "",
            dr_name : req.body.dr_name || "",
            clinic_name : req.body.clinic_name  || "",
            clinic_loc : req.body.clinic_loc || "",
            business_email : req.body.business_email || "",
            clinic_lat : req.body.clinic_lat || 0,
            clinic_long : req.body.clinic_long || 0,
            education_details : req.body.education_details  || [],
            experience_details : req.body.experience_details|| [],
            specialization : req.body.specialization|| [],
            pet_handled : req.body.pet_handled|| [],
            clinic_pic : req.body.clinic_pic || [],
            thumbnail_image : req.body.thumbnail_image || '',
            certificate_pic : req.body.certificate_pic || [],
            govt_id_pic : req.body.govt_id_pic || [],
            photo_id_pic : req.body.photo_id_pic || [],
            profile_status : req.body.profile_status || false,
            profile_verification_status : req.body.profile_verification_status || "",
            slot_type : req.body.slot_type || "",
            date_and_time : req.body.date_and_time || "",
            signature : req.body.signature || "",
            mobile_type : req.body.mobile_type || "",
            communication_type : req.body.communication_type || "",
            live_status : "Not Live",
            live_by : "",
            delete_status : false,
            consultancy_fees : req.body.consultancy_fees || 0,
            calender_status : false,
            comments : 0,
            city_name : req.body.city_name,
            rating : 5,
            doctor_exp : exp || 0,
            doctor_info : req.body.doctor_info,
            clinic_no : req.body.clinic_no,
            doctor_id : req.body.doctor_id,
        },async function (err, user) {
                  await temdoctordetailsModel.create({
            user_id:  req.body.user_id,
            dr_title : req.body.dr_title || "",
            dr_name : req.body.dr_name || "",
            clinic_name : req.body.clinic_name  || "",
            clinic_loc : req.body.clinic_loc || "",
            clinic_lat : req.body.clinic_lat || 0,
            clinic_long : req.body.clinic_long || 0,
            education_details : req.body.education_details  || [],
            experience_details : req.body.experience_details|| [],
            specialization : req.body.specialization|| [],
            pet_handled : req.body.pet_handled|| [],
            clinic_pic : req.body.clinic_pic || [],
            thumbnail_image : req.body.thumbnail_image || '',
            certificate_pic : req.body.certificate_pic || [],
            govt_id_pic : req.body.govt_id_pic || [],
            photo_id_pic : req.body.photo_id_pic || [],
            profile_status : req.body.profile_status || false,
            profile_verification_status : req.body.profile_verification_status || "",
            slot_type : req.body.slot_type || "",
            date_and_time : req.body.date_and_time || "",
            signature : req.body.signature || "",
            mobile_type : req.body.mobile_type || "",
            communication_type : req.body.communication_type || "",
            live_status : "Not Live",
            live_by : "",
            delete_status : false,
            consultancy_fees : req.body.consultancy_fees || 0,
            calender_status : false,
            city_name : req.body.city_name,
            comments : 0,
            rating : 5,
            doctor_exp : exp || 0
        }, 
        function (err, user1) {
         console.log("Duplicated doctor_created_successfully");
        res.json({Status:"Success",Message:"Our team is reviewing your profile and will get in touch with you to close the formalities", Data : user ,Code:200}); 
        });
        // res.json({Status:"Success",Message:"Docotor Details Added successfully", Data : user ,Code:200}); 
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



// router.post('/text_search',async function (req, res) {
//       console.log(req.body);
//         let banner = [
//          { 
//           title : "title1",
//           image_path :"http://54.212.108.156:3000/api/uploads/1625817857968.png",
//         },
//          { 
//           title : "title1",
//           image_path :"http://54.212.108.156:3000/api/uploads/1625817887384.png",
//         }
//         ];

//         let userlocation  =  await locationdetailsModel.findOne({user_id:req.body.user_id,default_status: true});
//         var user_lat = userlocation.location_lat;
//         var user_long = userlocation.location_long;
//         doctordetailsModel.find({}, function (err, StateList) {
//         var final_data = [];
//         var keyword = req.body.search_string.toLowerCase();
//         for(let a = 0 ; a  < StateList.length ; a ++)
//         {
//             var point1 = new GeoPoint(+user_lat, +user_long);
//             var point2 = new GeoPoint(+StateList[a].clinic_lat,+StateList[a].clinic_long);
//             var distance = point1.distanceTo(point2, true)//output in kilometers
//           var doctorname = StateList[a].dr_name.toLowerCase();
//           if(doctorname.indexOf(keyword) !== -1 == true){
//           if(req.body.communication_type == 0){
//           if(StateList[a].communication_type == 'Online Or Visit' || StateList[a].communication_type == 'Online'){
//             let d = {
//             "_id": StateList[a]._id,
//             "user_id": StateList[a].user_id,
//             "dr_title": StateList[a].dr_title,
//             "doctor_name": StateList[a].dr_name,
//             'thumbnail_image' : StateList[a].thumbnail_image || 'http://54.212.108.156:3000/api/uploads/Pic_empty.jpg',
//             "clinic_name": StateList[a].clinic_name,
//             "specialization": StateList[a].specialization,
//             "doctor_img": StateList[a].clinic_pic[0].clinic_pic,
//             "clinic_loc" : StateList[a].clinic_loc,
//             "communication_type" : StateList[a].communication_type,
//             "distance" : ""+distance.toFixed(2),
//             "star_count" : +StateList[a].rating.toFixed(0) || 5,
//             "review_count" : StateList[a].comments || 0,
//             "doctor_exp": StateList[a].doctor_exp,
//             "city_name": StateList[a].city_name || "",
//             "amount" : StateList[a].consultancy_fees
//           }
//             final_data.push(d);
//           }      
//         } else if(req.body.communication_type == 1){
//             if(StateList[a].communication_type == 'Online Or Visit' || StateList[a].communication_type == 'Visit'){
//           let d = {
//             "_id": StateList[a]._id,
//             "user_id": StateList[a].user_id,
//             "dr_title": StateList[a].dr_title,
//             "doctor_name": StateList[a].dr_name,
//             "clinic_name": StateList[a].clinic_name,
//             "specialization": StateList[a].specialization,
//             'thumbnail_image' : StateList[a].thumbnail_image || 'http://54.212.108.156:3000/api/uploads/Pic_empty.jpg',
//             "doctor_img": StateList[a].clinic_pic[0].clinic_pic,
//             "clinic_loc" : StateList[a].clinic_loc,
//             "city_name": StateList[a].city_name || "",
//             "communication_type" : StateList[a].communication_type,
//             "distance" : ""+distance.toFixed(2),
//             "star_count" : +StateList[a].rating.toFixed(0) || 5,
//             "review_count" : StateList[a].comments || 0,
//             "doctor_exp": StateList[a].doctor_exp,
//             "amount" : StateList[a].consultancy_fees
//           }
//             final_data.push(d);
//                   }

//           }
//           } else 
//           {
//            for(let b = 0; b < StateList[a].specialization.length ; b++){
//               let spec = StateList[a].specialization[b].specialization.toLowerCase();
//               if(spec.indexOf(keyword) !== -1 == true){
//           if(req.body.communication_type == 0){
//           if(StateList[a].communication_type == 'Online Or Visit' || StateList[a].communication_type == 'Online'){
//             let d = {
//             "_id": StateList[a]._id,
//             "user_id": StateList[a].user_id,
//             "dr_title": StateList[a].dr_title,
//             "doctor_name": StateList[a].dr_name,
//             "clinic_name": StateList[a].clinic_name,
//             "specialization": StateList[a].specialization,
//             'thumbnail_image' : StateList[a].thumbnail_image || 'http://54.212.108.156:3000/api/uploads/Pic_empty.jpg',
//             "doctor_img": StateList[a].clinic_pic[0].clinic_pic,
//             "clinic_loc" : StateList[a].clinic_loc,
//             "city_name": StateList[a].city_name || "",
//             "communication_type" : StateList[a].communication_type,
//             "distance" : ""+distance.toFixed(2),
//             "star_count" : +StateList[a].rating.toFixed(0) || 5,
//             "review_count" : StateList[a].comments || 0,
//             "doctor_exp": StateList[a].doctor_exp,
//             "amount" : StateList[a].consultancy_fees,
//           }
//             final_data.push(d);
//             b = StateList[a].specialization.length;
//                   }      
//                 } else if(req.body.communication_type == 1){
//             if(StateList[a].communication_type == 'Online Or Visit' || StateList[a].communication_type == 'Visit'){
//           let d = {
//             "_id": StateList[a]._id,
//             "user_id": StateList[a].user_id,
//             "dr_title": StateList[a].dr_title,
//             "doctor_name": StateList[a].dr_name,
//             "clinic_name": StateList[a].clinic_name,
//             'thumbnail_image' : StateList[a].thumbnail_image || 'http://54.212.108.156:3000/api/uploads/Pic_empty.jpg',
//             "specialization": StateList[a].specialization,
//             "city_name": StateList[a].city_name || "",
//             "doctor_img": StateList[a].clinic_pic[0].clinic_pic,
//             "clinic_loc" : StateList[a].clinic_loc,
//             "communication_type" : StateList[a].communication_type,
//             "distance" : ""+distance.toFixed(2),
//             "star_count" : +StateList[a].rating.toFixed(0) || 5,
//             "review_count" :  StateList[a].comments || 0,
//             "doctor_exp": StateList[a].doctor_exp,
//             "amount" : StateList[a].consultancy_fees,
//           }
//             final_data.push(d);
//             b = StateList[a].specialization.length;
//                   }

//                 }
//               }
//             }           
//           }
//           if(a == StateList.length - 1){
//              if(req.body.communication_type == 0){
//               let final_data_chat = [];
//               for(let c  = 0 ; c < final_data.length ; c ++){
//                  if(+final_data[c].distance < 6000){
//                    final_data_chat.push(final_data[c]);
//                  }
//                  if(c == final_data.length - 1){
//                   if(final_data_chat.length == 0){
//                   res.json({Status:"Success",Message:"No result found check with Online.", Data : final_data_chat ,banner: banner,Code:200});

//                   }else{
//                   res.json({Status:"Success",Message:"Text Search Details.", Data : final_data_chat ,banner : banner,Code:200});
//                   }
//                  }
//               }
//              } else 
//              {
//              res.json({Status:"Success",Message:"Text Search Result", Data : final_data ,banner:banner,Code:200});
//              }
//           }
//         }
//         });
// });



router.post('/text_search',async function (req, res) {
        console.log(req.body);
        let banner = [];
        let doctor_banner  =  await doctorbannerModel.find({});
        console.log(doctor_banner);
        doctor_banner.forEach(element => {
        console.log(element);
        let a = { 
          title : element.img_title,
          image_path :element.img_path,
        }
        banner.push(a);
        });
        console.log(banner);
        let userlocation  =  await locationdetailsModel.findOne({user_id:req.body.user_id,default_status: true});
        var user_lat = userlocation.location_lat;
        var user_long = userlocation.location_long;
        doctordetailsModel.find({}, function (err, StateList) {
        var final_data = [];
        var keyword = req.body.search_string.toLowerCase();
        for(let a = 0 ; a  < StateList.length ; a ++)
        {
            var point1 = new GeoPoint(+user_lat, +user_long);
            var point2 = new GeoPoint(+StateList[a].clinic_lat,+StateList[a].clinic_long);
            var distance = point1.distanceTo(point2, true)//output in kilometers
          var doctorname = StateList[a].dr_name.toLowerCase();
          if(doctorname.indexOf(keyword) !== -1 == true){
          if(req.body.communication_type == 0){
          if(StateList[a].communication_type == 'Online Or Visit' || StateList[a].communication_type == 'Online'){
            let d = {
            "_id": StateList[a]._id,
            "user_id": StateList[a].user_id,
            "dr_title": StateList[a].dr_title,
            "doctor_name": StateList[a].dr_name,
            'thumbnail_image' : StateList[a].thumbnail_image || 'http://54.212.108.156:3000/api/uploads/Pic_empty.jpg',
            "clinic_name": StateList[a].clinic_name,
            "specialization": StateList[a].specialization,
            "doctor_img": StateList[a].clinic_pic[0].clinic_pic,
            "clinic_loc" : StateList[a].clinic_loc,
            "communication_type" : StateList[a].communication_type,
            "distance" : ""+distance.toFixed(2),
            "star_count" : +StateList[a].rating.toFixed(0) || 5,
            "review_count" : StateList[a].comments || 0,
            "doctor_exp": StateList[a].doctor_exp,
            "city_name": StateList[a].city_name || "",
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
            'thumbnail_image' : StateList[a].thumbnail_image || 'http://54.212.108.156:3000/api/uploads/Pic_empty.jpg',
            "doctor_img": StateList[a].clinic_pic[0].clinic_pic,
            "clinic_loc" : StateList[a].clinic_loc,
            "city_name": StateList[a].city_name || "",
            "communication_type" : StateList[a].communication_type,
            "distance" : ""+distance.toFixed(2),
            "star_count" : +StateList[a].rating.toFixed(0) || 5,
            "review_count" : StateList[a].comments || 0,
            "doctor_exp": StateList[a].doctor_exp,
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
            'thumbnail_image' : StateList[a].thumbnail_image || 'http://54.212.108.156:3000/api/uploads/Pic_empty.jpg',
            "doctor_img": StateList[a].clinic_pic[0].clinic_pic,
            "clinic_loc" : StateList[a].clinic_loc,
            "city_name": StateList[a].city_name || "",
            "communication_type" : StateList[a].communication_type,
            "distance" : ""+distance.toFixed(2),
            "star_count" : +StateList[a].rating.toFixed(0) || 5,
            "review_count" : StateList[a].comments || 0,
            "doctor_exp": StateList[a].doctor_exp,
            "amount" : StateList[a].consultancy_fees,
          }
            final_data.push(d);
            b = StateList[a].specialization.length;
                  }      
                } else if(req.body.communication_type == 1){
            if(StateList[a].communication_type == 'Online Or Visit' || StateList[a].communication_type == 'Visit'){
          let d = {
            "_id": StateList[a]._id,
            "user_id": StateList[a].user_id,
            "dr_title": StateList[a].dr_title,
            "doctor_name": StateList[a].dr_name,
            "clinic_name": StateList[a].clinic_name,
            'thumbnail_image' : StateList[a].thumbnail_image || 'http://54.212.108.156:3000/api/uploads/Pic_empty.jpg',
            "specialization": StateList[a].specialization,
            "city_name": StateList[a].city_name || "",
            "doctor_img": StateList[a].clinic_pic[0].clinic_pic,
            "clinic_loc" : StateList[a].clinic_loc,
            "communication_type" : StateList[a].communication_type,
            "distance" : ""+distance.toFixed(2),
            "star_count" : +StateList[a].rating.toFixed(0) || 5,
            "review_count" :  StateList[a].comments || 0,
            "doctor_exp": StateList[a].doctor_exp,
            "amount" : StateList[a].consultancy_fees,
          }
            final_data.push(d);
            b = StateList[a].specialization.length;
                  }

                }
              }
            }           
          }
          if(a == StateList.length - 1){
            console.log("Test 1");
             if(req.body.communication_type == 0){
              let final_data_chat = [];
              console.log(final_data.length);
              if(final_data.length == 0){
                res.json({Status:"Success",Message:"Text Search Details.", Data : final_data_chat ,banner : banner,Code:200});
              }else{
              for(let c  = 0 ; c < final_data.length ; c ++){
                 final_data_chat.push(final_data[c]);
                 if(c == final_data.length - 1){
                  if(final_data_chat.length == 0){
                  res.json({Status:"Success",Message:"No result found check with Online.", Data : final_data_chat ,banner: banner,Code:200});

                  }else{
                  res.json({Status:"Success",Message:"Text Search Details.", Data : final_data_chat ,banner : banner,Code:200});
                  }
                 }
              }
              }

             } else 
             {
             res.json({Status:"Success",Message:"Text Search Result", Data : final_data ,banner:banner,Code:200});
             }
          }
        }
        });
});



router.post('/filter_doctor',async function (req, res) {

  console.log('filter_doctor',req.body);

    let banner = [
        { 
          title : "title1",
          image_path :"http://54.212.108.156:3000/api/uploads/1625817857968.png",
        },
         { 
          title : "title1",
          image_path :"http://54.212.108.156:3000/api/uploads/1625817887384.png",
        }
        ];
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
            "city_name": StateList[a].city_name || "",
            "doctor_img": StateList[a].clinic_pic[0].clinic_pic,
            "clinic_loc" : StateList[a].clinic_loc,
            "communication_type" : StateList[a].communication_type,
            "distance" : ""+distance.toFixed(2),
            "star_count" : +StateList[a].rating.toFixed(0) || 5,
            "review_count" : StateList[a].comments || 0,
            "amount" : StateList[a].consultancy_fees,
          }
          final_data.push(d);
         if(a == StateList.length - 1){
        var specialization_filter_data = [];
        if(req.body.specialization == '') {
          specialization_filter_data = final_data;
           var star_count_filter_data = [];
            if(req.body.Review_count == 0){
              star_count_filter_data = specialization_filter_data;
            res.json({Status:"Success",Message:"Filtered Doctor List", Data : star_count_filter_data ,banner: banner,Code:200});
            }else{
              star_count_filter_data = [];
              for(let t = 0 ; t < specialization_filter_data.length ; t++){
                 if(specialization_filter_data[t].star_count <= req.body.Review_count){
                        star_count_filter_data.push(specialization_filter_data[t]);
                 }                  
                 if(t == specialization_filter_data.length - 1){
                    res.json({Status:"Success",Message:"Filtered Doctor List", Data : star_count_filter_data ,banner: banner,Code:200});

                 }
              }
            }
        } 
        else
        {
        for(let c = 0 ; c < final_data.length; c++){
          for(let b = 0; b < final_data[c].specialization.length ; b++){
            if(final_data[c].specialization[b].specialization == req.body.specialization){
                  specialization_filter_data.push(final_data[c]);
            }
          }
          if(c == final_data.length - 1){
            var star_count_filter_data = [];
            if(req.body.Review_count == 0){
              star_count_filter_data = specialization_filter_data;
            res.json({Status:"Success",Message:"Filtered Doctor List", Data : star_count_filter_data ,banner: banner,Code:200});
            }else{
                if(specialization_filter_data.length == 0){
                   star_count_filter_data = specialization_filter_data;
                   res.json({Status:"Success",Message:"Filtered Doctor List", Data : star_count_filter_data ,banner: banner,Code:200});
               }

              for(let t = 0 ; t < specialization_filter_data.length ; t++){
                console.log(specialization_filter_data[t].star_count,req.body.Review_count);
                 if(specialization_filter_data[t].star_count == req.body.Review_count){
                        star_count_filter_data.push(specialization_filter_data[t]);
                 }                  
                 if(t == specialization_filter_data.length - 1){
                    res.json({Status:"Success",Message:"Filtered Doctor List", Data : star_count_filter_data ,banner: banner,Code:200});
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
      doctordetailsModel.findOne({user_id:req.body.doctor_id},async function (err, StateList) {
      var doc_fav = await Doctor_favModel.findOne({user_id:req.body.user_id,doctor_id:req.body.doctor_id});
      var temp_fav = false;
        if(doc_fav !==  null){
               temp_fav = true;
        }
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
            'thumbnail_image' : StateList.thumbnail_image || 'http://54.212.108.156:3000/api/uploads/Pic_empty.jpg',
            'certificate_pic' : StateList.certificate_pic,
            'govt_id_pic' : StateList.govt_id_pic,
            'photo_id_pic' : StateList.photo_id_pic,
            'profile_status' : StateList.profile_status,
            'profile_verification_status' : StateList.profile_verification_status,
            'slot_type' : StateList.slot_type,
            'date_and_time' : StateList.date_and_time,
            'descri' : StateList.doctor_info,
            "star_count" : +StateList.rating.toFixed(0) || 5,
            "review_count": StateList.comments || 0,
            "amount" : StateList.consultancy_fees,
            "mobile_type" : StateList.mobile_type,
            "communication_type" : StateList.communication_type,
            "doctor_exp" : StateList.doctor_exp,
            "signature" : StateList.signature,
            "fav" : temp_fav
          }
          console.log(dd);
          res.json({Status:"Success",Message:"Docotor Details", Data : dd ,Code:200});
        });
});


router.post('/fetch_doctor_user_id', function (req, res) {
        doctordetailsModel.findOne({user_id:req.body.user_id}, function (err, StateList) {
         StateList.rating = StateList.rating.toFixed(0);
          console.log(StateList.rating);
          res.json({Status:"Success",Message:"Docotor Details", Data : StateList ,Code:200});
        });
});





router.post('/check_status', function (req, res) {
        doctordetailsModel.findOne({user_id:req.body.user_id}, function (err, StateList) {
          let message = "Dear Doctor, We appreciate your interest and look forward to have you as part of Healthz Team. Our team is reviewing your profile and will get in touch with you to close the formalities. Your profile is pending verification.";
         console.log(doctordetailsModel);
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
        doctordetailsModel.findByIdAndUpdate(doctordetails._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Docotor Details Updated", Data : UpdatedDetails ,Code:200});
        });
});



router.post('/doctor/dashboar',async function (req, res) {
  var appointment_status_new = await AppointmentsModel.find({doctor_id:req.body.doctor_id, appoinment_status : "Incomplete"}).count();
  var appointment_status_com = await AppointmentsModel.find({doctor_id:req.body.doctor_id, appoinment_status : "Completed"}).count();
  var appointment_status_mis = await AppointmentsModel.find({doctor_id:req.body.doctor_id, appoinment_status : "Missed"}).count();
  var appointment_status = await AppointmentsModel.find({doctor_id:req.body.doctor_id, appoinment_status : "Completed"});
  let price = 0;
  for(let c  = 0 ; c < appointment_status.length; c++){
    price = price + +appointment_status[c].amount;
  }
let a  = {
    new_appointment_count : appointment_status_new,
    complete_appointment_count : appointment_status_com,
    missed_appointment_count : appointment_status_mis,
    payment_detail : price,
    msg : 1
}
res.json({Status:"Success",Message:"Docotor Dashboar Detail", Data : a ,Code:200});
});


router.post('/doctor/dashboar1',async function (req, res) {
  var appointment_status_new = await walkin_appointmentModel.find({doctor_id:req.body.doctor_id, appoinment_status : "Incomplete"}).count();
  var appointment_status_com = await walkin_appointmentModel.find({doctor_id:req.body.doctor_id, appoinment_status : "Completed"}).count();
  var appointment_status_mis = await walkin_appointmentModel.find({doctor_id:req.body.doctor_id, appoinment_status : "Missed"}).count();
  var appointment_status = await walkin_appointmentModel.find({doctor_id:req.body.doctor_id, appoinment_status : "Completed"});
    let price = 0;
  for(let c  = 0 ; c < appointment_status.length; c++){
    price = price + +appointment_status[c].amount;
  }
let a  = {
    new_appointment_count : appointment_status_new,
    complete_appointment_count : appointment_status_com,
    missed_appointment_count : appointment_status_mis,
    payment_detail : price,
    msg : 1
}
res.json({Status:"Success",Message:"Docotor Dashboar Detail", Data : a ,Code:200});
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



router.post('/verify/edit', function (req, res) {
  doctordetailsModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Docotor Details Updated", Data : UpdatedDetails ,Code:200});
     });
});





router.post('/edit', function (req, res) {
 var exp = 0;
 for(let a = 0 ; a  < req.body.experience_details.length ; a ++){
      exp = exp + req.body.experience_details[a].yearsofexperience;
 }
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
