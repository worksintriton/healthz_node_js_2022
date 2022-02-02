var express = require('express');
var router = express.Router();
const requestss = require("request");
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var GeoPoint = require('geopoint');
var process = require('process');


var userdetailsModel = require('./../models/userdetailsModel');
var locationdetailsModel = require('./../models/locationdetailsModel');
var dashboard_petlover1 = require('./dashboard_petlover1.json');
var dashboard_petlover = require('./dashboard_petlover.json');
var minibannerModel = require('./../models/minibannerModel');


var Doctor_favModel = require('./../models/Doctor_favModel');
var Product_favModel = require('./../models/Product_favModel');

var doctordetailsModel = require('./../models/doctordetailsModel');
var petdetailsModel = require('./../models/petdetailsModel');
var homebannerModel = require('./../models/homebannerModel');
var AppointmentsModel = require('./../models/AppointmentsModel');
var product_categoriesModel = require('./../models/product_categoriesModel');
var SP_servicesMode = require('./../models/SP_servicesModel');
var AppointmentsModel = require('./../models/AppointmentsModel');
var SP_appointmentsModels = require('./../models/SP_appointmentsModels');
var product_detailsModel = require('./../models/product_detailsModel');



var family = require('./../models/familymemberModel');




router.post('/create', async function(req, res) {

  console.log("registered",req.body);
  try{

       if(req.body.ref_code !== ''){
       var ref_code_details  =  await userdetailsModel.findOne({my_ref_code:req.body.ref_code});
       if(ref_code_details == null ){
        res.json({Status:"Failed",Message:"Referral code not found",Data : {},Code:404});
        process.exit(1);
       }
       }
    
       let random = 123456;
       let phone  =  await userdetailsModel.findOne({user_phone : req.body.user_phone});
          var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
          var result = '';
          for ( var i = 0; i < 7; i++ ) {
           result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
          }
       if(phone !== null){
        if(phone.user_status == 'Incomplete'){
           let a  = {
            user_details : phone
        }
        var json = "";
        var username = "tritonitsolutionstrans";
        var password = 20145;
        var mobilno = req.body.user_phone;
        var message =
          "Hi, Your OTP is " + phone.otp + ". Healthz OTP for Signup.";
        // var dumbell = "DUMBELL";
        var dumbell = "VOXITW";
        var tye = 0;
          var baseurls =
          "http://www.smsintegra.com/" +
          "api/smsapi.aspx?uid=" +
          username +
          "&pwd=" +
          password +
          "&mobile=" +
          mobilno +
          "&msg=" +
          message +
          "&sid=" +
          dumbell +
          "&type=" +
          tye;
        // var baseurls = "https://api.msg91.com/api/v5/otp?template_id=6163d627b7fce00aa76f1654&mobile=919514497862&authkey=368262AUIWMydH6615ee50aP1";
        requestss(baseurls, { json: true }, async (err, response, body) => {
           if (err) {
            return 
          }
          else{
        res.json({Status:"Success",Message:"Sign up successfully! welcome to Healthz",Data : a , Code:200}); 
              }
        });
        }else{
            res.json({Status:"Failed",Message:"This phone number already registered",Data : {},Code:404}); 
        }


       }else
       {
          await userdetailsModel.create({
            first_name:  req.body.first_name || "",
            last_name : req.body.last_name || "",
            user_email : req.body.user_email || "",
            user_phone : req.body.user_phone || "",
            date_of_reg : req.body.date_of_reg || "",
            user_type : req.body.user_type,
            ref_code : req.body.ref_code || "",
            my_ref_code : result || "0000000",
            user_status : req.body.user_status || "Incomplete",
            otp : random || 0,
            profile_img : "",
            user_email_verification : req.body.user_email_verification || false,
            fb_token : "",
            device_id : "",
            device_type : "",
            mobile_type : req.body.mobile_type || "",
            delete_status : false
        }, 
        function (err, user) {
         
        let a  = {
            user_details : user
        }
        var json = "";
        var username = "tritonitsolutionstrans";
        var password = 20145;
        var mobilno = req.body.user_phone;
        var message =
          "Hi, Your OTP is " + random + ". Healthz OTP for Signup.";
        // var dumbell = "DUMBELL";
        var dumbell = "VOXITW";
        var tye = 0;


         var baseurls =
          "http://www.smsintegra.com/" +
          "api/smsapi.aspx?uid=" +
          username +
          "&pwd=" +
          password +
          "&mobile=" +
          mobilno +
          "&msg=" +
          message +
          "&sid=" +
          dumbell +
          "&type=" +
          tye;

          
        // var baseurls = "https://api.msg91.com/api/v5/otp?template_id=6163d627b7fce00aa76f1654&mobile=919514497862&authkey=368262AUIWMydH6615ee50aP1";
        requestss(baseurls, { json: true }, async (err, response, body) => {
           if (err) {
            return console.log(err);
          }
          else{
        res.json({Status:"Success",Message:"Sign up successfully! welcome to Healthz",Data : a , Code:200}); 
              }
        });
        });
       }
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});



router.post('/send/emailotp',async function (req, res) {
  var randomChars = '0123456789';
          var result = '';
          for ( var i = 0; i < 6; i++ ) {
           result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
          }
   let phone  =  await userdetailsModel.findOne({user_email:req.body.user_email,user_email_verification:true});
   console.log(phone);
   if(phone !== null){
      res.json({Status:"Failed",Message:"There is already a user registered with this email id. Please log in/add new email id", Data : {} ,Code:404});     
   }
   else
   {
    let random = result;
    var nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: 'thinkinghatstech@gmail.com',
    pass: 'Pass@2021'
  }
});

var mailOptions = {
  from: 'thinkinghatstech@gmail.com',
  to: req.body.user_email,
  subject: "Email verification OTP",
  text: "Hi, Your OTP is " + random + ". HealthZ OTP for Signup."
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
   console.log(error);
  } else {
   
    res.json({Status:"Success",Message:"OTP sent successfully",Data : {
      'email_id': req.body.user_email,
      'otp' : +random
    } , Code:200}); 

  }
});

   }   
});



