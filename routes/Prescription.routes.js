var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var pdf = require('html-pdf');
const puppeteer = require('puppeteer');
var fs = require('fs');
var path = require('path');
 var PetdetailsModel = require('./../models/petdetailsModel');
 var pdfgeneratorHelper = require('./pdfhelper')
// var FamilyModel = require('./../models/FamilyModel');
// var DoctorModel = require('./../models/LivedoctorModel');
 var AppointmentModel = require('./../models/AppointmentsModel');


  var WalkAppointmentsModel = require('./../models/walkin_appointmentModel');


var Prescription = require('./../models/PrescriptionModel');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
const { v4: uuidv4 } = require('uuid');
var doctordetailsModel = require('./../models/doctordetailsModel');
// var responseMiddleware = require('./../middlewares/response.middleware');
// router.use(responseMiddleware());

router.post('/create', async function(req, res) {
  try{
     //console.log("Create",req.body);
     var Prescription_data = req.body.Prescription_data || "";
     var doctor_commeents = req.body.Doctor_Comments || "";
     var doctorDetails = await doctordetailsModel.findOne({user_id:req.body.doctor_id});
     console.log(doctorDetails);
     var MeditationDetails = await AppointmentModel.findOne({_id:req.body.Appointment_ID}).populate('user_id family_id');
     var pet_details = MeditationDetails.family_id;
     var user_details = MeditationDetails.user_id;
     var allergies = MeditationDetails.allergies;
     // var PetDetails = await PetdetailsModel.findById(req.body.Pet_ID);
     var pdfpath = await pdfgeneratorHelper.pdfgenerator(pet_details,user_details,doctorDetails,Prescription_data,doctor_commeents,allergies,req.body.diagnosis,req.body.sub_diagnosis);
     console.log("Prescription",pdfpath);
     let Appointmentid = "PRE-" + new Date().getTime();
     // if(req.body.Treatment_Done_by == 'Self'){
     //   var patientDetails = await PatientModel.findById(req.body.Patient_ID).select('Name Age Gender Height Weight');
     //  var pdfpath = await pdfgeneratorHelper.pdfgenerator(doctorDetails,patientDetails,MeditationDetails,Prescription_data,doctor_commeents);
     // }
     // else{
     //     var patientDetails = await FamilyModel.findById(req.body.Family_ID).select('Name Age Gender Height Weight');  
     //   var pdfpath = await pdfgeneratorHelper.pdfgenerator(doctorDetails,patientDetails,MeditationDetails,Prescription_data,doctor_commeents);
     // }
        await Prescription.create({
            doctor_id: req.body.doctor_id || "",
            Prescription_data: req.body.Prescription_data || "",
            Appointment_ID: req.body.Appointment_ID || "",
            Treatment_Done_by: req.body.Treatment_Done_by || "",
            user_id : req.body.user_id || "",
            Prescription_type : req.body.Prescription_type || "",
            PDF_format : pdfpath || "",
            Prescription_img :  req.body.Prescription_img || "",
            Doctor_Comments: req.body.Doctor_Comments,
            diagnosis : req.body.diagnosis || "",
            sub_diagnosis : req.body.sub_diagnosis || "",
            Date : req.body.Date,
            delete_status : false,
            Prescription_id : Appointmentid,
        }, 
        function (err, user) {
        res.json({Status:"Success",Message:"Added successfully", Data : user,Code:200}); 
        });
}
catch(e){
  console.log("final error", e)
      res.json({Status:"Failed",Message:"Unable to add the data", Data : e ,Code:300}); 
}
});



