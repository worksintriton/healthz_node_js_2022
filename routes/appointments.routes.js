var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var AppointmentsModel = require('./../models/AppointmentsModel');
var SP_appointmentsModels = require('./../models/SP_appointmentsModels');
var doctordetailsModel = require('./../models/doctordetailsModel');
var locationdetailsModel = require('./../models/locationdetailsModel');
var reviewdetailsModel = require('./../models/reviewdetailsModel');
var userdetailsModel = require('./../models/userdetailsModel');
var refund_couponModel = require('./../models/refund_couponModel');
var petdetailsModel = require('./../models/petdetailsModel');
var family = require('./../models/familymemberModel');


var request = require("request");
var walkinappointmentsModel = require('./../models/walkin_appointmentModel');
router.post('/mobile/create', async function(req, res) {
  try{
    var Appointment_details = await AppointmentsModel.findOne({doctor_id:req.body.doctor_id,booking_date:req.body.booking_date,booking_time:req.body.booking_time,appoinment_status : "Incomplete"});
    if(Appointment_details !== null){
      res.json({Status:"Failed",Message:"Slot Not Available", Data : Appointment_details ,Code:404}); 
    }
    else
    {
        let display_date = req.body.date_and_time;
        let Appointmentid = "AID - " + new Date().getTime();
        var doctordetailsModels = await doctordetailsModel.findOne({user_id:req.body.doctor_id});
        var petdetailsModels = await family.findOne({_id:req.body.family_id});
        var doctor_token =  await userdetailsModel.findOne({_id:req.body.doctor_id});
        var user_token = await userdetailsModel.findOne({_id:req.body.user_id});
        await AppointmentsModel.create({
            doctor_id : req.body.doctor_id,
            appointment_UID : Appointmentid,
            booking_date : req.body.booking_date || "",
            booking_time : req.body.booking_time || "",
            booking_date_time : req.body.booking_date_time || "",
            communication_type : req.body.communication_type || "",
            msg_id : Appointmentid || "",
            video_id : req.body.video_id || "",
            user_id : req.body.user_id || "",
            family_id : req.body.family_id || "",
            problem_info : req.body.problem_info || "",
            doc_attched : req.body.doc_attched || [],
            appoinment_status : "Incomplete",
            start_appointment_status : "Not Started",
            end_appointment_status : "Not End",
            doc_feedback : req.body.doc_feedback || "",
            doc_rate : req.body.doc_rate || "",
            user_feedback : req.body.user_feedback || "",
            user_rate : req.body.user_rate || 0,
            display_date : req.body.display_date || "",
            server_date_time : req.body.server_date_time || "",
            payment_method : req.body.payment_method || "",
            prescription_details : "",
            vaccination_details :"",
            appointment_types : req.body.appointment_types || "",
            allergies : req.body.allergies || "",
            payment_id : req.body.payment_id || "",
            amount : req.body.amount || "0",
            service_name :  req.body.service_name || "",
            service_amount :  req.body.service_amount || "",
            completed_at : "",
            missed_at : "",
            mobile_type : req.body.mobile_type || "",
            doc_business_info : doctordetailsModels || [],
            delete_status : false,
            appoint_patient_st : "",
            date_and_time : req.body.date_and_time,
            pervious_app_date : "",
            reshedule_status : "",
            location_id : req.body.location_id || "",
            visit_type : req.body.visit_type || "",
            doctor_comment : req.body.doctor_comment || "",
            diagnosis :  req.body.diagnosis || "",
            sub_diagnosis : req.body.sub_diagnosis || "",
            health_issue_title : req.body.health_issue_title || "",
            

            coupon_status : req.body.coupon_status || "",
            coupon_code : req.body.coupon_code || "",
            original_price : req.body.original_price || 0,
            discount_price : req.body.discount_price || 0,
            total_price : req.body.total_price || 0,
            visibility : "visible",
            current_img : req.body.current_img || [],
        }, 
        function (err, user) {
          var data = {
          _id : user._id,
          video_id : "https://meet.jit.si/" + user._id,
          msg_id : "Meeting_id/"+user._id,
         }
          AppointmentsModel.findByIdAndUpdate(data._id, data, {new: true},async function (err, UpdatedDetails) {
             if(req.body.coupon_code !== ""){
              var refund_detail = await refund_couponModel.findOne({code:req.body.coupon_code,user_details:req.body.user_id});
              if(refund_detail == null){
              }
              else{
              let update = {
                 used_status : "Used"
              }
              refund_couponModel.findByIdAndUpdate(refund_detail._id, update, {new: true},async function (err, tokenupdate) {
              });
              }
             }
            if (err) return res.status(500).send("There was a problem updating the user.");
var params = {

            "user_id":  user_token._id,
            "notify_title" : "New Appointment Alert",
            "notify_descri" : "Your Appointment Has Been Booked successfully For Your Pet " + family.name + " at " + req.body.booking_date_time,
            "notify_img" : "",
            "notify_time" : "",
            "date_and_time" : req.body.booking_date_time,
            "user_token" : user_token.fb_token,
            "data_type" : {
            "usertype":"1",
            "appintments":"New",
            "orders":""
             }
}

var params1 = {
            "user_token" : doctor_token.fb_token,
            "notify_title" : "You Have a New Appointment",
            "notify_descri" : "You Have Got a New Appointment with " + family.name  + " at " + req.body.booking_date_time,
            "notify_img" : "",
            "notify_time" : "",
            "date_and_time" : req.body.booking_date_time,
            "user_id" : doctor_token._id,
            "data_type" : {
            "usertype":"4",
            "appintments":"New",
            "orders":""
             }
}

request.post(
    'http://35.165.75.97:3000/api/notification/send_notifiation',
    { json: params },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
        }
    }
);

request.post(
    'http://35.165.75.97:3000/api/notification/send_notifiation',
    { json: params1 },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
        }
    }
);
     
res.json({Status:"Success",Message:"Appointment Booked successfully", Data : user ,Code:200});    
        });
        });
    }
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});


///////////////////////PET Lover Appointment List///////////