router.get('/sendtestsms', function (req, res) {

        var json = "";
        var username = "tritonitsolutionstrans";
        var password = 20145;
        var mobilno = req.body.user_phone;
        var message =
          "Hi, Your OTP is " + random + ". Healthz OTP for Signup.";
        // var dumbell = "DUMBELL";
        var dumbell = "VOXITW";
        var tye = 0;
        var baseurls =
          "http://www.smsintegra.com/" +
          "api/smsapi.aspx?uid=" +
          username +
          "&pwd=" +
          password +
          "&mobile=" +
          mobilno +
          "&msg=" +
          message +
          "&sid=" +
          dumbell +
          "&type=" +
          tye;
          requestss(baseurls, { json: true }, async (err, response, body) => {
           if (err) {
            return console.log(err);
          }
          else{
        res.json({Status:"Success",Message:"Sign up successfully! welcome to Healthz",Data : a , Code:200}); 
              }
        });


      // userdetailsModel.remove({}, function (err, user) {
      //     if (err) return res.status(500).send("There was a problem deleting the user.");
      //        res.json({Status:"Success",Message:"User Details Deleted", Data : {} ,Code:200});     
      // });
});




router.get('/deletes', function (req, res) {
      userdetailsModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"User Details Deleted", Data : {} ,Code:200});     
      });
});