router.post('/walkin/create', async function(req, res) {
  try{
     //console.log("Create",req.body);
     var Prescription_data = req.body.Prescription_data || "";
     var doctor_commeents = req.body.Doctor_Comments || "";
     var doctorDetails = await doctordetailsModel.findOne({user_id:req.body.doctor_id});
     console.log(doctorDetails);
     var MeditationDetails = await WalkAppointmentsModel.findOne({_id:req.body.Appointment_ID}).populate('user_id pet_id');
     var pet_details = MeditationDetails.pet_id;
     var user_details = MeditationDetails.user_id;
     var allergies = MeditationDetails.allergies;
     // var PetDetails = await PetdetailsModel.findById(req.body.Pet_ID);
     var pdfpath = await pdfgeneratorHelper.pdfgenerator(pet_details,user_details,doctorDetails,Prescription_data,doctor_commeents,allergies,req.body.diagnosis,req.body.sub_diagnosis);
     console.log("Prescription",pdfpath);
     let Appointmentid = "PRE-" + new Date().getTime();
     // if(req.body.Treatment_Done_by == 'Self'){
     //   var patientDetails = await PatientModel.findById(req.body.Patient_ID).select('Name Age Gender Height Weight');
     //  var pdfpath = await pdfgeneratorHelper.pdfgenerator(doctorDetails,patientDetails,MeditationDetails,Prescription_data,doctor_commeents);
     // }
     // else{
     //     var patientDetails = await FamilyModel.findById(req.body.Family_ID).select('Name Age Gender Height Weight');  
     //   var pdfpath = await pdfgeneratorHelper.pdfgenerator(doctorDetails,patientDetails,MeditationDetails,Prescription_data,doctor_commeents);
     // }
        await Prescription.create({
            doctor_id: req.body.doctor_id || "",
            Prescription_data: req.body.Prescription_data || "",
            Appointment_ID: req.body.Appointment_ID || "",
            Treatment_Done_by: req.body.Treatment_Done_by || "",
            user_id : req.body.user_id || "",
            Prescription_type : req.body.Prescription_type || "",
            PDF_format : pdfpath || "",
            Prescription_img :  req.body.Prescription_img || "",
            Doctor_Comments: req.body.Doctor_Comments,
            diagnosis : req.body.diagnosis || "",
            sub_diagnosis : req.body.sub_diagnosis || "",
            Date : req.body.Date,
            delete_status : false,
            Prescription_id : Appointmentid,
        }, 
        function (err, user) {
        res.json({Status:"Success",Message:"Added successfully", Data : user,Code:200}); 
        });
}
catch(e){
  console.log("final error", e)
      res.json({Status:"Failed",Message:"Unable to add the data", Data : e ,Code:300}); 
}
});



router.post('/walkin_create', async function(req, res) {
  try{
        await Prescription.create({
            doctor_id: req.body.doctor_id || "",
            Prescription_data: req.body.Prescription_data || "",
            Appointment_ID: req.body.Appointment_ID || "",
            Treatment_Done_by: req.body.Treatment_Done_by || "",
            user_id : req.body.user_id || "",
            Prescription_type : req.body.Prescription_type || "",
            PDF_format : '' || "",
            Prescription_img :  req.body.Prescription_img || "",
            Doctor_Comments: req.body.Doctor_Comments,
            diagnosis : req.body.diagnosis || "",
            sub_diagnosis : req.body.sub_diagnosis || "",
            Date : req.body.Date,
            delete_status : false
        }, 
        function (err, user) {
          console.log(err);
        res.json({Status:"Success",Message:"Added successfully", Data : user,Code:200}); 
        });
}
catch(e){
  console.log("final error", e)
      res.json({Status:"Failed",Message:"Unable to add the data", Data : e ,Code:300}); 
}
});


router.post('/getlist', function (req, res) {
      Prescription.find({Appointment_ID:req.body.Appointment_ID}, function (err, Prescriptiondetails) {
      res.json({Status:"Success",Message:"Prescriptiondetails", Data : Prescriptiondetails ,Code:200});
        });
});



router.post('/walkinedit', function (req, res) {
        Prescription.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"User type Updated", Data : UpdatedDetails ,Code:200});
        });
});