router.post('/mobile/plove_getlist/newapp1',async function (req, res) {
 var sp_appointmentlist =  await SP_appointmentsModels.find({user_id:req.body.user_id,appoinment_status:"Incomplete"}).populate('user_id sp_id family_id');
 var doctor_appointmentlist =  await AppointmentsModel.find({user_id:req.body.user_id,appoinment_status:"Incomplete"}).populate('user_id doctor_id family_id');
  var final_appointment_list = [];
  if(doctor_appointmentlist.length == 0 && sp_appointmentlist.length == 0){
   res.json({Status:"Success",Message:"New Appointment List", Data : final_appointment_list ,Code:200});
  } else {
  if(sp_appointmentlist.length !== 0){
   for(let a = 0 ; a < sp_appointmentlist.length ; a ++){
         let fin = {
          "_id" : sp_appointmentlist[a]._id,
          "Booking_Id":sp_appointmentlist[a].appointment_UID,
          "appointment_for" : "SP",
          "photo" : sp_appointmentlist[a].sp_business_info[0].thumbnail_image || '',
          "clinic_name" :   "",
          "name" :  sp_appointmentlist[a].family_id.name,
          "appointment_type" : "",
          "cost" : sp_appointmentlist[a].service_amount,
          "appointment_time" : sp_appointmentlist[a].booking_date_time,
          "createdAt" :  sp_appointmentlist[a].createdAt,
          "updatedAt" :  sp_appointmentlist[a].updatedAt,
          "relation_type" : sp_appointmentlist[a].family_id.relation_type,
          "type" : "" ,
          "service_provider_name" : sp_appointmentlist[a].sp_business_info[0].bussiness_name,
          "Service_name" :  sp_appointmentlist[a].service_name,
          "service_cost" : sp_appointmentlist[a].service_amount,
          "Booked_at" : sp_appointmentlist[a].booking_date_time,
          "missed_at" : sp_appointmentlist[a].missed_at|| "",
          "completed_at" : sp_appointmentlist[a].completed_at|| "",
          "user_rate" : +parseFloat(sp_appointmentlist[a].user_rate).toFixed(0) || 0,
          "user_feedback" : sp_appointmentlist[a].user_feedback|| "",          
          "status" : sp_appointmentlist[a].appoinment_status,
          "payment_method" : sp_appointmentlist[a].payment_method || "",
          "appoint_patient_st": "",
          "communication_type": "",
          "doctor_name": "",
          "start_appointment_status": "",
          "user_id" : sp_appointmentlist[a].user_id._id,
          "sp_id" : sp_appointmentlist[a].sp_id._id,
          "doctor_id": "",
        }
        final_appointment_list.push(fin);
    if(a == sp_appointmentlist.length - 1){
       if(doctor_appointmentlist.length == 0){
         final_appointment_list.sort(function compare(a, b) {
               var dateA = new Date(a.updatedAt);
               var dateB = new Date(b.updatedAt);
               return dateB - dateA;
               });
          res.json({Status:"Success",Message:"New Appointment List", Data : final_appointment_list ,Code:200});
       }else{
        for(let b = 0 ; b < doctor_appointmentlist.length ; b ++){
           var oldDateObj = new Date(doctor_appointmentlist[b].display_date);
           var s = new Date(doctor_appointmentlist[b].display_date);
           s.setMinutes(s.getMinutes()+45);
           var curr = new Date(req.body.current_time);
           if(s > curr){
            let fin = {
          "_id" : doctor_appointmentlist[b]._id,
          "Booking_Id": doctor_appointmentlist[b].appointment_UID,
          "appointment_for" : "Doctor",
          "photo" : doctor_appointmentlist[b].doc_business_info[0].thumbnail_image || '',
          "clinic_name" :  doctor_appointmentlist[b].doc_business_info[0].clinic_name,
          "name" : doctor_appointmentlist[b].family_id.name,
          "appointment_type" : doctor_appointmentlist[b].appointment_types,
          "communication_type" : doctor_appointmentlist[b].communication_type,
          "cost" : doctor_appointmentlist[b].amount,
          "appointment_time" : doctor_appointmentlist[b].booking_date_time,
          "createdAt" :  doctor_appointmentlist[b].createdAt,
          "updatedAt" :  doctor_appointmentlist[b].updatedAt,
          "relation_type" : doctor_appointmentlist[b].family_id.relation_type,
          "payment_method" : doctor_appointmentlist[b].payment_method || "",
          "start_appointment_status" : doctor_appointmentlist[b].start_appointment_status,
          "type" : "" ,
          "doctor_name" : doctor_appointmentlist[b].doctor_id.first_name+" "+doctor_appointmentlist[b].doctor_id.last_name,
          "service_provider_name" :"",
          "Service_name" : "",
          "service_cost" : "",
          "Booked_at" : doctor_appointmentlist[b].booking_date_time,
          "missed_at" : doctor_appointmentlist[b].missed_at || "",
          "completed_at" : doctor_appointmentlist[b].completed_at || "",
          "user_rate" : +parseFloat(doctor_appointmentlist[b].user_rate).toFixed(0)|| 0,
          "user_feedback" : doctor_appointmentlist[b].user_feedback|| "",   
          "status" : doctor_appointmentlist[b].appoinment_status|| "",
          "appoint_patient_st" : doctor_appointmentlist[b].appoint_patient_st || "",
          "user_id" : doctor_appointmentlist[b].user_id._id || "",
          "doctor_id": doctor_appointmentlist[b].doctor_id._id || "",
          "location_id": doctor_appointmentlist[b].location_id || "",
          "visit_type": doctor_appointmentlist[b].visit_type || "", 


          "sp_id" : "",
        }
        final_appointment_list.push(fin);
         } 
           else {
               var params = {
              "status":"No show",
              "date" : doctor_appointmentlist[b].booking_date_time,
              "appointment_UID" : doctor_appointmentlist[b].appointment_UID,
              "user_id" : doctor_appointmentlist[b].doctor_id._id,
              "doctor_id" : doctor_appointmentlist[b].user_id._id
              }
            request.post(
                'http://35.165.75.97:3000/api/notification/mobile/alert/notification',
                { json: params },
                function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                    }
                }
            );
             let c = {
                missed_at : doctor_appointmentlist[b].booking_date_time,
                appoinment_status : "Missed",
                appoint_patient_st : "Doctor missed appointment"
              }
             AppointmentsModel.findByIdAndUpdate(doctor_appointmentlist[b]._id, c, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500}); 
            });
           }
        if(b == doctor_appointmentlist.length - 1){
           final_appointment_list.sort(function compare(a, b) {
               var dateA = new Date(a.updatedAt);
               var dateB = new Date(b.updatedAt);
               return dateB - dateA;
               });
           res.json({Status:"Success",Message:"New Appointment List", Data : final_appointment_list ,Code:200});
        }
       }

       }
    }
  }
  }
   else
  {
  for(let b = 0 ; b < doctor_appointmentlist.length ; b ++){
           var oldDateObj = new Date(doctor_appointmentlist[b].display_date);
           var s = new Date(doctor_appointmentlist[b].display_date);
           s.setMinutes(s.getMinutes()+30);
           var curr = new Date(req.body.current_time);
           if(s > curr){
          let fin = {
          "_id" : doctor_appointmentlist[b]._id,
          "Booking_Id":doctor_appointmentlist[b].appointment_UID,
          "appointment_for" : "Doctor",
          "photo" : doctor_appointmentlist[b].doc_business_info[0].thumbnail_image || '',
          "clinic_name" :  doctor_appointmentlist[b].doc_business_info[0].clinic_name,
          "name" : doctor_appointmentlist[b].family_id.name,
          "appointment_type" : doctor_appointmentlist[b].appointment_types,
          "communication_type" : doctor_appointmentlist[b].communication_type,
          "cost" : doctor_appointmentlist[b].amount,
          "appointment_time" : doctor_appointmentlist[b].booking_date_time,
          "start_appointment_status" : doctor_appointmentlist[b].start_appointment_status,
          "createdAt" :  doctor_appointmentlist[b].createdAt,
          "payment_method" : doctor_appointmentlist[b].payment_method || "",
          "updatedAt" :  doctor_appointmentlist[b].updatedAt,
          "relation_type" : doctor_appointmentlist[b].family_id.relation_type,
          "type" : "" ,
          "doctor_name" : doctor_appointmentlist[b].doctor_id.first_name+" "+doctor_appointmentlist[b].doctor_id.last_name,
          "service_provider_name" :"",
          "Service_name" : "",
          "service_cost" : "",
          "Booked_at" : doctor_appointmentlist[b].booking_date_time,
          "missed_at" : doctor_appointmentlist[b].missed_at || "",
          "completed_at" : doctor_appointmentlist[b].completed_at || "",
          "user_rate" : +parseFloat(doctor_appointmentlist[b].user_rate).toFixed(0) || 0,
          "user_feedback" : doctor_appointmentlist[b].user_feedback|| "",   
          "status" : doctor_appointmentlist[b].appoinment_status ,
          "appoint_patient_st" : doctor_appointmentlist[b].appoint_patient_st || "",
          "user_id" : doctor_appointmentlist[b].user_id._id || "",
          "doctor_id": doctor_appointmentlist[b].doctor_id._id || "",
          "location_id": doctor_appointmentlist[b].location_id || "",
          "visit_type": doctor_appointmentlist[b].visit_type || "",      
          "sp_id" : "",
        }
        final_appointment_list.push(fin);
           } 
           else {
             let c = {
                missed_at :  doctor_appointmentlist[b].booking_date_time,
                appoinment_status : "Missed",
                appoint_patient_st : "Doctor missed appointment"
              }
             AppointmentsModel.findByIdAndUpdate(doctor_appointmentlist[b]._id, c, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500}); 
            });
           }
        if(b == doctor_appointmentlist.length - 1){

          final_appointment_list.sort(function compare(a, b) {
               var dateA = new Date(a.updatedAt);
               var dateB = new Date(b.updatedAt);
               return dateB - dateA;
               });

           res.json({Status:"Success",Message:"New Appointment List", Data : final_appointment_list ,Code:200});
        }
  }
  }
  }        
});