router.post('/filter_date', function (req, res) {
        userdetailsModel.find({}, function (err, StateList) {
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




router.post('/petlove/mobile/dashboard',async function (req, res) {
 
 let userdetails  =  await userdetailsModel.findOne({_id:req.body.user_id}); 


  
 let location_details  =  await locationdetailsModel.find({user_id:req.body.user_id,default_status:true});
 let tem_doctordetailsModel  =  await doctordetailsModel.find({});
 let Banner_details  =  await doctordetailsModel.find({});
 // let product_categoriesModels  =  await product_categoriesModel.find({});
 let petdetailsModels  =  await petdetailsModel.find({user_id:req.body.user_id});
 let homebanner  =  await homebannerModel.find({});
 // dashboard_petlover.Products_details = product_categoriesModels;
 // dashboard_petlover.Puppy_Products_details = product_categoriesModels;
     dashboard_petlover.Banner_details = []
    for(let c = 0 ; c < homebanner.length; c ++){
       let gg = {
        '_id': homebanner[c]._id,
        'title' :  homebanner[c].img_title,
        'img_path' :  homebanner[c].img_path,
       }
      dashboard_petlover.Banner_details.push(gg);
    }
 // dashboard_petlover.Banner_details = dashboard_petlover;
   let final_docdetails = [];
   for(let a = 0 ; a < tem_doctordetailsModel.length; a ++){
   
    var point1 = new GeoPoint(+req.body.lat, +req.body.long);
    var point2 = new GeoPoint(+tem_doctordetailsModel[a].clinic_lat,+tem_doctordetailsModel[a].clinic_long);
    var distance = point1.distanceTo(point2, true)//output in kilometers
   
    
    let dd = {
       '_id' : tem_doctordetailsModel[a].user_id,
       "doctor_name" : tem_doctordetailsModel[a].dr_name,
       "doctor_img" : tem_doctordetailsModel[a].clinic_pic[0].clinic_pic,
       "specialization" : tem_doctordetailsModel[a].specialization,
       "distance" : distance.toFixed(2),
       "star_count" : 4,
       "review_count": 223
    }
    final_docdetails.push(dd);
   }
   var ascending = final_docdetails.sort((a, b) => Number(a.distance) - Number(b.distance));
   dashboard_petlover.Doctor_details = [];
   dashboard_petlover.Doctor_details = ascending;
 if(userdetails.user_type == 1){
    let a = {
    SOS : [{Number:9876543210},{Number:9876543211},{Number:9876543212},{Number:9876543214}],
    LocationDetails : location_details,
    PetDetails : petdetailsModels,
    userdetails : userdetails,
    Dashboarddata : dashboard_petlover,
    messages : [
    {'title':'Doctor','message':'Unable to find the doctor near your location can i show the doctor above the location'},
    {'title':'Product','message':'Unable to find the Product near your location can i show the doctor above the location'},
    {'title':'sercive','message':'Unable to find the Sercive near your location can i show the doctor above the location'}
    ]
    // homebanner : homebanner
  }
  res.json({Status:"Success",Message:"Pet Lover Dashboard Details", Data : a ,Code:200});
}else{
  res.json({Status:"Failed",Message:"Working on it !", Data : {},Code:404});
}
});



router.post('/petlove/mobile/dashboard1',async function (req, res) {
  console.log('reqbody',req.body);
 let userdetails  =  await userdetailsModel.findOne({_id:req.body.user_id});
 let SP_servicelist  =  await SP_servicesMode.find({});
 let color_code = ['#F9A826','#FF7A7A','#9BD152','#009377','#FF0000','#FF6F00'];
 let icon_list = ['http://54.212.108.156:3000/api/uploads/1617889303126.png','http://54.212.108.156:3000/api/uploads/1617889319529.png','http://54.212.108.156:3000/api/uploads/1617889353269.png','http://54.212.108.156:3000/api/uploads/1617889386383.png','http://54.212.108.156:3000/api/uploads/1617889386383.png','http://54.212.108.156:3000/api/uploads/1617889353269.png'];
 var SP_servicelist_final = [];
 for(let s = 0 ; s < SP_servicelist.length ; s ++){
  let q = {
              "_id" : SP_servicelist[s]._id,
              "service_icon":SP_servicelist[s].img_path,
              "service_title":SP_servicelist[s].img_title,
              "background_color": color_code[s]
    }
    SP_servicelist_final.push(q);
 }
 let location_details  =  await locationdetailsModel.find({user_id:req.body.user_id,default_status:true,delete_status:false});
 let tem_doctordetailsModel  =  await doctordetailsModel.find({});
 let Banner_details  =  await doctordetailsModel.find({});
 let product_categoriesModels  =  await product_categoriesModel.find({});
 let petdetailsModels  =  await petdetailsModel.find({user_id:req.body.user_id,delete_status:false});
 let homebanner  =  await homebannerModel.find({});
 dashboard_petlover1.Service_details =  SP_servicelist_final;
 dashboard_petlover1.Products_details =  dashboard_petlover1.Products_details;
 dashboard_petlover1.Puppy_Products_details =  dashboard_petlover1.Products_details;
     dashboard_petlover1.Banner_details = []
    for(let c = 0 ; c < homebanner.length; c ++){
       let gg = {
        '_id': homebanner[c]._id,
        'title' :  homebanner[c].img_title,
        'img_path' :  homebanner[c].img_path,
       }
      dashboard_petlover1.Banner_details.push(gg);
    }
 // dashboard_petlover1.Banner_details = dashboard_petlover1;
   let final_docdetails = [];
   for(let a = 0 ; a < tem_doctordetailsModel.length; a ++){

    var point1 = new GeoPoint(+req.body.lat, +req.body.long);
    var point2 = new GeoPoint(+tem_doctordetailsModel[a].clinic_lat,+tem_doctordetailsModel[a].clinic_long);
    var distance = point1.distanceTo(point2, true)//output in kilometers

    let dd = {
       '_id' : tem_doctordetailsModel[a].user_id,
       "doctor_name" : tem_doctordetailsModel[a].dr_name,
       "doctor_img" : tem_doctordetailsModel[a].clinic_pic[0].clinic_pic,
       "specialization" : tem_doctordetailsModel[a].specialization,
       "distance" : distance.toFixed(2),
       // "star_count" : tem_doctordetailsModel[a].rating,
       // "review_count": tem_doctordetailsModel[a].comments
       "star_count" : 5,
       "review_count": 22
    }
    final_docdetails.push(dd);
   }
   var ascending = final_docdetails.sort((a, b) => Number(a.distance) - Number(b.distance));
   dashboard_petlover1.Doctor_details = [];
   dashboard_petlover1.Doctor_details = ascending;
 if(userdetails.user_type == 1){
    let a = {
    SOS : [{Number:9876543210},{Number:9876543211},{Number:9876543212},{Number:9876543214}],
    LocationDetails : location_details,
    PetDetails : petdetailsModels,
    userdetails : userdetails,
    Dashboarddata : dashboard_petlover1,
    messages : [
    {'title':'Doctor','message':'Unable to find the doctor near your location can i show the doctor above the location'},
    {'title':'Product','message':'Unable to find the Product near your location can i show the doctor above the location'},
    {'title':'sercive','message':'Unable to find the Sercive near your location can i show the doctor above the location'}
    ]
    // homebanner : homebanner
  }
  res.json({Status:"Success",Message:"Pet Lover Dashboard Details", Data : a ,Code:200});
}else{
  res.json({Status:"Failed",Message:"Working on it !", Data : {},Code:404});
}
});




router.post('/petlove/mobile/dashboardtest',async function (req, res) {
 let userdetails  =  await userdetailsModel.findOne({_id:req.body.user_id});
 let SP_servicelist  =  await SP_servicesMode.find({});
 let homebanner  =  await homebannerModel.find({});
 let minibanner  =  await minibannerModel.find({});

 let banner_title = ["World's Best Dog and Cat Food - FLAT 5% Off","Information on Marketing a Pet Food Product","pet food product market: The truth about pet food","Pet food is an environmental disaster"];
 let color_code = ['#F9A826','#FF7A7A','#9BD152','#009377','#FF0000','#FF6F00'];
 let middle_image = ['http://54.212.108.156:3000/api/uploads/1620120025593.png','http://54.212.108.156:3000/api/uploads/1617964675541.png','http://54.212.108.156:3000/api/uploads/1620120025593.png','http://54.212.108.156:3000/api/uploads/1617964675541.png',]
 let icon_list = ['http://54.212.108.156:3000/api/uploads/1617889303126.png','http://54.212.108.156:3000/api/uploads/1617889319529.png','http://54.212.108.156:3000/api/uploads/1617889353269.png','http://54.212.108.156:3000/api/uploads/1617889386383.png','http://54.212.108.156:3000/api/uploads/1617889386383.png','http://54.212.108.156:3000/api/uploads/1617889353269.png'];
 var SP_servicelist_final = [];
 for(let s = 0 ; s < SP_servicelist.length ; s ++){
  let q = {
              "_id" : SP_servicelist[s]._id,
              "service_icon": SP_servicelist[s].img_path,
              "service_title": SP_servicelist[s].img_title,
              "background_color": color_code[s]
    }
    SP_servicelist_final.push(q);
 }
 let location_details  =  await locationdetailsModel.find({user_id:req.body.user_id,default_status:true,delete_status:false});
 let tem_doctordetailsModel  =  await doctordetailsModel.find({}).limit(4);
 let Banner_details  =  await doctordetailsModel.find({});
 var product_list = await product_detailsModel.find({delete_status : false}).limit(4).populate('cat_id');

 let product_categoriesModels  =  [];
   for(let y = 0 ; y < product_list.length;y++) {
        var pro_fav = await Product_favModel.findOne({user_id:req.body.user_id,product_id:product_list[y]._id});
        var temp_fav = false;
        if(pro_fav !==  null){
               temp_fav = true;
        }
        let k = {
                        "_id": product_list[y]._id,
                        "product_img":  product_list[y].product_img[0],
                        "cat_name" : product_list[y].cat_id.product_cate,
                        "product_title":  product_list[y].product_name,
                        "product_price":  +product_list[y].cost.toFixed(0),
                        "thumbnail_image" : product_list[y].thumbnail_image,
                        "product_discount":  product_list[y].discount,
                        "product_discount_price" : product_list[y].discount_amount,
                        "product_fav": temp_fav,
                        "product_rating": product_list[y].product_rating || 5 ,
                        "product_review": product_list[y].product_review || 0 ,
          }
            product_categoriesModels.push(k);
    }
 let petdetailsModels  =  await family.find({user_id:req.body.user_id,delete_status:false});

 dashboard_petlover1.Service_details =  SP_servicelist_final;
 dashboard_petlover1.Products_details = product_categoriesModels;
 dashboard_petlover1.Puppy_Products_details = product_categoriesModels;
 dashboard_petlover1.Banner_details = []
    for(let c = 0 ; c < homebanner.length; c ++){
       let gg = {
        '_id': homebanner[c]._id,
        'title' :  homebanner[c].img_title,
        'img_path' : homebanner[c].img_path,
       }
      dashboard_petlover1.Banner_details.push(gg);
    }
    dashboard_petlover1.middle_Banner_details = [];
     for(let c = 0 ; c < minibanner.length; c ++){
       let gg = {
        '_id': minibanner[c]._id,
        'title' :  minibanner[c].img_title,
        'img_path' : minibanner[c].img_path,
       }
      dashboard_petlover1.middle_Banner_details.push(gg);
    }



 // dashboard_petlover1.Banner_details = dashboard_petlover1;
   let final_docdetails = [];
   for(let a = 0 ; a < tem_doctordetailsModel.length; a ++){

    var point1 = new GeoPoint(+req.body.lat, +req.body.long);
    var point2 = new GeoPoint(+tem_doctordetailsModel[a].clinic_lat,+tem_doctordetailsModel[a].clinic_long);
    var distance = point1.distanceTo(point2, true)//output in kilometers

    var doc_fav = await Doctor_favModel.findOne({user_id:req.body.user_id,doctor_id:tem_doctordetailsModel[a].user_id});
      var temp_fav = false;
        if(doc_fav !==  null){
               temp_fav = true;
        }
    let dd = {
       '_id' : tem_doctordetailsModel[a].user_id,
       // 'fav_id' : tem_doctordetailsModel[a]._id,
       "doctor_name" : tem_doctordetailsModel[a].dr_name,
       "doctor_img" : tem_doctordetailsModel[a].clinic_pic[0].clinic_pic,
       "thumbnail_image" : tem_doctordetailsModel[a].thumbnail_image || '',
       "specialization" : tem_doctordetailsModel[a].specialization,
       "distance" : distance.toFixed(2),
       "clinic_name" : tem_doctordetailsModel[a].clinic_name,
       "fav" : temp_fav,
       // "star_count" : tem_doctordetailsModel[a].rating,
       // "review_count": tem_doctordetailsModel[a].comments
       "star_count" : tem_doctordetailsModel[a].rating || 5,
       "review_count": tem_doctordetailsModel[a].comments || 0,
    }
    final_docdetails.push(dd);
   }
   var ascending = final_docdetails.sort((a, b) => Number(a.distance) - Number(b.distance));
   dashboard_petlover1.Doctor_details = [];
   dashboard_petlover1.Doctor_details = ascending;
 if(userdetails.user_type == 1){
    let a = {
    SOS : [{Number:9876543210},{Number:9876543211},{Number:9876543212},{Number:9876543214}],
    LocationDetails : location_details,
    PetDetails : petdetailsModels,
    userdetails : userdetails,
    Dashboarddata : dashboard_petlover1,
    messages : [
    {'title':'Doctor','message':'Unable to find the doctor near your location can i show the doctor above the location'},
    {'title':'Product','message':'Unable to find the Product near your location can i show the doctor above the location'},
    {'title':'sercive','message':'Unable to find the Sercive near your location can i show the doctor above the location'}
    ]
    // homebanner : homebanner
  }
  res.json({Status:"Success",Message:"Pet Lover Dashboard Details", Data : a ,Code:200});
}else{
  res.json({Status:"Failed",Message:"Working on it !", Data : {},Code:404});
}
});






router.post('/fetch_all_details',async function (req, res) {
      let userdetailsModels  =  await userdetailsModel.find({_id:req.body.user_id});
      let petdetailsModels  =  await petdetailsModel.find({user_id:req.body.user_id,delete_status : false});
      let locationdetailsModels  =  await locationdetailsModel.find({user_id:req.body.user_id,delete_status : false});
      let AppointmentsModels  =  await AppointmentsModel.find({user_id:req.body.user_id});
      let a = {
        userdetailsModels : userdetailsModels,
        petdetailsModels : petdetailsModels,
        locationdetailsModels : locationdetailsModels,
        AppointmentsModel : AppointmentsModels,
      }
      res.json({Status:"Success",Message:"User Details List", Data : a ,Code:200});
      
});



router.get('/fetch_payment_Details',async function (req, res) {

  var final_details = [];
  var Appointment_details = await AppointmentsModel.find({}).populate('user_id doctor_id pet_id');
  var app_total_price = 0;
  if(Appointment_details.length == 0){
     app_total_price = 0;     
  }
  else{
  for(let a = 0; a < Appointment_details.length ; a ++){
     app_total_price =  +app_total_price + +Appointment_details[a].amount;
     final_details.push(Appointment_details[a]);
     if(a == Appointment_details.length - 1){
       app_total_price = app_total_price;
     }
  }
  }

  var SP_appointmentsModelss = await SP_appointmentsModels.find({}).populate('user_id sp_id pet_id');
  var sp_total_price = 0;
  if(SP_appointmentsModelss.length == 0){
    sp_total_price = 0;
   res.json({Status:"Success",Message:"Appointment Calculations", Data : total_price ,Code:200});     
  }
  else{
  for(let a = 0; a < SP_appointmentsModelss.length ; a ++){
     sp_total_price =  +sp_total_price  +  +SP_appointmentsModelss[a].service_amount;
     final_details.push(SP_appointmentsModelss[a]);
     if(a == SP_appointmentsModelss.length - 1){
      sp_total_price = sp_total_price;
     }
  }
  }
      let a = {
        app_total_price : app_total_price,
        doc_appoint_details : Appointment_details,
        sp_total_price : sp_total_price,
        sp_appoint_details : SP_appointmentsModelss,
        vendor_total_price : 0,
        vendor_order_details : [],
        user_total_price : app_total_price + sp_total_price,
        user_appoint_details : final_details
      }
      res.json({Status:"Success",Message:"User Details List", Data : a ,Code:200});
      
});




router.post('/mobile/login',async function (req, res) {
    let userdetails  =  await userdetailsModel.findOne({user_phone:req.body.user_phone,user_status:"complete"});
    if(userdetails == null){
      res.json({Status:"Failed",Message:"Invalid Account",Data : {},Code:404}); 
    } else 
    {

     if(userdetails.user_type == 1){
     let random = 123456;
     let updatedata = {otp:random}
     var updatedetails = await userdetailsModel.findByIdAndUpdate({_id:userdetails._id},updatedata,{
       new: true
     });

      let a  = {
            user_details : updatedetails
        }
        var json = "";
        var username = "tritonitsolutionstrans";
        var password = 20145;
        var mobilno = req.body.user_phone;
        var message =
          "Hi, Your OTP is " + random + ". Healthz OTP for Signup.";
        // var dumbell = "DUMBELL";
        var dumbell = "VOXITW";
        var tye = 0;
        var baseurls =
          "http://www.smsintegra.com/" +
          "api/smsapi.aspx?uid=" +
          username +
          "&pwd=" +
          password +
          "&mobile=" +
          mobilno +
          "&msg=" +
          message +
          "&sid=" +
          dumbell +
          "&type=" +
          tye;

        requestss(baseurls, { json: true }, async (err, response, body) => {
          if (err) {
            return 
          }
          else{
             res.json({Status:"Success",Message:"OTP Sent to Your Mobile No",Data : a , Code:200}); 
              }
         });
     }else if(userdetails.user_type == 4){
     let random = 123456;
     let updatedata = {otp:random}
     var updatedetails = await userdetailsModel.findByIdAndUpdate({_id:userdetails._id},updatedata,{
       new: true
     });
    
      let a  = {
            user_details : updatedetails
        }
        var json = "";
        var username = "tritonitsolutionstrans";
        var password = 20145;
        var mobilno = req.body.user_phone;
        var message =
          "Hi, Your OTP is " + random + ". Healthz OTP for Signup.";
        // var dumbell = "DUMBELL";
        var dumbell = "VOXITW";
        var tye = 0;
        var baseurls =
          "http://www.smsintegra.com/" +
          "api/smsapi.aspx?uid=" +
          username +
          "&pwd=" +
          password +
          "&mobile=" +
          mobilno +
          "&msg=" +
          message +
          "&sid=" +
          dumbell +
          "&type=" +
          tye;
       
        requestss(baseurls, { json: true }, async (err, response, body) => {
          if (err) {
            return console.log(err);
          }
          else{
             res.json({Status:"Success",Message:"OTP Send to your mobile number",Data : a , Code:200}); 
              }
         });
     }else if(userdetails.user_type == 2){
     let random = 123456;
     let updatedata = {otp:random}
     var updatedetails = await userdetailsModel.findByIdAndUpdate({_id:userdetails._id},updatedata,{
       new: true
     });
     
      let a  = {
            user_details : updatedetails
        }
        var json = "";
        var username = "tritonitsolutionstrans";
        var password = 20145;
        var mobilno = req.body.user_phone;
        var message =
          "Hi, Your OTP is " + random + ". Healthz OTP for Signup.";
        // var dumbell = "DUMBELL";
        var dumbell = "VOXITW";
        var tye = 0;
        var baseurls =
          "http://www.smsintegra.com/" +
          "api/smsapi.aspx?uid=" +
          username +
          "&pwd=" +
          password +
          "&mobile=" +
          mobilno +
          "&msg=" +
          message +
          "&sid=" +
          dumbell +
          "&type=" +
          tye;

        requestss(baseurls, { json: true }, async (err, response, body) => {
          if (err) {
            return 
          }
          else{
             res.json({Status:"Success",Message:"OTP Send to your mobile number",Data : a , Code:200}); 
              }
         });
     }else if(userdetails.user_type == 3){
     let random = 123456;
     let updatedata = {otp:random}
     var updatedetails = await userdetailsModel.findByIdAndUpdate({_id:userdetails._id},updatedata,{
       new: true
     });
     
      let a  = {
            user_details : updatedetails
        }
        var json = "";
        var username = "tritonitsolutionstrans";
        var password = 20145;
        var mobilno = req.body.user_phone;
        var message =
          "Hi, Your OTP is " + random + ". Healthz OTP for Signup.";
        // var dumbell = "DUMBELL";
        var dumbell = "VOXITW";
        var tye = 0;
        var baseurls =
          "http://www.smsintegra.com/" +
          "api/smsapi.aspx?uid=" +
          username +
          "&pwd=" +
          password +
          "&mobile=" +
          mobilno +
          "&msg=" +
          message +
          "&sid=" +
          dumbell +
          "&type=" +
          tye;

        requestss(baseurls, { json: true }, async (err, response, body) => {
          if (err) {
            return 
          }
          else{
             res.json({Status:"Success",Message:"OTP Send to your mobile number",Data : a , Code:200}); 
              }
         });
     }
    }
});





router.post('/getlist_id', function (req, res) {
        userdetailsModel.find({Person_id:req.body.Person_id}, function (err, StateList) {
          res.json({Status:"Success",Message:"User Details List", Data : StateList ,Code:200});
        });
});


router.post('/logout',async function (req, res) {
          userdetailsModel.findByIdAndUpdate(req.body.user_id,{fb_token : ""}, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"FB Remove", Data : {} ,Code:200});
          });
});



router.post('/update_token', function (req, res) {
        userdetailsModel.find({},async function (err, StateList) {
          for(let a  = 0 ; a  < StateList.length; a++)
          {
         userdetailsModel.findByIdAndUpdate(StateList[a]._id,{fb_token : ""}, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             // res.json({Status:"Success",Message:"FB Updated", Data : UpdatedDetails ,Code:200});
          });
          if(a == StateList.length - 1){
          res.json({Status:"Success",Message:"User Details List", Data : StateList ,Code:200});
          }
          }
        });
});





