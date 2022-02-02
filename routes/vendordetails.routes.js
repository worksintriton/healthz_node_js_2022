var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var dashboard_sp = require('./dashboard_sp.json');
var vendordetailsModel = require('./../models/vendordetailsModel');
var userdetailsModel = require('./../models/userdetailsModel');
var homebannerModel = require('./../models/homebannerModel');
var locationdetailsModel = require('./../models/locationdetailsModel');
var SP_specialationsMode = require('./../models/SP_servicesModel');
var SP_servicesMode = require('./../models/SP_servicesModel');
var GeoPoint = require('geopoint');
var doctor_specModel = require('./../models/sp_specModel');
var Sp_favModel = require('./../models/Sp_favModel');
var servicebannerModel = require('./../models/servicebannerModel');

router.post('/create', async function(req, res) {
  try{
        await vendordetailsModel.create({
            user_id:  req.body.user_id  || "",
            bus_user_name : req.body.bus_user_name || "",
            bus_user_email : req.body.bus_user_email || "",
            bussiness_name : req.body.bussiness_name || "",
            bus_user_phone : req.body.bus_user_phone || "",
            bus_service_list : req.body.bus_service_list || [],
            bus_spec_list : req.body.bus_spec_list || [],
            bus_service_gall : req.body.bus_service_gall || [],
            bus_profile : req.body.bus_profile || "",
            bus_proof : req.body.bus_proof || "",
            bus_certif : req.body.bus_certif || [],
            date_and_time : req.body.date_and_time || "",
            mobile_type : req.body.mobile_type || "",
            profile_status : req.body.profile_status || false,
            profile_verification_status : req.body.profile_verification_status || "",
            thumbnail_image : req.body.thumbnail_image || "",
            sp_loc : req.body.sp_loc || "",
            sp_lat : req.body.sp_lat || 0,
            sp_long : req.body.sp_long || 0,
            city_name : req.body.city_name || "",
            delete_status : false,
            calender_status : false,
            comments : 0,
            rating : 5,
            sp_info : req.body.sp_info,
        }, 
        function (err, user) {
     
        res.json({Status:"Success",Message:"“Thanks " + req.body.bussiness_name  + " your business details added successfully”", Data : user ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});



router.post('/mobile/dashboard',async function (req, res) {
 let userdetails  =  await userdetailsModel.findOne({_id:req.body.user_id});
 let location_details  =  await locationdetailsModel.find({user_id:req.body.user_id,default_status:true});
 let homebanner  =  await homebannerModel.find({delete_status : false});
    dashboard_sp.Banner_details = []
    for(let c = 0 ; c < homebanner.length; c ++){
       let gg = {
        '_id': homebanner[c]._id,
        'title' :  homebanner[c].img_title,
        'img_path' :  homebanner[c].img_path,
       }
      dashboard_sp.Banner_details.push(gg);
    }
 if(userdetails.user_type == 1){
    let a = {
    SOS : [{Number:9876543210},{Number:9876543211},{Number:9876543212},{Number:9876543214}],
    LocationDetails : location_details,
    userdetails : userdetails,
    Dashboarddata : dashboard_sp,
    messages : [
    // {'title':'Doctor','message':'Unable to find the doctor near your location can i show the doctor above the location'},
    // {'title':'Product','message':'Unable to find the Product near your location can i show the doctor above the location'},
    // {'title':'sercive','message':'Unable to find the Sercive near your location can i show the doctor above the location'}
    ]
  }
  res.json({Status:"Success",Message:"SP Dashboard Details", Data : a ,Code:200});
}else{
  res.json({Status:"Failed",Message:"Working on it !", Data : {},Code:404});
}
});


router.post('/mobile/service_cat',async function (req, res) {
 let location_details  =  await locationdetailsModel.findOne({user_id:req.body.user_id,default_status:true});
  let services_details  =  await SP_servicesMode.find({delete_status : false});
  var final_Data = [];
   for(let a = 0 ; a < services_details.length; a ++){
     let c = {
         "_id" : services_details[a]._id,
        "image": services_details[a].img_banner,
        "title": services_details[a].img_title,
        "sub_title": services_details[a].img_subtitle,
     }
     final_Data.push(c);
     if(a == services_details.length - 1 ){
      res.json({Status:"Success",Message:"Service Cat List", Data : final_Data ,Code:200});
     }
   }  
});








router.post('/mobile/servicedetails',async function (req, res) {
 console.log("service details",req.body);
        let banner = [];
        let doctor_banner  =  await servicebannerModel.find({});
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

 let location_details  =  await locationdetailsModel.findOne({user_id:req.body.user_id,default_status:true});
  var user_lat = location_details.location_lat;
  var user_long = location_details.location_long;
  let services_details  =  await SP_servicesMode.findOne({_id:req.body.cata_id});
  let vendordetailsModels  =  await vendordetailsModel.find({delete_status : false});
    var final_Data = [];
    let c = {
    Service_Details : {
      "_id": services_details._id,
      "image_path" :services_details.img_path,
      "title" : services_details.img_title,
      "count" : 0
     },
     Service_provider : []
    }
    if(vendordetailsModels.length == 0){
    res.json({Status:"Success",Message:"Service Provider List",alert_msg : "", Data : c ,banner :  banner,Code:200});
    }
   for(let x = 0 ; x < vendordetailsModels.length; x ++)
   {
    var point1 = new GeoPoint(+user_lat, +user_long);
    var point2 = new GeoPoint(+vendordetailsModels[x].sp_lat,+vendordetailsModels[x].sp_long);
    var distance = point1.distanceTo(point2, true)//output in kilometers
   if(req.body.Count_value_start == 0 && req.body.Count_value_end == 0 && req.body.review_count == 0){
    let service_prices = 0;
            for(let c = 0; c < vendordetailsModels[x].bus_service_list.length ; c ++){
              if(vendordetailsModels[x].bus_service_list[c].bus_service_list == services_details.img_title)
                {
                       service_prices = vendordetailsModels[x].bus_service_list[c].amount;     
                }   
      }
    if(req.body.distance == 0){
         if(distance < 2000){
         let c =  {
        "_id" : vendordetailsModels[x]._id,
        "image": vendordetailsModels[x].bus_service_gall[0].bus_service_gall,
        'thumbnail_image' : vendordetailsModels[x].thumbnail_image || 'http://54.212.108.156:3000/api/uploads/Pic_empty.jpg',
        "service_provider_name": vendordetailsModels[x].bussiness_name,
        "service_price": +service_prices,
        "service_offer": 0,
        "city_name" : vendordetailsModels[x].city_name || "",
        "bus_service_list" : vendordetailsModels[x].bus_service_list,
        "service_place":vendordetailsModels[x].sp_loc,
        "distance": +distance.toFixed(2),
         "rating_count" : +parseFloat(vendordetailsModels[x].rating).toFixed(0) || 5,
        "comments_count": vendordetailsModels[x].comments || 0,
       }
       if(service_prices !== 0){
        final_Data.push(c);
       }     
         }
    }
    else {
     let c =  {
        "_id" : vendordetailsModels[x]._id,
        "image": vendordetailsModels[x].bus_service_gall[0].bus_service_gall,
        "service_provider_name": vendordetailsModels[x].bussiness_name,
        'thumbnail_image' : vendordetailsModels[x].thumbnail_image || 'http://54.212.108.156:3000/api/uploads/Pic_empty.jpg',
        "service_price": +service_prices,
        "service_offer": 0,
        "city_name" : vendordetailsModels[x].city_name || "",
        "bus_service_list" : vendordetailsModels[x].bus_service_list,
        "service_place":vendordetailsModels[x].sp_loc,
        "distance": +distance.toFixed(2),
        "rating_count" : +parseFloat(vendordetailsModels[x].rating).toFixed(0) || 5,
        "comments_count": vendordetailsModels[x].comments || 0,
      }
      if(service_prices !== 0){
        final_Data.push(c);
       } 
    }
     if(x == vendordetailsModels.length - 1 ){
      // res.json({Status:"Success",Message:"Service Cat List", Data : final_Data ,Code:200});
   let a = {
    Service_Details : {
      "_id": services_details._id,
      "image_path" :services_details.img_path,
      "title" : services_details.img_title,
      "count" : 0
     },
     Service_provider : final_Data
   }
   if(req.body.distance == 1){

    if(a.Service_provider.length == 0){
    res.json({Status:"Failed",Message:"Service Provider List",alert_msg : "No records found. Expanding search.", Data : a ,banner : banner,Code:404});
    }else{
             res.json({Status:"Success",Message:"Service Provider List",alert_msg : "No records found. Expanding search.", Data : a ,banner : banner,Code:200});
    }
   }else{
       res.json({Status:"Success",Message:"Service Provider List",alert_msg : "No records found. Expanding search.", Data : a ,banner : banner,Code:200});
   }
     }
   }
   else
   { 
  if(req.body.distance == 0){
         if(distance < 2000){
          console.log("xxxxx",vendordetailsModels);
           let service_prices = 0;
            for(let c = 0; c < vendordetailsModels[x].bus_service_list.length ; c ++){
              if(vendordetailsModels[x].bus_service_list[c].bus_service_list == services_details.img_title)
                {
                       service_prices = vendordetailsModels[x].bus_service_list[c].amount;     
                }   
            }
          if(service_prices >= req.body.Count_value_start && service_prices <= req.body.Count_value_end)
           {
      let c =  {
        "_id" : vendordetailsModels[x]._id,
        "image": vendordetailsModels[x].bus_service_gall[0].bus_service_gall,
        "service_provider_name": vendordetailsModels[x].bussiness_name,
        'thumbnail_image' : vendordetailsModels[x].thumbnail_image || 'http://54.212.108.156:3000/api/uploads/Pic_empty.jpg',
        "service_price": +service_prices,
        "city_name" : vendordetailsModels[x].city_name || "",
        "service_offer": 0,
        "bus_service_list" : vendordetailsModels[x].bus_service_list,
        "service_place":vendordetailsModels[x].sp_loc,
        "distance": +distance.toFixed(2),
        "rating_count" : +parseFloat(vendordetailsModels[x].rating).toFixed(0) || 5,
        "comments_count": vendordetailsModels[x].comments || 0,
      }
     if(service_prices !== 0){
        final_Data.push(c);
       } 
           }        
         }
    }
    else {
       let service_prices = 0;
            for(let c = 0; c < vendordetailsModels[x].bus_service_list.length ; c ++){
              if(vendordetailsModels[x].bus_service_list[c].bus_service_list == services_details.img_title)
                {
                       service_prices = vendordetailsModels[x].bus_service_list[c].amount;     
                }   
            }
            console.log("service_prices",service_prices);
          if(service_prices >= req.body.Count_value_start && service_prices <= req.body.Count_value_end)
           {
      let c =  {
        "_id" : vendordetailsModels[x]._id,
        "image": vendordetailsModels[x].bus_service_gall[0].bus_service_gall,
        "service_provider_name": vendordetailsModels[x].bussiness_name,
        'thumbnail_image' : vendordetailsModels[x].thumbnail_image || 'http://54.212.108.156:3000/api/uploads/Pic_empty.jpg',
        "service_price": +service_prices,
        "bus_service_list" : vendordetailsModels[x].bus_service_list,
        "city_name" : vendordetailsModels[x].city_name,
        "service_offer": 0,
        "service_place":vendordetailsModels[x].sp_loc,
        "distance": +distance.toFixed(2),
        "rating_count" : +parseFloat(vendordetailsModels[x].rating).toFixed(0) || 5,
        "comments_count": vendordetailsModels[x].comments || 0,
      }
     if(service_prices !== 0){
        final_Data.push(c);
       } 
           }
    }
     if(x == vendordetailsModels.length - 1 ){
      console.log("Data1");
      console.log(final_Data);
      if(final_Data.length == 0){
     var star_count_filter_data = [];
   let a = {
    Service_Details : {
      "_id": services_details._id,
      "image_path" :services_details.img_path,
      "title" : services_details.img_title,
      "count" : 0
     },
     Service_provider : star_count_filter_data
   }
   if(a.Service_provider.length == 0){
    res.json({Status:"Failed",Message:"Service Provider List",alert_msg : "No records found. Expanding search.", Data : a ,banner:banner,Code:404});
   }else{
    res.json({Status:"Success",Message:"Service Provider List",alert_msg : "No records found. Expanding search.", Data : a ,banner : banner,Code:200});
   }
      }else{
     var star_count_filter_data = [];
              for(let t = 0 ; t < final_Data.length ; t++){
                console.log(final_Data[t].rating_count,req.body.review_count);
                 if(final_Data[t].rating_count <= req.body.review_count){
                        star_count_filter_data.push(final_Data[t]);
                 }                  
                 if(t == final_Data.length - 1){
   let a = {
    Service_Details : {
      "_id": services_details._id,
      "image_path" :services_details.img_path,
      "title" : services_details.img_title,
      "count" : 0
     },
     Service_provider : star_count_filter_data
   }
   if(a.Service_provider.length == 0){
    res.json({Status:"Failed",Message:"Service Provider List",alert_msg : "No records found. Expanding search.", Data : a ,banner:banner,Code:404});
   }else{
    res.json({Status:"Success",Message:"Service Provider List",alert_msg : "No records found. Expanding search.", Data : a ,banner : banner,Code:200});
   }

                 }
      }


      }


    }

   }
     
   }
});



router.post('/filter_date', function (req, res) {
        vendordetailsModel.find({delete_status : false}, function (err, StateList) {
          var final_Date = [];
          for(let a = 0; a < StateList.length; a ++){
            var fromdate = new Date(req.body.fromdate);
            var todate = new Date(req.body.todate);
            var checkdate = new Date(StateList[a].createdAt);
           
            if(checkdate >= fromdate && checkdate <= todate){
              final_Date.push(StateList[a]);
            }
            if(a == StateList.length - 1){
              res.json({Status:"Success",Message:"vendordetailsModel screen  List", Data : final_Date ,Code:200});
            }
          }
        });
});


router.get('/filter_price_list', function (req, res) {
  let a = [
    {
      "Display_text":"Under Rs.500",
      "Count_value_start" : 0,
      "Count_value_end" : 500,
    },
    {
      "Display_text":"Rs. 500 - Rs. 1,000",
      "Count_value_start" : 500,
      "Count_value_end" : 1000,
    },
    {
      "Display_text":"Rs. 1,000 - Rs. 2,000",
      "Count_value_start" : 1000,
      "Count_value_end" : 2000,
    },
    {
      "Display_text":"Rs. 2,000 - Rs. 3,000",
      "Count_value_start" : 2000,
      "Count_value_end" : 3000,
    },
    {
      "Display_text":"Rs. 3,000 - Above",
      "Count_value_start" : 3000,
      "Count_value_end" : 1000000,
    }
  ]
 res.json({Status:"Success",Message:"SP filter price list", Data : a ,Code:200});          
});



router.get('/deletes', function (req, res) {
      vendordetailsModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"User type Deleted", Data : {} ,Code:200});     
      });
});



router.get('/calendar_timelist', function (req, res) {
  let a = {
    morning_time_list : [
     {
      "time" : "12:00 AM"
     },
     {
      "time" : "01:00 AM"
     },
     {
      "time" : "02:00 AM"
     },
     {
      "time" : "03:00 AM"
     },
     {
      "time" : "04:00 AM"
     },
     {
      "time" : "05:00 AM"
     },
     {
      "time" : "06:00 AM"
     },
     {
      "time" : "07:00 AM"
     },
     {
      "time" : "08:00 AM"
     },
     {
      "time" : "09:00 AM"
     },
     {
      "time" : "10:00 AM"
     },
     {
      "time" : "11:00 AM"
     }
    ],
    evening_time_list : [{
      "time" : "12:00 PM"
     },
     {
      "time" : "01:00 PM"
     },
     {
      "time" : "02:00 PM"
     },
     {
      "time" : "03:00 PM"
     },
     {
      "time" : "04:00 PM"
     },
     {
      "time" : "05:00 PM"
     },
     {
      "time" : "06:00 PM"
     },
     {
      "time" : "07:00 PM"
     },
     {
      "time" : "08:00 PM"
     },
     {
      "time" : "09:00 PM"
     },
     {
      "time" : "10:00 PM"
     },
     {
      "time" : "11:00 PM"
     }],
  }
  res.json({Status:"Success",Message:"calendar time List", Data : a ,Code:200});
        
});



router.post('/getlist_id', function (req, res) {
        vendordetailsModel.findOne({user_id:req.body.user_id}, function (err, StateList) {
          res.json({Status:"Success",Message:"Service provider details", Data : StateList ,Code:200});
        }).populate('user_id');
});

router.post('/mobile/sp_fetch_by_id',async function (req, res) {
    let services_details  =  await SP_servicesMode.findOne({_id:req.body.cata_id,delete_status : false});
    let Details = {
      "_id": services_details._id,
      "image_path" : services_details.img_path,
      "title" : services_details.img_title,
      "count" : 0,
      "amount" : 200,
      "time" : "15 mins"
     }
      vendordetailsModel.findOne({_id:req.body.sp_id},async function (err, StateList) {
      for(let c = 0 ; c < StateList.bus_service_list.length ; c ++){
         if(StateList.bus_service_list[c].bus_service_list ==  Details.title){
          Details.amount = StateList.bus_service_list[c].amount;
         }
      }
      var pro_fav = await Sp_favModel.findOne({user_id:req.body.user_id,sp_id:StateList._id,delete_status : false});
        var temp_fav = false;
        if(pro_fav !==  null){
               temp_fav = true;
        }
        console.log("888888888888",StateList)
       let a =  {
        "bus_service_list": StateList.bus_service_list,
        "bus_spec_list":  StateList.bus_spec_list,
        "bus_service_gall":  StateList.bus_service_gall,
        "bus_certif": StateList.bus_certif,
        "_id":  StateList._id,
        "user_id":  StateList.user_id,
        "bus_user_name":  StateList.bus_user_name,
        "bus_user_email":  StateList.bus_user_email,
        "bussiness_name": StateList.bussiness_name,
        "bus_user_phone": StateList.bus_user_phone,
        "bus_profile": StateList.bus_profile,
        "bus_proof": StateList.bus_proof,
        "date_and_time": StateList.date_and_time,
        "mobile_type": StateList.mobile_type,
        "profile_status": StateList.profile_status,
        "profile_verification_status": StateList.profile_verification_status,
        "sp_loc": StateList.sp_loc,
        "sp_lat": StateList.sp_lat,
        "sp_long": StateList.sp_long,
        "delete_status":StateList.delete_status,
        "updatedAt": StateList.updatedAt,
        "createdAt":StateList.createdAt,
        "__v": StateList.__v,
        "distance": 0 ,
        "rating" : +parseFloat(StateList.rating).toFixed(0) || 5,
        "comments" : +StateList.comments || 0,
        "fav" : temp_fav
    }
          res.json({Status:"Success",Message:"SP Details", Data : a, Details : Details ,Code:200});
        });
});

router.get('/getlist', function (req, res) {
        vendordetailsModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"SP Details", Data : Functiondetails ,Code:200});
        });
});