router.post('/mobile/plove_getlist/comapp1',async function (req, res) {
 var sp_appointmentlist =  await SP_appointmentsModels.find({user_id:req.body.user_id,appoinment_status:"Completed"}).populate('user_id sp_id family_id');
 var doctor_appointmentlist =  await AppointmentsModel.find({user_id:req.body.user_id,appoinment_status:"Completed"}).populate('user_id doctor_id family_id');
  var final_appointment_list = [];
  if(doctor_appointmentlist.length == 0 && sp_appointmentlist.length == 0){
   res.json({Status:"Success",Message:"Completed Appointment List", Data : final_appointment_list ,Code:200});
  } else {
  if(sp_appointmentlist.length !== 0){
   for(let a = 0 ; a < sp_appointmentlist.length ; a ++){
         let fin = {
          "_id" : sp_appointmentlist[a]._id,
          "Booking_Id":sp_appointmentlist[a].appointment_UID,
          "appointment_for" : "SP",
          "photo" : sp_appointmentlist[a].sp_business_info[0].thumbnail_image || '',
          "clinic_name" :   "",
          "name" :  sp_appointmentlist[a].family_id.name,
          "appointment_type" : "",
          "cost" : sp_appointmentlist[a].service_amount,
          "appointment_time" : sp_appointmentlist[a].booking_date_time,
          "createdAt" :  sp_appointmentlist[a].createdAt,
          "updatedAt" :  sp_appointmentlist[a].updatedAt,
          "relation_type" : sp_appointmentlist[a].family_id.relation_type,
          "type" : "" ,
          "service_provider_name" : sp_appointmentlist[a].sp_business_info[0].bussiness_name,
          "Service_name" :  sp_appointmentlist[a].service_name,
          "service_cost" : sp_appointmentlist[a].service_amount,
          "Booked_at" : sp_appointmentlist[a].booking_date_time,
          "missed_at" : sp_appointmentlist[a].missed_at|| "",
          "completed_at" : sp_appointmentlist[a].completed_at|| "",
          "user_rate" : +parseFloat(sp_appointmentlist[a].user_rate).toFixed(0) || 0,
          "user_feedback" : sp_appointmentlist[a].user_feedback|| "",   
          "status" : sp_appointmentlist[a].appoinment_status,
          "appoint_patient_st": "",
          "communication_type": "",
          "doctor_name": "",
          "start_appointment_status": "",
          "user_id" : sp_appointmentlist[a].user_id._id,
          "sp_id" : sp_appointmentlist[a].sp_id._id,
          "doctor_id": "",
        }
        final_appointment_list.push(fin);
    if(a == sp_appointmentlist.length - 1){
       if(doctor_appointmentlist.length == 0){
         final_appointment_list.sort(function compare(a, b) {

               var dateA = new Date(a.updatedAt);
               var dateB = new Date(b.updatedAt);
               return dateB - dateA;
               });
          res.json({Status:"Success",Message:"Completed Appointment List", Data : final_appointment_list ,Code:200});
       }else{
        for(let b = 0 ; b < doctor_appointmentlist.length ; b ++){
            let fin = {
          "_id" : doctor_appointmentlist[b]._id,
          "Booking_Id":doctor_appointmentlist[b].appointment_UID,
          "appointment_for" : "Doctor",
          "photo" : doctor_appointmentlist[b].doc_business_info[0].thumbnail_image || '',
          "clinic_name" :  doctor_appointmentlist[b].doc_business_info[0].clinic_name,
          "name" : doctor_appointmentlist[b].family_id.name,
          "appointment_type" : doctor_appointmentlist[b].appointment_types,
          "communication_type" : doctor_appointmentlist[b].communication_type,
          "cost" : doctor_appointmentlist[b].amount,
           "start_appointment_status" : doctor_appointmentlist[b].start_appointment_status,
          "appointment_time" : doctor_appointmentlist[b].booking_date_time,
          "createdAt" :  doctor_appointmentlist[b].createdAt,
          "updatedAt" :  doctor_appointmentlist[b].updatedAt,
          "relation_type" : doctor_appointmentlist[b].family_id.relation_type,
          "type" : "" ,
          "service_provider_name" :"",
          "Service_name" : "",
          "service_cost" : "",
          "doctor_name" : doctor_appointmentlist[b].doctor_id.first_name+" "+doctor_appointmentlist[b].doctor_id.last_name,
          "Booked_at" : doctor_appointmentlist[b].booking_date_time,
          "appoint_patient_st" : doctor_appointmentlist[b].appoint_patient_st || "",
          "missed_at" : doctor_appointmentlist[b].missed_at || "",
          "completed_at" : doctor_appointmentlist[b].completed_at || "",
          "user_rate" : +parseFloat(doctor_appointmentlist[b].user_rate).toFixed(0) || 0,
          "user_feedback" : doctor_appointmentlist[b].user_feedback|| "",   
          "status" : doctor_appointmentlist[b].appoinment_status,
           "user_id" : doctor_appointmentlist[b].user_id._id || "",
          "doctor_id": doctor_appointmentlist[b].doctor_id._id || "",
          "location_id": doctor_appointmentlist[b].location_id || "",
          "visit_type": doctor_appointmentlist[b].visit_type || "",      
          "sp_id" : "",
        }
        final_appointment_list.push(fin);
        if(b == doctor_appointmentlist.length - 1){
           final_appointment_list.sort(function compare(a, b) {

               var dateA = new Date(a.updatedAt);
               var dateB = new Date(b.updatedAt);
               return dateB - dateA;
               });
           res.json({Status:"Success",Message:"Completed Appointment List", Data : final_appointment_list ,Code:200});
        }
       }

       }
    }
  }
  } else
  {
  for(let b = 0 ; b < doctor_appointmentlist.length ; b ++){
        let fin = {
          "_id" : doctor_appointmentlist[b]._id,
          "Booking_Id":doctor_appointmentlist[b].appointment_UID,
          "appointment_for" : "Doctor",
          "photo" : doctor_appointmentlist[b].doc_business_info[0].thumbnail_image || '',
          "clinic_name" :  doctor_appointmentlist[b].doc_business_info[0].clinic_name,
          "name" : doctor_appointmentlist[b].family_id.name,
          "appointment_type" : doctor_appointmentlist[b].appointment_types,
          "communication_type" : doctor_appointmentlist[b].communication_type,
          "cost" : doctor_appointmentlist[b].amount,
          "appointment_time" : doctor_appointmentlist[b].booking_date_time,
          "start_appointment_status" : doctor_appointmentlist[b].start_appointment_status,
          "createdAt" :  doctor_appointmentlist[b].createdAt,
          "updatedAt" :  doctor_appointmentlist[b].updatedAt,
          "relation_type" : doctor_appointmentlist[b].family_id.relation_type,
          "type" : "" ,
          "doctor_name" : doctor_appointmentlist[b].doctor_id.first_name+" "+doctor_appointmentlist[b].doctor_id.last_name,
          "service_provider_name" :"",
          "appoint_patient_st" : doctor_appointmentlist[b].appoint_patient_st || "",
          "Service_name" : "",
          "service_cost" : "",
          "Booked_at" : doctor_appointmentlist[b].booking_date_time,
          "missed_at" : doctor_appointmentlist[b].missed_at || "",
          "completed_at" : doctor_appointmentlist[b].completed_at || "",
          "user_rate" : +parseFloat(doctor_appointmentlist[b].user_rate).toFixed(0) || 0,
          "user_feedback" : doctor_appointmentlist[b].user_feedback|| "",   
          "status" : doctor_appointmentlist[b].appoinment_status,
          "user_id" : doctor_appointmentlist[b].user_id._id || "",
          "doctor_id": doctor_appointmentlist[b].doctor_id._id || "",
          "location_id": doctor_appointmentlist[b].location_id || "",
          "visit_type": doctor_appointmentlist[b].visit_type || "",     
          "sp_id" : "",
        }
        final_appointment_list.push(fin);
        if(b == doctor_appointmentlist.length - 1){
          final_appointment_list.sort(function compare(a, b) {

               var dateA = new Date(a.updatedAt);
               var dateB = new Date(b.updatedAt);
               return dateB - dateA;
               });

           res.json({Status:"Success",Message:"Completed Appointment List", Data : final_appointment_list ,Code:200});
        }
  }
  }
  }        
});