router.post('/mobile/resendotp', function (req, res) {
        userdetailsModel.findOne({user_phone:req.body.user_phone}, function (err, StateList) {
        if(StateList == null){
           res.json({Status:"Failed",Message:"Invalid Mobile Number", Data : {} ,Code:404});
        }else{
          let a = {
            User_Details : StateList
          }
        var json = "";
        var username = "tritonitsolutionstrans";
        var password = 20145;
        var mobilno = req.body.user_phone;
        var message =
          "Hi, Your OTP is " + StateList.otp + ". Healthz OTP for signup resend.";
        // var dumbell = "DUMBELL";
        var dumbell = "VOXITW";
        var tye = 0;
        var baseurls =
          "http://www.smsintegra.com/" +
          "api/smsapi.aspx?uid=" +
          username +
          "&pwd=" +
          password +
          "&mobile=" +
          mobilno +
          "&msg=" +
          message +
          "&sid=" +
          dumbell +
          "&type=" +
          tye;
       
        requestss(baseurls, { json: true }, async (err, response, body) => {
           if (err) {
            return 
          }
          else{
          res.json({Status:"Success",Message:"OTP sent successfully! welcome to Healthz", Data : a ,Code:200});
              }
        });
        }
        });
});



router.post('/check_user_admin', function (req, res) {
        userdetailsModel.findOne({user_phone : req.body.user_phone},async function (err, Functiondetails) {
          if(Functiondetails == null){
         var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
          var result = '';
          for ( var i = 0; i < 7; i++ ) {
           result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
          }
       await userdetailsModel.create({
            first_name:  req.body.first_name || "",
            last_name : req.body.last_name || "",
            user_email : req.body.user_email || "",
            user_phone : req.body.user_phone || "",
            date_of_reg : req.body.date_of_reg || "",
            user_type : req.body.user_type,
            ref_code : req.body.ref_code || "",
            my_ref_code : result || "0000000",
            user_status : "complete",
            otp : 123456,
            profile_img : "",
            user_email_verification : req.body.user_email_verification || false,
            fb_token : "",
            device_id : "",
            device_type : "",
            mobile_type : req.body.mobile_type || "",
            delete_status : false
        }, 
        function (err, user) {
                    res.json({Status:"Success",Message:"New User", Data : user ,Code:200});
        });
          }else{
          res.json({Status:"Success",Message:"Old User", Data : Functiondetails ,Code:200});
          }
        });
});