router.post('/dropdown/getlist', function (req, res) {
       let a = {
        diagnosis : [ {title : "diagnosis1"},{title : "diagnosis2"},{title : "diagnosis3"},{title : "diagnosis4"},{title : "diagnosis5"}],
        sub_diagnosis : [ {title : "sub_diagnosis1"},{title : "sub_diagnosis2"},{title : "sub_diagnosis3"},{title : "sub_diagnosis4"},{title : "sub_diagnosis5"}],
       }
      });



router.post('/fetch_by_appointment_id', function (req, res) {
      Prescription.findOne({Appointment_ID:req.body.Appointment_ID},async function (err, Prescriptiondetails) {
      console.log(Prescriptiondetails);
      if(Prescriptiondetails == null){
      res.json({Status:"Failed",Message:"Prescription not available", Data : {} ,Code:404});
      }else{

      var doctorDetails = await doctordetailsModel.findOne({user_id:Prescriptiondetails.doctor_id});
      var Patiend_details = await AppointmentModel.findOne({_id:req.body.Appointment_ID}).populate('user_id family_id');
      console.log(doctorDetails);
      console.log(Patiend_details);
      
      let Prescription_type = 'http://petfolio.in';
      if(Prescriptiondetails.Prescription_type == 'PDF'){
      Prescription_type = Prescriptiondetails.PDF_format;
      }else if(Prescriptiondetails.Prescription_type == 'Image') {
        Prescription_type = Prescriptiondetails.Prescription_img;
      }
      let c = {
         "doctorname": doctorDetails.dr_name,
         "doctor_speci" : doctorDetails.specialization,
         "web_name"  : "www.petfolio.in",
         "phone_number" : "+91-9988776655",
         "app_logo"  : "http://54.212.108.156:3000/api/uploads/logo.png",
         "owner_name"  : Patiend_details.user_id.first_name,

            "user_id": Patiend_details.family_id.user_id,
            "name":  Patiend_details.family_id.name,
            "gender":  Patiend_details.family_id.gender,
            "relation_type":  Patiend_details.family_id.relation_type,
            "health_issue":  Patiend_details.family_id.health_issue,
            "dateofbirth":  Patiend_details.family_id.dateofbirth,
            "anymedicalinfo":  Patiend_details.family_id.anymedicalinfo,
            "covide_vac":  Patiend_details.family_id.covide_vac,
            "weight":  Patiend_details.family_id.weight,
        
         "diagnosis": Prescriptiondetails.diagnosis,
         "sub_diagnosis": Prescriptiondetails.sub_diagnosis,
         "allergies"  : Prescriptiondetails.allergies,
         "Doctor_Comments": Prescriptiondetails.Doctor_Comments,
         "digital_sign" : doctorDetails.signature,
         "Prescription_data": Prescriptiondetails.Prescription_data,
          "_id": Prescriptiondetails._id,
          "doctor_id": Prescriptiondetails.doctor_id,
          "Appointment_ID": Prescriptiondetails.Appointment_ID,
          "Treatment_Done_by":Prescriptiondetails.Treatment_Done_by,
          "user_id": Prescriptiondetails.user_id,
          "Prescription_type":Prescriptiondetails.Prescription_type,
          "PDF_format":Prescriptiondetails.PDF_format,
          "Prescription_img":Prescriptiondetails.Prescription_img,
          "Date":Prescriptiondetails.Date,
          "allergies" : Patiend_details.allergies,
          "delete_status": Prescriptiondetails.delete_status,
          "updatedAt": Prescriptiondetails.updatedAt,
          "createdAt": Prescriptiondetails.createdAt,
          "health_issue_title" : Patiend_details.health_issue_title || "",
          "__v": 0,
          "doctor_id" : doctorDetails.doctor_id || "",
          "clinic_no" : doctorDetails.clinic_no || "",
          "clinic_loc" : doctorDetails.clinic_loc || "",
          "clinic_name" : doctorDetails.clinic_name || "",
          "Prescription_id"  : Prescriptiondetails.Prescription_id,
          "share_msg" : "Please find the Prescription for the appointment: "+ Prescription_type + ". You can download Petfolio Mobile App using this link below. http://petfolio.in"
      }
      res.json({Status:"Success",Message:"Prescription detail", Data : c ,   Code:200});

      }






        });
});