router.post('/mobile/plove_getlist/missapp1',async function (req, res) {
 var sp_appointmentlist =  await SP_appointmentsModels.find({user_id:req.body.user_id,appoinment_status:"Missed"}).populate('user_id sp_id family_id');
 var doctor_appointmentlist =  await AppointmentsModel.find({user_id:req.body.user_id,appoinment_status:"Missed"}).populate('user_id doctor_id family_id');
  var final_appointment_list = [];
  if(doctor_appointmentlist.length == 0 && sp_appointmentlist.length == 0){
         res.json({Status:"Success",Message:"Missed Appointment List", Data : final_appointment_list ,Code:200});
  } else {
  if(sp_appointmentlist.length !== 0){
   for(let a = 0 ; a < sp_appointmentlist.length ; a ++){
         let fin = {
          "_id" : sp_appointmentlist[a]._id,
          "Booking_Id":sp_appointmentlist[a].appointment_UID,
          "appointment_for" : "SP",
          "photo" : sp_appointmentlist[a].sp_business_info[0].thumbnail_image || '',
          "clinic_name" :   "",
          "name" :  sp_appointmentlist[a].family_id.name,
          "appointment_type" : "",
          "cost" : sp_appointmentlist[a].service_amount,
          "appointment_time" : sp_appointmentlist[a].booking_date_time,
          "createdAt" :  sp_appointmentlist[a].createdAt,
          "updatedAt" :  sp_appointmentlist[a].updatedAt,
          "relation_type" : sp_appointmentlist[a].family_id.relation_type,
          "type" : "" ,
          "service_provider_name" : sp_appointmentlist[a].sp_business_info[0].bussiness_name,
          "Service_name" :  sp_appointmentlist[a].service_name,
          "service_cost" : sp_appointmentlist[a].service_amount,
          "Booked_at" : sp_appointmentlist[a].booking_date_time,
          "missed_at" : sp_appointmentlist[a].missed_at|| "",
          "completed_at" : sp_appointmentlist[a].completed_at|| "",
          "user_rate" : +parseFloat(sp_appointmentlist[a].user_rate).toFixed(0) || 0,
          "user_feedback" : sp_appointmentlist[a].user_feedback|| "",   
          "status" : sp_appointmentlist[a].appoinment_status,
          "appoint_patient_st": "",
          "communication_type": "",
          "doctor_name": "",
          "start_appointment_status": "",
          "user_id" : sp_appointmentlist[a].user_id._id,
          "sp_id" : sp_appointmentlist[a].sp_id._id,
          "doctor_id": "",
        }
        final_appointment_list.push(fin);
    if(a == sp_appointmentlist.length - 1){

         if(doctor_appointmentlist.length == 0){
          
          res.json({Status:"Success",Message:"Missed Appointment List", Data : final_appointment_list ,Code:200});

         } else {

          for(let b = 0 ; b < doctor_appointmentlist.length ; b ++){
            let fin = {
          "_id" : doctor_appointmentlist[b]._id,
          "Booking_Id":doctor_appointmentlist[b].appointment_UID,
          "appointment_for" : "Doctor",
          "doctor_name" : doctor_appointmentlist[b].doctor_id.first_name+" "+doctor_appointmentlist[b].doctor_id.last_name,
          "photo" : doctor_appointmentlist[b].doc_business_info[0].thumbnail_image || '',
          "clinic_name" :  doctor_appointmentlist[b].doc_business_info[0].clinic_name,
          "name" : doctor_appointmentlist[b].family_id.name,
          "appointment_type" : doctor_appointmentlist[b].appointment_types,
          "communication_type" : doctor_appointmentlist[b].communication_type,
          "cost" : doctor_appointmentlist[b].amount,
          "appointment_time" : doctor_appointmentlist[b].booking_date_time,
          "createdAt" :  doctor_appointmentlist[b].createdAt,
          "updatedAt" :  doctor_appointmentlist[b].updatedAt,
          "relation_type" : doctor_appointmentlist[b].family_id.relation_type,
          "start_appointment_status" : doctor_appointmentlist[b].start_appointment_status,
          "appoint_patient_st" : doctor_appointmentlist[b].appoint_patient_st || "",
          "type" : "" ,
          "service_provider_name" :"",
          "Service_name" : "",
          "service_cost" : "",
          "Booked_at" : doctor_appointmentlist[b].booking_date_time,
          "missed_at" : doctor_appointmentlist[b].missed_at || "",
          "completed_at" : doctor_appointmentlist[b].completed_at || "",
          "user_rate" : +parseFloat(doctor_appointmentlist[b].user_rate).toFixed(0) || 0,
          "user_feedback" : doctor_appointmentlist[b].user_feedback|| "",   
          "status" : doctor_appointmentlist[b].appoinment_status,
          "user_id" : doctor_appointmentlist[b].user_id._id || "",
          "doctor_id": doctor_appointmentlist[b].doctor_id._id || "",
          "location_id": doctor_appointmentlist[b].location_id || "",
          "visit_type": doctor_appointmentlist[b].visit_type || "",     
          "sp_id" : "",
        }
        final_appointment_list.push(fin);
        if(b == doctor_appointmentlist.length - 1){
          final_appointment_list.sort(function compare(a, b) {
               var dateA = new Date(a.updatedAt);
               var dateB = new Date(b.updatedAt);
               return dateB - dateA;
          });
        res.json({Status:"Success",Message:"Missed Appointment List", Data : final_appointment_list ,Code:200});
        }
       }

         }

    }
  }
  } else
  {
  for(let b = 0 ; b < doctor_appointmentlist.length ; b ++){
        let fin = {
          "_id" : doctor_appointmentlist[b]._id,
          "Booking_Id":doctor_appointmentlist[b].appointment_UID,
          "appointment_for" : "Doctor",
          "doctor_name" : doctor_appointmentlist[b].doctor_id.first_name+" "+doctor_appointmentlist[b].doctor_id.last_name,
          "photo" : doctor_appointmentlist[b].doc_business_info[0].thumbnail_image || '',
          "clinic_name" :  doctor_appointmentlist[b].doc_business_info[0].clinic_name,
          "name" : doctor_appointmentlist[b].family_id.name,
          "appointment_type" : doctor_appointmentlist[b].appointment_types,
           "communication_type" : doctor_appointmentlist[b].communication_type,
          "cost" : doctor_appointmentlist[b].amount,
          "appointment_time" : doctor_appointmentlist[b].booking_date_time,
          "createdAt" :  doctor_appointmentlist[b].createdAt,
          "updatedAt" :  doctor_appointmentlist[b].updatedAt,
          "relation_type" : doctor_appointmentlist[b].family_id.relation_type,
          "start_appointment_status" : doctor_appointmentlist[b].start_appointment_status || "",
          "appoint_patient_st" : doctor_appointmentlist[b].appoint_patient_st || "",
          "type" : "" ,
          "service_provider_name" :"",
          "Service_name" : "",
          "service_cost" : "",
          "Booked_at" : doctor_appointmentlist[b].booking_date_time,
          "missed_at" : doctor_appointmentlist[b].missed_at || "",
          "completed_at" : doctor_appointmentlist[b].completed_at || "",
          "user_rate" : +parseFloat(doctor_appointmentlist[b].user_rate).toFixed(0) || 0,
          "user_feedback" : doctor_appointmentlist[b].user_feedback|| "",   
          "status" : doctor_appointmentlist[b].appoinment_status ,
           "user_id" : doctor_appointmentlist[b].user_id._id || "",
          "doctor_id": doctor_appointmentlist[b].doctor_id._id || "",
          "location_id": doctor_appointmentlist[b].location_id || "",
          "visit_type": doctor_appointmentlist[b].visit_type || "",     
          "sp_id" : "",
        }
        final_appointment_list.push(fin);
        if(b == doctor_appointmentlist.length - 1)
        {
          final_appointment_list.sort(function compare(a, b) {
               var dateA = new Date(a.updatedAt);
               var dateB = new Date(b.updatedAt);
               return dateB - dateA;
               });
           res.json({Status:"Success",Message:"Missed Appointment List", Data : final_appointment_list ,Code:200});
        }
  }
  }
  }        
});