router.post('/check_user', function (req, res) {
        userdetailsModel.findOne({user_phone : req.body.user_phone},async function (err, Functiondetails) {
          if(Functiondetails == null) {
            res.json({Status:"Success",Message:"New User", Data : Functiondetails ,Code:200});
          }
          else {
          res.json({Status:"Success",Message:"Old User", Data : Functiondetails ,Code:200});
          }
        });
});





router.get('/getlist', function (req, res) {
        userdetailsModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"User Details Details", Data : Functiondetails ,Code:200});
        });
});



router.get('/adminpanel/Dashboard/count',async function (req, res) {    
    let petloverdetails  =  await userdetailsModel.find({user_type:1});
    let doctordetails  =  await userdetailsModel.find({user_type:4});
    let sp  =  await userdetailsModel.find({user_type:2});
    let vendor  =  await userdetailsModel.find({user_type:3});
     let a  = {
       petloverdetails : petloverdetails,
       petloverdetails_count : petloverdetails.length,
       doctordetails : doctordetails,
       doctordetails_count : doctordetails.length,
       sp : sp,
       sp_count : sp.length,
       vendordetails : vendor,
       vendor_count : vendor.length
     } 
res.json({Status:"Success",Message:"Dashboard Details", Data : a ,Code:200});
});