router.get('/getlist_sp_id', function (req, res) {
        vendordetailsModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"SP Details", Data : Functiondetails ,Code:200});
        }).populate('user_id');
})



router.get('/sp_dropdown',async function (req, res) {


var doctor_specModel = require('./../models/sp_specModel');

   let Specialization_list  =  await doctor_specModel.find({delete_status : false});
   let SP_specialationsModess  =  await SP_specialationsMode.find({delete_status : false});
   var service_list = [];
   var Specialization = [];
   for(let a = 0 ; a < SP_specialationsModess.length ; a ++ ){
        let t = {"service_list":SP_specialationsModess[a].img_title}
        service_list.push(t);
   }

    for(let b = 0 ; b < Specialization_list.length ; b ++ ){
        let t = {"Specialization":Specialization_list[b].specialzation}
        Specialization.push(t);
    }
   // var service_list = [
   // {
   //  "service_list":"Service - 1"
   // },
   // {
   //  "service_list":"Service - 2"
   // },
   // {
   //  "service_list":"Service - 3"
   // },
   // {
   //  "service_list":"Service - 4"
   // },
   // {
   //  "service_list":"Service - 5"
   // },
   // {
   //  "service_list":"Service - 6"
   // }
   // ];
   //  var Specialization = [
   // {
   //  "Specialization":"Kennel Cut"
   // },
   // {
   //  "Specialization":"Teddy Bear Trim"
   // },
   // {
   //  "Specialization":"Breed Trims"
   // },
   // {
   //  "Specialization":"Full Coat / Show Trims"
   // },
   // ];
   var times = [
   {
    "time":"15 mins"
   },
   {
    "time":"30 mins"
   },
   {
    "time":"45 mins"
   },
   {
    "time":"1 hrs"
   },
   {
    "time":"2 hrs"
   },
   {
    "time":"3 hrs"
   }
   ];

   let c = 
    {
      "service_list" :service_list,
      "Specialization" : Specialization,
      "time" : times
    }
   
  res.json({Status:"Success",Message:"SP dropdown List", Data : c ,Code:200});
});