router.post('/mobile/noshownotification', function (req, res) {
        AppointmentsModel.find({display_date:req.body.display_date,appoinment_status : "Incomplete"}, function (err, doctor_appointmentlist) {
          if(doctor_appointmentlist.length == 0){
           res.json({Status:"Success",Message:"No Show Notification Send", Data : {} ,Code:200});   
        }
        for(let b = 0 ; b < doctor_appointmentlist.length ; b ++){
          // var oldDateObj = new Date(doctor_appointmentlist[b].display_date);
          //  console.log(oldDateObj);
          //  var s = new Date(doctor_appointmentlist[b].display_date);
          //  console.log(s)
          //  s.setMinutes(s.getMinutes()+45);
          //  var curr = new Date(req.body.current_time);
          //  console.log("30 mins",s);
          //  console.log("current_Date",curr);
          //  if(s > curr){
          //  }else {
               var params = {
              "status":"No show",
              "date" : doctor_appointmentlist[b].booking_date_time,
              "appointment_UID" : doctor_appointmentlist[b].appointment_UID,
              "user_id" : doctor_appointmentlist[b].doctor_id._id,
              "doctor_id" : doctor_appointmentlist[b].user_id._id
              }
            request.post(
                'http://35.165.75.97:3000/api/notification/mobile/alert/notification',
                { json: params },
                function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                    }
                }
            );
             let c = {
                missed_at : doctor_appointmentlist[b].booking_date_time,
                appoinment_status : "Missed",
                appoint_patient_st : "Doctor missed appointment"
              }
             AppointmentsModel.findByIdAndUpdate(doctor_appointmentlist[b]._id, c, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500}); 
            });
           // }

           if(b == doctor_appointmentlist.length - 1){
            res.json({Status:"Success",Message:"No Show Notification Send", Data : {} ,Code:200});   
           }

         }
         // res.json({Status:"Success",Message:"New Appointment List", Data : StateList ,Code:200});         
        }).populate('user_id doctor_id family_id');
});



router.post('/mobile/remaindernotification', function (req, res) {
        AppointmentsModel.find({display_date:req.body.display_date,appoinment_status : "Incomplete"}, function (err, doctor_appointmentlist) {

        if(doctor_appointmentlist.length == 0){
           res.json({Status:"Success",Message:"No Remainder Notification Send", Data : {} ,Code:200});   
        }
        for(let b = 0 ; b < doctor_appointmentlist.length ; b ++){
          // var oldDateObj = new Date(doctor_appointmentlist[b].display_date);
          //  console.log(oldDateObj);
          //  var s = new Date(doctor_appointmentlist[b].display_date);
          //  console.log(s)
          //  s.setMinutes(s.getMinutes()+45);
          //  var curr = new Date(req.body.current_time);
          //  console.log("30 mins",s);
          //  console.log("current_Date",curr);
          //  if(s > curr){
           // }else {
               var params = {
              "status":"Appointment Remainder",
              "date" : doctor_appointmentlist[b].booking_date_time,
              "appointment_UID" : doctor_appointmentlist[b].appointment_UID,
              "user_id" : doctor_appointmentlist[b].doctor_id._id,
              "doctor_id" : doctor_appointmentlist[b].user_id._id
              }
            request.post(
                'http://35.165.75.97:3000/api/notification/mobile/alert/notification',
                { json: params },
                function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                    }
                }
            );
           // }


           if(b == doctor_appointmentlist.length - 1){
            res.json({Status:"Success",Message:"Remainder Notification Send", Data : {} ,Code:200});   
           }
         }
         // res.json({Status:"Success",Message:"New Appointment List", Data : StateList ,Code:200});         
        }).populate('user_id doctor_id family_id');
});








router.post('/mobile/fetch_appointment_id', function (req, res) {
        console.log(req.body);
        AppointmentsModel.findOne({_id:req.body.apppointment_id},async function (err, StateList) {
        console.log(StateList);
         if(StateList.visit_type == "Home"){
           let location_details  =  await locationdetailsModel.findOne({_id:StateList.location_id});
          res.json({Status:"Success",Message:"Appointment details", Data : StateList , Address:location_details,Code:200});   
         }else{
          res.json({Status:"Success",Message:"Appointment details", Data : StateList , Address : {},Code:200});   
         }
        }).populate('user_id doctor_id family_id');
});


router.post('/mobile/doc_getlist/newapp', function (req, res) {
        AppointmentsModel.find({doctor_id:req.body.doctor_id,appoinment_status:"Incomplete"}, function (err, StateList) {
           StateList.sort(function compare(a, b) {
               var dateA = new Date(a.updatedAt);
               var dateB = new Date(b.updatedAt);
               return dateB - dateA;
               });

           if(StateList.length == 0){
                res.json({Status:"Success",Message:"New Appointment List", Data : [] ,Code:200});
           }else{
             var sort_data = [];
          for(let a = 0 ; a < StateList.length ; a ++){
            if(StateList[a].appointment_types == 'Emergency'){
              sort_data.push(StateList[a]);
            }
           if(a == StateList.length - 1){
             for(let b = 0 ; b < StateList.length ; b ++){
              if(StateList[b].appointment_types !== 'Emergency'){
              sort_data.push(StateList[b]);
                }
                if(b == StateList.length - 1){
                res.json({Status:"Success",Message:"New Appointment List", Data : sort_data ,Code:200});
                }
             }
           }
          } 
           }
        }).populate('user_id doctor_id family_id');
});


router.post('/filter_date', function (req, res) {
        AppointmentsModel.find({}, function (err, StateList) {
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
        }).populate('user_id doctor_id family_id');
});



router.get('/listing_cancelled', function (req, res) {
        AppointmentsModel.find({appoinment_status:"Missed"}, function (err, StateList) {
          var final_Date = [];
          for(let a  = 0 ; a < StateList.length ; a ++){
               let c = {
                "appointment_id" : StateList[a]._id,
                "appointment_key" : StateList[a].appointment_UID,
                "appointment_type" :StateList[a].appointment_types,
                "appointment_date" :StateList[a].booking_date_time,
                "appointment_price" : StateList[a].amount,
                "doctor_name" : StateList[a].doctor_id.first_name,
                "doctor_id" : StateList[a].doctor_id._id,
                "_id": StateList[a].user_id._id,
                "first_name": StateList[a].user_id.first_name,
                "last_name": StateList[a].user_id.last_name,
                "user_email": StateList[a].user_id.user_email,
                "user_phone": StateList[a].user_id.user_phone,
                "profile_img": StateList[a].user_id.profile_img,
                "mobile_type": StateList[a].user_id.mobile_type,
               }
               final_Date.push(c);
               if(a == StateList.length - 1){
                 res.json({Status:"Success",Message:"Missed Appointment List", Data : final_Date ,Code:200});
               }
          }
          if(StateList.length == 0){
             res.json({Status:"Success",Message:"Missed Appointment List", Data : [] ,Code:200});
          }
        }).populate('user_id doctor_id family_id');
});