router.post('/walkin/fetch_by_appointment_id', function (req, res) {
      Prescription.findOne({Appointment_ID:req.body.Appointment_ID},async function (err, Prescriptiondetails) {
      console.log(Prescriptiondetails);
      var doctorDetails = await doctordetailsModel.findOne({user_id:Prescriptiondetails.doctor_id});
      var Patiend_details = await WalkAppointmentsModel.findOne({_id:req.body.Appointment_ID}).populate('user_id pet_id');
      console.log(doctorDetails);
      console.log(Patiend_details);
      let c = {
         "doctorname": doctorDetails.dr_name,
         "doctor_speci" : doctorDetails.specialization,
         "web_name"  : "www.petfolio.com",
         "phone_number" : "+91-9988776655",
         "app_logo"  : "http://54.212.108.156:3000/api/uploads/logo.png",
         "owner_name"  : Patiend_details.user_id.first_name,
         "pet_type"  : Patiend_details.pet_id.pet_type,
         "pet_breed"  : Patiend_details.pet_id.pet_breed,
         "pet_name" :  Patiend_details.pet_id.pet_name,
         "gender"  : Patiend_details.pet_id.pet_gender,
         "weight"  : Patiend_details.pet_id.pet_weight,
         "age" : Patiend_details.pet_id.pet_age,
         "diagnosis": Prescriptiondetails.diagnosis,
         "sub_diagnosis": Prescriptiondetails.sub_diagnosis,
         "allergies"  : Prescriptiondetails.allergies,
         "Doctor_Comments": Prescriptiondetails.Doctor_Comments,
         "digital_sign" : doctorDetails.signature,
         "Prescription_data": Prescriptiondetails.Prescription_data,
          "_id": Prescriptiondetails._id,
          "doctor_id": Prescriptiondetails.doctor_id,
          "Appointment_ID": Prescriptiondetails.Appointment_ID,
          "Treatment_Done_by":Prescriptiondetails.Treatment_Done_by,
          "user_id": Prescriptiondetails.user_id,
          "Prescription_type":Prescriptiondetails.Prescription_type,
          "PDF_format":Prescriptiondetails.PDF_format,
          "Prescription_img":Prescriptiondetails.Prescription_img,
          "Date":Prescriptiondetails.Date,
          "allergies" : Patiend_details.allergies,
          "delete_status": Prescriptiondetails.delete_status,
          "updatedAt": Prescriptiondetails.updatedAt,
          "createdAt": Prescriptiondetails.createdAt,
          "health_issue_title" : Patiend_details.health_issue_title || "",
          "__v": 0,
          "doctor_id" : doctorDetails.doctor_id || "",
          "clinic_no" : doctorDetails.clinic_no || "",
          "clinic_loc" : doctorDetails.clinic_loc || "",
          "clinic_name" : doctorDetails.clinic_name || "",
          "Prescription_id"  : Prescriptiondetails.Prescription_id,
      }
      res.json({Status:"Success",Message:"Prescription detail", Data : c ,Code:200});
        });
});


router.post('/getlist_user_id', function (req, res) {
      Prescription.find({user_id:req.body.user_id}, function (err, Prescriptiondetails) {
      res.json({Status:"Success",Message:"Prescriptiondetails", Data : Prescriptiondetails ,Code:200});
        });
});


router.get('/getlist', function (req, res) {
      Prescription.find({}, function (err, Prescriptiondetails) {
      res.json({Status:"Success",Message:"Prescriptiondetails", Data : Prescriptiondetails ,Code:200});
        });
})

router.get('/deletes', function (req, res) {
      Prescription.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"Prescription Details Deleted", Data : {} ,Code:200});     
      });
});