router.post('/check_status', function (req, res) {
        vendordetailsModel.findOne({user_id:req.body.user_id}, function (err, StateList) {
         
          let message = "Dear Service Provider, We appreciate your interest and look forward to have you as part of Healthz Team. Our team is reviewing your profile and will get in touch with you to close the formalities. Your profile is pending verification.";
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
          }else {
            res.json({Status:"Success",Message:"Service Provider Status", Data : dd ,Code:200});
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
          } else if(dd.calender_status == 0) {
              res.json({Status:"Success",Message:"Service Provider Calendor not updated", Data : dd ,Code:200});
          } else {
            res.json({Status:"Success",Message:"Service Provider Status", Data : dd ,Code:200});
          }
        }
        });
});


router.get('/mobile/getlist', function (req, res) {
        vendordetailsModel.find({}, function (err, Functiondetails) {
          let a = {
            usertypedata : Functiondetails
          }
          res.json({Status:"Success",Message:"User type Details", Data : a ,Code:200});
        });
});

router.post('/edit', function (req, res) {
        vendordetailsModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Service Provider Updated", Data : UpdatedDetails ,Code:200});
        });
});

router.post('/delete', function (req, res) {
 let c = {
    delete_status : true
  }
  vendordetailsModel.findByIdAndUpdate(req.body._id, c, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Location Deleted successfully", Data : UpdatedDetails ,Code:200});
  });
});




// // DELETES A USER FROM THE DATABASE
router.post('/admin_delete', function (req, res) {
      vendordetailsModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"User type Deleted successfully", Data : {} ,Code:200});
      });
});


module.exports = router;