router.get('/listing_cancelled', function (req, res) {
        AppointmentsModel.find({appoinment_status:"Missed"}, function (err, StateList) {
          var final_Date = [];
          for(let a  = 0 ; a < StateList.length ; a ++){
               let c = {
                "_id": StateList[a].user_id._id,
                "first_name": StateList[a].user_id.first_name,
                "last_name": StateList[a].user_id.last_name,
                "user_email": StateList[a].user_id.user_email,
                "user_phone": StateList[a].user_id.user_phone,
                "profile_img": StateList[a].user_id.profile_img,
                "mobile_type": StateList[a].user_id.mobile_type,
               }
               final_Date.push(c);
               if(a == StateList.length - 1){
                 res.json({Status:"Success",Message:"Missed Appointment List", Data : final_Date ,Code:200});
               }
          }
        }).populate('user_id doctor_id family_id');
});



router.post('/mobile/doc_getlist/comapp', function (req, res) {
        AppointmentsModel.find({doctor_id:req.body.doctor_id,appoinment_status:"Completed"}, function (err, StateList) {
           StateList.sort(function compare(a, b) {
               var dateA = new Date(a.updatedAt);
               var dateB = new Date(b.updatedAt);
               return dateB - dateA;
               });
          res.json({Status:"Success",Message:"Completed Appointment List", Data : StateList ,Code:200});
        }).populate('user_id doctor_id family_id');
});



router.post('/mobile/doc_getlist/missapp', function (req, res) {
        AppointmentsModel.find({doctor_id:req.body.doctor_id,appoinment_status:"Missed"}, function (err, StateList) {
           StateList.sort(function compare(a, b) {
               var dateA = new Date(a.updatedAt);
               var dateB = new Date(b.updatedAt);
               return dateB - dateA;
               });
          res.json({Status:"Success",Message:"Missed Appointment List", Data : StateList ,Code:200});
        }).populate('user_id doctor_id family_id');
});


router.post('/startappointment',async function (req, res) {
        AppointmentsModel.find({_id:req.body._id,appoinment_status:"Incomplete"}, function (err, StateList) {
           StateList.sort(function compare(a, b) {
               var dateA = new Date(a.updatedAt);
               var dateB = new Date(b.updatedAt);
               return dateB - dateA;
               });
          res.json({Status:"Success",Message:"New Appointment List", Data : StateList ,Code:200});
        }).populate('user_id doctor_id family_id');
});




router.post('/mobile/plove_getlist/newapp',async function (req, res) {
        AppointmentsModel.find({user_id:req.body.user_id,appoinment_status:"Incomplete"}, function (err, StateList) {
           StateList.sort(function compare(a, b) {
               var dateA = new Date(a.updatedAt);
               var dateB = new Date(b.updatedAt);
               return dateB - dateA;
               });
          res.json({Status:"Success",Message:"New Appointment List", Data : StateList ,Code:200});
        }).populate('user_id doctor_id family_id');
});


router.post('/mobile/plove_getlist/comapp', function (req, res) {
        AppointmentsModel.find({user_id:req.body.user_id,appoinment_status:"Completed"}, function (err, StateList) {
           StateList.sort(function compare(a, b) {

               var dateA = new Date(a.updatedAt);
               var dateB = new Date(b.updatedAt);
               return dateB - dateA;
               });
          res.json({Status:"Success",Message:"Completed Appointment List", Data : StateList ,Code:200});
        }).populate('user_id doctor_id family_id');
});



router.post('/mobile/plove_getlist/missapp', function (req, res) {
        AppointmentsModel.find({user_id:req.body.user_id,appoinment_status:"Missed"}, function (err, StateList) {
           StateList.sort(function compare(a, b) {
               var dateA = new Date(a.updatedAt);
               var dateB = new Date(b.updatedAt);
               return dateB - dateA;
               });
          res.json({Status:"Success",Message:"Missed Appointment List", Data : StateList ,Code:200});
        }).populate('user_id doctor_id family_id');
});



router.post('/get_doc_new',async function (req, res) {
   var date_details = await New_Doctor_time.findOne({user_id:req.body.user_id});
   var Holiday_details = await HolidayModel.find({user_id:req.body.user_id});
   var doctor_details = await LiveDoctor.findOne({user_id:req.body.user_id});
  let reqdate = req.body.Date.split("-");
  let repdate = reqdate[2]+"-"+reqdate[1]+"-"+reqdate[0];
  var d = new Date(repdate);
   let weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
   let dayss = weekday[d.getDay()];
   for(let a = 0 ; a < date_details.Doctor_date_time.length ; a ++){
     if(dayss == date_details.Doctor_date_time[a].Title){
               if(date_details.Doctor_date_time[a].Status == false){
                res.json({Status:"Failed",Message:"Doctor is not available on this day", Data : [] ,Code:404});
               }else{
                   let times = date_details.Doctor_time[a].Time;
                   let finaltime = [];
                   for(let c = 0 ; c < times.length ; c ++){
                    if(times[c].Status == true){
                      let d = {
                        time : times[c].Time
                      }
                      finaltime.push(d);
                    }
                    if(c == times.length-1){
                      let ad = [];
                      let Comm_type_chat = 'No';
                      let Comm_type_video = 'No';
                      let Doctor_ava_Date = req.body.Date;
                      let Doctor_name = doctor_details.Name;
                      let Doctor_email_id =  doctor_details.Email;
                      if(doctor_details.call_type == 'Chat'){
                            Comm_type_chat = 'Yes';
                      }else if(doctor_details.call_type == 'Video'){
                             Comm_type_video = 'Yes';
                      }else if(doctor_details.call_type == 'Chat & Video'){
                             Comm_type_video = 'Yes';
                             Comm_type_chat = 'Yes';
                      }

                      if(req.body.Date == req.body.cur_date){
                        let datas = [];
                        let check = 1;
                        for(let a  = 0 ; a < finaltime.length ; a ++)
                        {
                          // console.log(finaltime[a].time)
                          let cur_time = finaltime[a].time.split(":");
                          let cur_time1 = req.body.cur_time.split(":");
                          let cur_time2 = finaltime[a].time.split(" ");
                          let cur_time3 = req.body.cur_time.split(" ");
                          if(cur_time2[1] == cur_time3[1]){
                          if(+cur_time[0] >= +cur_time1[0]){
                            check = 0;
                           }
                           }
                          if(check == 0){
                            let d = {
                            time : finaltime[a].time
                            }
                            datas.push(d);
                          }
                          if(a == finaltime.length - 1){
                            finaltime = [];
                                     let cur_time3 = req.body.cur_time.split(" ");
                                     let cur_time1 = cur_time3[0].split(":");
                                     let cur_time2 = datas[0].time.split(" ");
                                     let cur_time4 = cur_time2[0].split(":");
                                     if(+cur_time1[1] > 0 &&  cur_time1[0] == cur_time4[0]){
                                         datas.splice(0, 1);
                                     }
                            finaltime = datas;
                          }
                        }
                      }
                      let dd = {
                        Comm_type_chat : Comm_type_chat,
                        Comm_type_video : Comm_type_video,
                        Doctor_email_id : Doctor_email_id,
                        Doctor_ava_Date : Doctor_ava_Date,
                        Doctor_name : Doctor_name,
                        Times : finaltime    
                      }
                      ad.push(dd);
                       let checkss = 0
                     
                       if(Holiday_details.length == 0){
                             if(ad[0].Times.length == 0){
                                              res.json({Status:"Failed",Message:"Doctor is not available on this day", Data : [] ,Code:404});

                                       }else{
                                              res.json({Status:"Success",Message:"Doctor Available", Data : ad,Code:200});

                                       }
                       }else{
                       for(let t = 0 ; t < Holiday_details.length ; t++){
                           if(req.body.Date == Holiday_details[t].Date){
                            checkss = 1
                           }
                           if(t == Holiday_details.length - 1){
                                 if(checkss == 0){
                                       if(ad[0].Times.length == 0){
                                              res.json({Status:"Failed",Message:"Doctor is not available on this day", Data : [] ,Code:404});

                                       }else{
                                              res.json({Status:"Success",Message:"Doctor Available", Data : ad,Code:200});

                                       }

                                                       }else{
                                                                   res.json({Status:"Failed",Message:"Doctor is not available on this day", Data : [] ,Code:404});
                                                       }
                           }
                       }
                     }
                    }
                   }
               }
     }
   
   }
});