router.post('/filter_date', function (req, res) {
        Prescription.find({}, function (err, StateList) {
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



router.post('/edit',async function (req, res) {
  let doctor_commeents = req.body.Doctor_Comments || "";
  try{
    let Appointment_ID = req.body.Appointment_ID;
    var appointmentidcheck = await Prescription.findOne({Appointment_ID:req.body.Appointment_ID});
    if(appointmentidcheck!=null){
      let Prescription_data = req.body.Prescription_data || "";

    var doctorDetails = await DoctorModel.findById(req.body.Doctor_ID).select('Name KMS_registration signature Specilization');
    var MeditationDetails = await AppointmentModel.findById(req.body.Appointment_ID).select('Problem_info passed_Medications');
    if(req.body.Treatment_Done_by == 'Self'){
      var patientDetails = await PatientModel.findById(req.body.Patient_ID).select('Name Age Gender Height Weight');
      console.log("PATIENTDETAILS",patientDetails);
      var pdfpath = await pdfgeneratorHelper.pdfgenerator(doctorDetails,patientDetails,MeditationDetails,Prescription_data,doctor_commeents);

    }
    else{
        var familyDetails = await FamilyModel.findById(req.body.Family_ID).select('Name Age Gender Height Weight');  
        var pdfpath = await pdfgeneratorHelper.pdfgenerator(doctorDetails,familyDetails,MeditationDetails,Prescription_data);
    }
      var newpdf = await Prescription.findOneAndUpdate({Appointment_ID:req.body.Appointment_ID},{PDF_format:pdfpath,Prescription_data:req.body.Prescription_data,Doctor_Comments:req.body.Doctor_Comments}, {new: true});
             res.json({Status:"Success",Message:"Prescriptiondetails Updated", Data : newpdf ,Code:200});
    }
else{
      let Prescription_data = req.body.Prescription_data || "";
    var doctorDetails = await DoctorModel.findById(req.body.Doctor_ID).select('Name KMS_registration signature Specilization');
    var MeditationDetails = await AppointmentModel.findById(req.body.Appointment_ID).select('Problem_info passed_Medications');
    if(req.body.Treatment_Done_by == 'Self'){
      var patientDetails = await PatientModel.findById(req.body.Patient_ID).select('Name Age Gender Height Weight');
      var pdfpath = await pdfgeneratorHelper.pdfgenerator(doctorDetails,patientDetails,MeditationDetails,Prescription_data,doctor_commeents);
    }
    else{
        var patientDetails = await FamilyModel.findById(req.body.Family_ID).select('Name Age Gender Height Weight');  
        var pdfpath = await pdfgeneratorHelper.pdfgenerator(doctorDetails,patientDetails,MeditationDetails,Prescription_data,doctor_commeents);
    }
        await Prescription.create({

            Doctor_Name : req.body.Doctor_Name, 
            Doctor_Image: req.body.Doctor_Image || "",
            Doctor_ID: req.body.Doctor_ID || "",
            Prescription_data: req.body.Prescription_data || "",
            Appointment_ID: req.body.Appointment_ID || "",
            Treatment_Done_by: req.body.Treatment_Done_by || "",
            Patient_Name : req.body.Patient_Name || "",
            Patient_Image: req.body.Patient_Image || "",
            Patient_ID :req.body.Patient_ID || "",
            Family_ID : req.body.Family_ID || "",
            Family_Name: req.body.Family_Name || "",
            Family_Image: req.body.Family_Image || "",
            PDF_format : pdfpath|| "",
            Doctor_Comments: req.body.Doctor_Comments

        }, 
       async function (err, user) {
        res.json({Status:"Success",Message:"Added successfully", Data : user,Code:200}); 
        });
}
        
    }
    catch(e){
      res.status(500).send("Internal server error");
    }
});


router.post('/delete', function (req, res) {
 let c = {
    delete_status : true
  }
  Prescription.findByIdAndUpdate(req.body._id, c, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Location Deleted successfully", Data : UpdatedDetails ,Code:200});
  });
});



// // DELETES A USER FROM THE DATABASE
router.post('/admin_delete', function (req, res) {
      Prescription.findByIdAndRemove(req.body.Prescription_id, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
          res.json({Status:"Success",Message:"Prescription Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;