router.post('/mobile/update/fb_token', function (req, res) {
        userdetailsModel.findByIdAndUpdate(req.body.user_id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
            // Test Key //
            let a  = {
              rzpkey : "rzp_test_zioohqmxDjJJtd",
              isproduction : false
            }
            // Live Key //
            // let a  = {
            //   rzpkey : "",
            //   isproduction : true
            // }
             res.json({Status:"Success",Message:"FB Updated", Data : UpdatedDetails, payment_gateway_detail:a,  Code:200});
        });
});


router.post('/mobile/update/profile', function (req, res) {
        userdetailsModel.findByIdAndUpdate(req.body.user_id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Profile Updated", Data : UpdatedDetails ,Code:200});
        });
});




router.post('/mobile/edit', function (req, res) {
        userdetailsModel.findByIdAndUpdate(req.body.user_id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"User Details Updated", Data : UpdatedDetails ,Code:200});
        });
});



router.post('/edit', function (req, res) {
        userdetailsModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"User Details Updated", Data : UpdatedDetails ,Code:200});
        });
});


router.get('/community_text', function (req, res) {
        let a = "Admit it – social media is a part of your daily life. Currently there are over 1.5 billion monthly Facebook users. Yes, you read that correctly. Billion. With social media platforms being such a big part of the average person’s life, it only makes sense that there are social media sites for pets! Over 75% of the US population considers their pets to be family. Combine this with social media user statistics, and you have a lot of people who care about their pets and making it known online! The perfect medium for pet loving social media users? The Pet Community! The Pet Community is a social network for pet owners. It’s a place where pet parents can share photos and videos of our pets with like minded individuals…without flooding our Facebook feed (although I have no shame in this)!";
        res.json({Status:"Success",Message:"community_text", Data : a ,Code:200});
});