router.post('/check', async function(req, res) {
  try{
    await AppointmentsModel.findOne({doctor_id:req.body.doctor_id,booking_date:req.body.Booking_Date,booking_time:req.body.Booking_Time,appoinment_status : "Incomplete"}, function (err, Appointmentdetails) {
          if(Appointmentdetails!== null){
            res.json({Status:"Failed",Message:"Slot not available",Data : {} ,Code:300});
          }
          else{
            res.json({Status:"Success",Message:"Available",Data : {} ,Code:200});
          }
          
        });
}
catch(e){
      res.error(500, "Internal server error");
}
});



router.get('/gettotalprice', async function(req, res) {
  var Appointment_details = await AppointmentsModel.find({});
  var total_price = 0;
  if(Appointment_details.length == 0){
   res.json({Status:"Success",Message:"Appointment Calculations", Data : total_price ,Code:200});     
  }
  else{
  for(let a = 0; a < Appointment_details.length ; a ++){
     total_price =  +total_price + +Appointment_details[a].amount;
     if(a == Appointment_details.length - 1){
       res.json({Status:"Success",Message:"Appointment Calculations", Data : total_price ,Code:200});   
     }
  }
  }
});



router.get('/deletes', function (req, res) {
      AppointmentsModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"Appointment Deleted", Data : {} ,Code:200});     
      });
});


router.post('/getlist_id', function (req, res) {
        AppointmentsModel.findOne({_id:req.body.Appointment_id}, function (err, StateList) {
          res.json({Status:"Success",Message:"Appointment Details", Data : StateList ,Code:200});
        }).populate('user_id doctor_id family_id');
});



router.post('/getlist_doctor_id', function (req, res) {
        AppointmentsModel.find({doctor_id:req.body.doctor_id}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Appointment Details", Data : Functiondetails ,Code:200});
        }).populate('user_id doctor_id family_id');
});


router.post('/reshedule_list_getlist_doctor_id', function (req, res) {
        AppointmentsModel.find({doctor_id:req.body.doctor_id,reshedule_status:"Yes"}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Appointment Details", Data : Functiondetails ,Code:200});
        }).populate('user_id doctor_id family_id');
});


router.get('/getlist', function (req, res) {
        AppointmentsModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Appointment Details", Data : Functiondetails ,Code:200});
        }).populate('user_id doctor_id family_id');
});


router.get('/mobile/getlist', function (req, res) {
        AppointmentsModel.find({}, function (err, Functiondetails) {
          let a = {
            usertypedata : Functiondetails
          }
          res.json({Status:"Success",Message:"Appointment Details", Data : a ,Code:200});
        });
});




router.post('/doctor_payment', function (req, res) {
        AppointmentsModel.find({doctor_id:req.body.doctor_id}, function (err, Functiondetails) {
         if(Functiondetails.length == 0){
          res.json({Status:"Success",Message:"No appointment found", Data : [] ,Code:200});
        } else
        {
          let final_data = [];
              for(let a  = 0 ; a < Functiondetails.length ; a ++ ){
                     let c = {
            "_id": Functiondetails[a]._id,
            "doctor_id": Functiondetails[a].doctor_id,
            "appointment_UID":Functiondetails[a].appointment_UID,
            "booking_date_time": Functiondetails[a].booking_date_time,
            "appoinment_status": Functiondetails[a].appoinment_status,
            "communication_type": Functiondetails[a].communication_type,
            "display_date":Functiondetails[a].display_date,
            "payment_id": Functiondetails[a].payment_id,
            "amount": Functiondetails[a].amount,
            "mobile_type": Functiondetails[a].mobile_type,
            "reshedule_status": Functiondetails[a].reshedule_status,
                     }
                     final_data.push(c);
                     if(a == Functiondetails.length - 1){
                      res.json({Status:"Success",Message:"Appointment details", Data : final_data ,Code:200});
                     }
              }
        }
          // res.json({Status:"Success",Message:"Appointment Details", Data : Functiondetails ,Code:200});
        });
});


router.post('/admin_doctor_payment', function (req, res) {
        AppointmentsModel.find({doctor_id:req.body.doctor_id,"appoinment_status": "Completed"}, function (err, Functiondetails) {
         if(Functiondetails.length == 0){
          res.json({Status:"Success",Message:"No appointment found", Data : [] ,Code:200});
        } else
        {
          res.json({Status:"Success",Message:"Appointment Details", Data : Functiondetails ,Code:200});
        }
          // res.json({Status:"Success",Message:"Appointment Details", Data : Functiondetails ,Code:200});
        }).populate('user_id family_id');
});



router.post('/admin_doctor_payment1', function (req, res) {
        walkinappointmentsModel.find({doctor_id:req.body.doctor_id,"appoinment_status": "Completed"}, function (err, Functiondetails) {
         if(Functiondetails.length == 0){
          res.json({Status:"Success",Message:"No appointment found", Data : [] ,Code:200});
        } else
        {
          res.json({Status:"Success",Message:"Appointment Details", Data : Functiondetails ,Code:200});
        }
          // res.json({Status:"Success",Message:"Appointment Details", Data : Functiondetails ,Code:200});
        }).populate('user_id family_id');
});



router.post('/doctor/petlover_payment', function (req, res) {
        AppointmentsModel.find({user_id:req.body.user_id}, function (err, Functiondetails) {
         if(Functiondetails.length == 0){
          res.json({Status:"Success",Message:"No appointment found", Data : [] ,Code:200});
        } else
        {
          let final_data = [];
              for(let a  = 0 ; a < Functiondetails.length ; a ++ ){
                     let c = {
            "_id": Functiondetails[a]._id,
            "doctor_id": Functiondetails[a].doctor_id,
            "appointment_UID":Functiondetails[a].appointment_UID,
            "booking_date_time": Functiondetails[a].booking_date_time,
            "appoinment_status": Functiondetails[a].appoinment_status,
            "communication_type": Functiondetails[a].communication_type,
            "display_date":Functiondetails[a].display_date,
            "payment_id": Functiondetails[a].payment_id,
            "amount": Functiondetails[a].amount,
            "mobile_type": Functiondetails[a].mobile_type,
            "reshedule_status": Functiondetails[a].reshedule_status,
                     }
                     final_data.push(c);
                     if(a == Functiondetails.length - 1){
                      res.json({Status:"Success",Message:"Appointment Details", Data : final_data ,Code:200});
                     }
              }
        }
          // res.json({Status:"Success",Message:"Appointment Details", Data : Functiondetails ,Code:200});
        });
});



