var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
// petdetailsModel.js
var pettypeModel = require('./../models/pettypeModel');
var doctor_specModel = require('./../models/doctor_specModel');
var petdetailsModel = require('./../models/petdetailsModel');
var product_categoriesModel = require('./../models/product_categoriesModel');



router.post('/mobile/create', async function(req, res) {
  try{
    console.log("Request body",req.body);
        await petdetailsModel.create({
            user_id:  req.body.user_id || "",
            pet_img : [{
              "pet_img" : "http://54.212.108.156:3000/api/uploads/Pic_empty.jpg"
            }],
            pet_name : req.body.pet_name || "",
            pet_type : req.body.pet_type || "",
            pet_breed : req.body.pet_breed || "",
            pet_gender : req.body.pet_gender || "",
            pet_color : req.body.pet_color || "",
            pet_weight : req.body.pet_weight || 0,
            pet_age : req.body.pet_age || "",
            pet_dob : req.body.pet_dob || "",
            pet_spayed : false,
            pet_purebred : false,
            pet_frnd_with_dog :false,
            pet_frnd_with_cat : false,
            pet_frnd_with_kit :false,
            pet_microchipped: false,
            pet_tick_free : false,
            pet_private_part : false,
            petbio : req.body.petbio || "",
            vaccinated : req.body.vaccinated || false,
            last_vaccination_date : req.body.last_vaccination_date || "",
            default_status : req.body.default_status || false,
            date_and_time : req.body.date_and_time || "",
            mobile_type : req.body.mobile_type || "",
            delete_status : false,
        }, 
        function (err, user) {
          console.log(user)
            console.log(err)
        res.json({Status:"Success",Message:"Pet details added successfully", Data : user ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});



router.post('/filter_date', function (req, res) {
        petdetailsModel.find({}, function (err, StateList) {
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




router.post('/create', async function(req, res) {
  try{
    console.log("Request body",req.body);
        await petdetailsModel.create({
            user_id:  req.body.user_id,
            pet_img : [{
              "pet_img" : "http://54.212.108.156:3000/api/uploads/Pic_empty.jpg"
            }],
            pet_name : req.body.pet_name || "",
            pet_type : req.body.pet_type || "",
            pet_breed : req.body.pet_breed || "",
            pet_gender : req.body.pet_gender || "",
            pet_color : req.body.pet_color || "",
            pet_weight : req.body.pet_weight || 0,
            pet_age : req.body.pet_age || "",
            pet_spayed : false,
            pet_purebred : false,
            pet_frnd_with_dog :false,
            pet_frnd_with_cat : false,
            pet_frnd_with_kit :false,
            pet_microchipped: false,
            pet_tick_free : false,
            pet_private_part : false,
            petbio : "",
            vaccinated : req.body.vaccinated || false,
            last_vaccination_date : req.body.last_vaccination_date || "",
            default_status : false,
            delete_status : false,
            date_and_time : req.body.date_and_time,
            mobile_type : req.body.mobile_type,
        }, 
        function (err, user) {
          console.log(user)
            console.log(err)
        res.json({Status:"Success",Message:"pet details Added successfully", Data : user ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});

router.get('/deletes', function (req, res) {
      petdetailsModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"Pet details deleted", Data : {} ,Code:200});     
      });
});



router.get('/mobile/dropdownslist',async function (req, res) {
let doctor_specModels  =  await doctor_specModel.find({delete_status : false});
let pettypeModels  =  await pettypeModel.find({delete_status : false});
// pet_type_title
let final_data1 = [];
for(let y = 0 ; y < pettypeModels.length; y ++){
  console.log(pettypeModels[y]);
 let u = {
  pet_handle : pettypeModels[y].pet_type_title
   } 
final_data1.push(u);
}
  let a = [];
  let h = [{'com_type':"Online",'Value':0},{'com_type':"Visit",'Value':1},{'com_type':"Online Or Visit",'Value':2}];
  let b = [];
  let c = [
     {gender : "Male"},
     {gender : "Female"}
  ];
   let d = [
     {color : "red"},
     {color : "white"},
     {color : "green"},
     {color : "yellow"},
  ];
  let e = doctor_specModels;
  let f = final_data1;
   let g = [
     {services : "services - 1"},
     {services : "services - 2"},
     {services : "services - 3"},
  ];
  final = {
    Pet_type : a ,
    Pet_breed : b,
    Gender : c,
    color : d,
    specialzation : e,
    pet_handle : f,
    services : g,
    communication_type : h,
  }
 res.json({Status:"Success",Message:"Pet type list", Data : final ,Code:200});
});



router.get('/deletes', function (req, res) {
      petdetailsModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"Pet details dropdown list", Data : {} ,Code:200});     
      });
});




router.post('/mobile/getlist_id', function (req, res) {
        petdetailsModel.find({user_id:req.body.user_id,delete_status : false}, function (err, StateList) {
          res.json({Status:"Success",Message:"Pet details list", Data : StateList ,Code:200});
        });
});



router.get('/getlist', function (req, res) {
        petdetailsModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"pet details Details", Data : Functiondetails ,Code:200});
        });
});


router.get('/mobile/getlist', function (req, res) {
        petdetailsModel.find({}, function (err, Functiondetails) {
          let a = {
            usertypedata : Functiondetails
          }
          res.json({Status:"Success",Message:"pet details Details", Data : a ,Code:200});
        });
});

router.post('/edit', function (req, res) {
        petdetailsModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Pet details updated", Data : UpdatedDetails ,Code:200});
        });
});


router.post('/delete', function (req, res) {
 let c = {
    delete_status : true
  }
  petdetailsModel.findByIdAndUpdate(req.body._id, c, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Location Deleted successfully", Data : UpdatedDetails ,Code:200});
  });
});



// // DELETES A USER FROM THE DATABASE
router.post('/admin_delete', function (req, res) {
      petdetailsModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"pet details Deleted successfully", Data : {} ,Code:200});
      });
});


module.exports = router;