// // DELETES A USER FROM THE DATABASE
router.post('/delete_by_phone',async function (req, res) {
      let phone  =  await userdetailsModel.findOne({user_phone : req.body.user_phone});
      if(phone == null){
          res.json({Status:"Failed",Message:"Already User Details Deleted successfully", Data : {} ,Code:200});
      }else{
         userdetailsModel.findByIdAndRemove(phone._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:phone.user_phone + " User Details Deleted successfully", Data : {} ,Code:200});
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



// router.post('/forms/create', function (req, res) {
//  console.log(req.body);
//   res.json({Status:"Failed",Message:"Referrel code not found",Data : {},Code:404});
// });




router.post('/forms/create',async function (req, res) {
  console.log("data in");
  var nodemailer = require('nodemailer');
  var transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: 'thinkinghatstech@gmail.com',
    pass: 'Pass@2021'
  }
});

var mailOptions = {
  from:req.body.form_email,
  to: 'carpeinfinitus@gmail.com',
  subject: "New Enquiry from Website",
  html: "There is a new Enquiry from the website.<br>Please find the details : <br> Name : "+req.body.form_name+"<br>Email : "+req.body.form_email+"<br>phone no : "+req.body.form_phone+"<br>Date : "+req.body.form_date+"<br>Booking Service : "+req.body.booking_service+"<br>Other Info : "+req.body.form_message+"" 
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
   console.log(error);
  } else {
   
    res.json({Status:"Success",Message:"OTP sent successfully",Data : {
    } , Code:200}); 

  }
});

    
});



// // DELETES A USER FROM THE DATABASE
router.post('/admin_delete', function (req, res) {
      userdetailsModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"User Details Deleted successfully", Data : {} ,Code:200});
      });
});


module.exports = router;