router.post('/reshedule_list', function (req, res) {
        AppointmentsModel.find({doctor_id:req.body.doctor_id,reshedule_status:"Yes"}, function (err, Functiondetails) {
         if(Functiondetails.length == 0){
          res.json({Status:"Success",Message:"Appointment Details", Data : [] ,Code:200});
        } else
        {
          let final_data = [];
              for(let b  = 0 ; b < Functiondetails.length ; b ++ ){
      let c = {
          "_id" : Functiondetails[b]._id,
          "Booking_Id": Functiondetails[b].appointment_UID,
          "video_id" :  Functiondetails[b].video_id,
          "appointment_for" : "Doctor",
          "photo" : Functiondetails[b].doc_business_info[0].thumbnail_image || '',
          "clinic_name" :  Functiondetails[b].doc_business_info[0].clinic_name,
          "name" : Functiondetails[b].family_id.name,
          "appointment_type" : Functiondetails[b].appointment_types,
          "communication_type" : Functiondetails[b].communication_type,
          "cost" : Functiondetails[b].amount,
           "start_appointment_status" : Functiondetails[b].start_appointment_status,
          "appointment_time" : Functiondetails[b].booking_date_time,
          "createdAt" :  Functiondetails[b].createdAt,
          "updatedAt" :  Functiondetails[b].updatedAt,
          "relation_type" : Functiondetails[b].family_id.relation_type,
          "type" : "" ,
          "service_provider_name" :"",
          "Service_name" : "",
          "service_cost" : "",
          "doctor_name" : Functiondetails[b].doctor_id.first_name+" "+Functiondetails[b].doctor_id.last_name,
          "Booked_at" : Functiondetails[b].booking_date_time,
          "appoint_patient_st" : Functiondetails[b].appoint_patient_st || "",
          "missed_at" : Functiondetails[b].missed_at || "",
          "completed_at" : Functiondetails[b].completed_at || "",
          "user_rate" : +parseFloat(Functiondetails[b].user_rate).toFixed(0) || 0,
          "user_feedback" : Functiondetails[b].user_feedback|| "",   
          "status" : Functiondetails[b].appoinment_status,
          "user_id" : Functiondetails[b].user_id._id || "",
          "doctor_id": Functiondetails[b].doctor_id._id || "",
          "visit_type" : Functiondetails[b].visit_type || "",
          "sp_id" : "",
        }
                     final_data.push(c);
                     if(b == Functiondetails.length - 1){
                      res.json({Status:"Success",Message:"Resudule Appointment Details", Data : final_data ,Code:200});
                     }
              }
        }
          // res.json({Status:"Success",Message:"Appointment Details", Data : Functiondetails ,Code:200});
        }).populate('user_id doctor_id family_id');
});






router.post('/mobile/doctor/app_edit',async function (req, res) {
     if(req.body.amount == ""){
       var sp_appointmentlist =  await AppointmentsModel.findOne({_id:req.body._id});
       res.json({Status:"Success",Message:"Appointment Updated", Data : sp_appointmentlist ,Code:200});
     }else {
        AppointmentsModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Appointment Updated", Data : UpdatedDetails ,Code:200});
        });
     }
});


router.post('/mobile/user/edit', function (req, res) {
        AppointmentsModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error, Try later", Data : {},Code:500});
             res.json({Status:"Success",Message:"Appointment Updated", Data : UpdatedDetails ,Code:200});
        });
});



router.post('/reviews/update',async function (req, res) {
        var Appointment_details = await AppointmentsModel.findOne({_id:req.body._id});
        var doctor_details = await doctordetailsModel.findOne({user_id:Appointment_details.doctor_id});
        await reviewdetailsModel.create({
            doctor_id:  Appointment_details.doctor_id,
            user_id : Appointment_details.user_id,
            rating : req.body.user_rate,
            reviews : req.body.user_feedback
        },async function (err, user) {
        var test_rat_count = 0; 
        var review_details = await reviewdetailsModel.find({doctor_id:Appointment_details.doctor_id});
        for(let a = 0 ; a < review_details.length ; a++){
            test_rat_count = +review_details[a].rating + test_rat_count;
         }
         var final_rat_count = test_rat_count / review_details.length;
        let c = {
        comments : review_details.length,
        rating : final_rat_count
        } 
        doctordetailsModel.findByIdAndUpdate(doctor_details._id, c, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             // res.json({Status:"Success",Message:"Docotor Details Updated", Data : UpdatedDetails ,Code:200});
        });
        AppointmentsModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
             if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Feedback updated successfully", Data : UpdatedDetails ,Code:200});
        });

        });    
});





router.post('/reshedule_appointment',async function (req, res) {
  let a = {
    pervious_app_date : req.body.already_booked_date,
    reshedule_status : "Yes",
    booking_date_time : req.body.reschedule_date,
    booking_date: req.body.booking_date,
    booking_time: req.body.booking_time,
  }
AppointmentsModel.findByIdAndUpdate(req.body._id, a, {new: true}, function (err, UpdatedDetails) {
  if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
  res.json({Status:"Success",Message:"Appointment reshedule successfully", Data : UpdatedDetails ,Code:200});
});
});




router.post('/update/doctorcomment', function (req, res) {
  AppointmentsModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Doctor Comment Update successfully", Data : {} ,Code:200});
  });
});





router.post('/medical_history',async function (req, res) {
 AppointmentsModel.find({user_id:req.body.user_id,family_id:req.body.family_id}, function (err, Functiondetails) {
  if(Functiondetails.length == 0){
    res.json({Status:"Success",Message:"No medical history", Data : [] ,Code:200});
  } else {
     let final_Data = [];
     for(let a  = 0 ; a < Functiondetails.length ; a++){
      let c = {
         vet_image : Functiondetails[a].doctor_id.profile_img,
         vet_name : Functiondetails[a].doctor_id.first_name+ " " +Functiondetails[a].doctor_id.last_name,
         vet_spec : Functiondetails[a].doc_business_info[0].specialization,
         name : Functiondetails[a].family_id.name,
         family_id : Functiondetails[a].family_id._id,
         appointement_id : Functiondetails[a]._id,
         appointment_date : Functiondetails[a].booking_date_time,
         allergies : Functiondetails[a].allergies,
         vacination : Functiondetails[a].family_id.vaccinated,
         communication_type : Functiondetails[a].communication_type,
         prescrip_type : "PDF",
      }
      final_Data.push(c);
      if(a == Functiondetails.length - 1){
         res.json({Status:"Success",Message:"Medical history Details", Data : final_Data,Code:200});
      }
     }
  }
    }).populate('doctor_id family_id');
});








router.post('/edit',async function (req, res) {
if(req.body.appoinment_status == "Completed"){
var appoint_details = await AppointmentsModel.findOne({_id:req.body._id});
let d = {"appointment_UID":appoint_details.appointment_UID,"date":req.body.completed_at,"doctor_id":appoint_details.doctor_id,"status":"Appointment Completed","user_id":appoint_details.user_id}
request.post(
    'http://35.165.75.97:3000/api/notification/mobile/alert/notification',
    { json: d },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
        }
    }
);
} 
if(req.body.appoinment_status == "Missed"){
var appoint_details = await AppointmentsModel.findOne({_id:req.body._id});
let d = {"appointment_UID":appoint_details.appointment_UID,"date":req.body.missed_at,"doctor_id":appoint_details.doctor_id,"status":"Patient Not Available","user_id":appoint_details.user_id}
request.post(
    'http://35.165.75.97:3000/api/notification/mobile/alert/notification',
    { json: d },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
        }
    }
);
} 
if(req.body.start_appointment_status  == "In-Progress"){
var appoint_details = await AppointmentsModel.findOne({_id:req.body._id}).populate('user_id doctor_id family_id');
var params = {

            "user_id":  appoint_details.user_id._id,
            "notify_title" : "Doctor is waiting for you!!",
            "notify_descri" : "Doctor has started the Appointment and waiting for you on video call.",
            "notify_img" : "",
            "notify_time" : "",
            "date_and_time" : appoint_details.booking_date_time,
            "user_token" : appoint_details.user_id.fb_token,
            "data_type" : {
            "usertype":"1",
            "appintments":"New",
            "orders":""
             }
}
request.post(
    'http://35.165.75.97:3000/api/notification/send_notifiation',
    { json: params },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
        }
    }
);
} 
AppointmentsModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
  if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
  res.json({Status:"Success",Message:"Appointment Updated", Data : UpdatedDetails ,Code:200});
});
});


router.post('/delete', function (req, res) {
 let c = {
    delete_status : true
  }
  AppointmentsModel.findByIdAndUpdate(req.body._id, c, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Location Deleted successfully", Data : UpdatedDetails ,Code:200});
  });
});


// // DELETES A USER FROM THE DATABASE
router.post('/admin_delete', function (req, res) {
      AppointmentsModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Appointment Deleted successfully", Data : {} ,Code:200});
      });
});


module.exports = router;
