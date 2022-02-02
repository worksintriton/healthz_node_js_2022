
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var notificationModel = require('./../models/notificationModel');
var userdetailsModel = require('./../models/userdetailsModel');
var AppointmentsModel = require('./../models/AppointmentsModel');
var SP_appointmentsModels = require('./../models/SP_appointmentsModels');


router.post('/create', async function(req, res) {
  console.log(req.body);
  try{
        await notificationModel.create({
            user_id:  req.body.user_id,
            notify_title : req.body.notify_title,
            notify_descri : req.body.notify_descri,
            notify_img : "http://35.164.43.170:3000/api/uploads/1629809356957.png",
            notify_time : "",
            date_and_time : req.body.date_and_time,
            delete_status : false
        }, 
        function (err, user) {
          console.log(user)
        res.json({Status:"Success",Message:"Notification Added successfully", Data : user ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});


router.post('/filter_date', function (req, res) {
        notificationModel.find({}, function (err, StateList) {
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



router.post('/mobile/alert/notification',async function (req, res) {
       var Appointment_details = await AppointmentsModel.findOne({appointment_UID:req.body.appointment_UID}).populate('user_id doctor_id family_id');
       console.log("Alert Request",req.body);
       console.log(Appointment_details);
       var appointment_id = Appointment_details.family_id.name;
       var title  = '';
       var subtitle = '';
       var msg = '';
       var date = req.body.date;
       var data_type = {};
       if(req.body.status == "Payment Failed"){
       title = "Payment Failed";
       subtitle = "Payment Failed";
       body = "There was an error processing your appointment. Please try again";
       data_type = {
       "usertype":"1",
       "appintments":"",
       "orders":""
        };


       sendnotify(req.body.user_id,title,body,subtitle,date,data_type);
       } 
       else if(req.body.status == "Patient Appointment Cancelled"){
       appointmetitle = "You Cancelled an Appointment";
       doc_subtitle = "One of Your Appointment is Cancelled";
       doc_body = "Your Appointment with "+appointment_id+" at "+date+" is cancelled.";
       pet_subtitle = "You Cancelled an Appointment";
       pet_body = "You Have Cancelled the Appointment for  "+appointment_id+" at "+date;
       data_type1 = {
       "usertype":"1",
       "appintments":"Missed",
       "orders":""
        };

        data_type2 = {
       "usertype":"4",
       "appintments":"Missed",
       "orders":""
        };



       sendnotify(req.body.user_id,title,pet_body,pet_subtitle,date,data_type1);
       sendnotify(req.body.doctor_id,title,doc_body,doc_subtitle,date,data_type2);
       } 
       else if(req.body.status == "Doctor Appointment Cancelled"){
       title = "Your Appointment Has Been Cancelled";
       doc_subtitle = "You Cancelled an Appointment";
       doc_body = "You have Cancelled the Appointment with "+appointment_id+" at "+date;
       pet_subtitle = "Your Appointment Has Been Cancelled";
       pet_body = "Doctor Cancelled the appointment of "+appointment_id+" at "+date;
       data_type1 = {
       "usertype":"1",
       "appintments":"Missed",
       "orders":""
        };
        data_type2 = {
       "usertype":"4",
       "appintments":"Missed",
       "orders":""
        };

       sendnotify(req.body.user_id,title,pet_body,pet_subtitle,date,data_type1);
       sendnotify(req.body.doctor_id,title,doc_body,doc_subtitle,date,data_type2);
       } 
       else if(req.body.status == "No show"){
       title = "We Understand You Are Busy";
       doc_subtitle = "We Understand You Are Busy";
       doc_body = "You have Missed the Appointment of your "+appointment_id+" at "+date;
       pet_subtitle = "A Pet Missed Your Care";
       pet_body = "In this Busy Day, You Missed an Appointment with "+appointment_id+" at "+date;
       data_type1 = {
       "usertype":"1",
       "appintments":"Missed",
       "orders":""
        };

       data_type2 = {
       "usertype":"4",
       "appintments":"Missed",
       "orders":""
        };

       sendnotify(req.body.user_id,title,pet_body,pet_subtitle,date,data_type1);
       sendnotify(req.body.doctor_id,title,doc_body,doc_subtitle,date,data_type4);

       }


       else if(req.body.status == "Patient Not Available"){
       title = "We Understand You Are Busy";
       pet_subtitle  = "We Understand You Are Busy";
       pet_body  = "You have Missed the Appointment of your "+appointment_id+" at "+date;
       doc_subtitle = "A Pet Missed Your Care";
       doc_body = "In this Busy Day, You Missed an Appointment with "+appointment_id+" at "+date;
       data_type1 = {
       "usertype":"1",
       "appintments":"Missed",
       "orders":""
        };

       data_type2 = {
       "usertype":"4",
       "appintments":"Missed",
       "orders":""
        };

       sendnotify(req.body.user_id,title,pet_body,pet_subtitle,date,data_type1);
       sendnotify(req.body.doctor_id,title,doc_body,doc_subtitle,date,data_type2);

       }


       else if(req.body.status == "Appointment Remainder"){
       title = "You Have a Doctor Appointmentment";
       doc_subtitle = "Upcoming Appointment";
       doc_body = "You have an appointment with "+appointment_id+" at "+date;
       pet_subtitle = "You Have a Doctor Appointmentment";
       pet_body = "You have an appointment for your pet "+appointment_id+" at "+date;
       data_type1 = {
       "usertype":"1",
       "appintments":"New",
       "orders":""
        };

       data_type2 = {
       "usertype":"4",
       "appintments":"New",
       "orders":""
        };


       sendnotify(req.body.user_id,title,pet_body,pet_subtitle,date,data_type1);
       sendnotify(req.body.doctor_id,title,doc_body,doc_subtitle,date,data_type2);

       }

        else if(req.body.status == "Appointment Completed"){
       title = "Appointment Completed";
       doc_subtitle = "Appointment Completed";
       doc_body = "You have Completed the appointment of "+appointment_id+" at "+date;
       pet_subtitle = "Appointment Completed";
       pet_body = "You have Completed the appointment of "+appointment_id+" at "+date;
       data_type1 = {
       "usertype":"1",
       "appintments":"Completed",
       "orders":""
        };

       data_type2 = {
       "usertype":"4",
       "appintments":"Completed",
       "orders":""
        };


       sendnotify(req.body.user_id,title,pet_body,pet_subtitle,date,data_type1);
       sendnotify(req.body.doctor_id,title,doc_body,doc_subtitle,date,data_type2);

       }
async function sendnotify(user_id,title1,body1,subtitle1,datetime1,data_type) {


let phone  =  await userdetailsModel.findOne({_id:user_id});

  var user_id = user_id; 
  var title1 = title1;
  var body1 = body1;
  var subtitle1 = subtitle1;
  var datetime1 = datetime1;
  var data_type = data_type;



 // userdetailsModel.findOne({_id:user_id},async function (err, phone) {
          // res.json({Status:"Success",Message:"Notification Details", Data : phone ,Code:200});
// console.log(phone);
const headers = {
 'Authorization': 'key=AAAAYMyisds:APA91bG589xvVYxUCdpF0qBvj_ktDtUvqgpM-TcmhN49uQK9a_JUmLqKHpos_x02exZh8z1ZCyiWm0o78ImcmhDf4L5mLlw5K2FXB1X_WCLXpte0XQhOhu4NiwE68vEgQ7z931OB_Bdw',
 'Content-Type': 'application/json'
}
     // Set the message as high priority and have it expire after 24 hours.
        var options = {
          priority: "high",
          timeToLive: 60 * 60 * 24
        };
          var request1 = require("request");
           // firebase url
        var myURL1 = "https://fcm.googleapis.com/fcm/send";
        var body1 = {
          to: phone.fb_token,
          notification: {
            title: subtitle1,
            body: body1,
            // subtitle: subtitle1,
            sound: "default"
          },
          data : data_type
        };
        console.log(body1);
         request1.post(
            {
              url: myURL1,
              method: "POST",
              headers,
              body: body1,
              options,
              json: true
            }, function(error, response, body1) {
              if (error) {
                return res.json(
                  _.merge(
                    {
                      error: error
                    },
                    utils.errors["500"]
                  )
                );
              }else {
                console.log(response.body);
                console.log("Firebase Send");
              }
            });

  try{
        await notificationModel.create({
            user_id:  phone._id,
            notify_title : subtitle1,
            notify_descri : body1.notification.body,
            notify_img : "http://35.164.43.170:3000/api/uploads/1629809356957.png",
            notify_time : datetime1,
            date_and_time : datetime1,
            delete_status : false
        }, 
        function (err, user) {
          console.log(user)
          console.log(err)

        // res.json({Status:"Success",Message:"Notification Added successfully", Data : user ,Code:200}); 
        });
}catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}

// });

}
 res.json({Status:"Success",Message:"Notification Send successfully", Data : {} ,Code:200}); 
});





router.post('/mobile/alert/sp_notification',async function (req, res) {
  var Appointment_details = await SP_appointmentsModels.findOne({appointment_UID:req.body.appointment_UID}).populate('user_id sp_id family_id');
  console.log("SP Notification",Appointment_details);
  var appointment_id = Appointment_details.family_id.name;
  var data_type = {};
  console.log("sp_notification",req.body);
       // var appointment_id = req.body.appointment_UID;
       var title  = '';
       var subtitle = '';
       var msg = '';
       var date = req.body.date;
       if(req.body.status == "Payment Failed"){
       title = "Payment Failed";
       subtitle = "Payment Failed";
       body = "There was an error processing your appointment. Please try again"
       sendnotify(req.body.user_id,title,body,subtitle,date,data_type);
       } 
       else if(req.body.status == "Patient Appointment Cancelled"){
       appointmetitle = "You Cancelled an Appointment";
       doc_subtitle = "An Unexpected Break for You";
       doc_body = "Your Booking Has Been Cancelled with "+appointment_id+" at "+date;
       pet_subtitle = "You Cancelled an Appointment";
       pet_body = "You Have Cancelled the Appointment with  "+Appointment_details.sp_business_info[0].bussiness_name+" at "+date;


        data_type1 = {
       "usertype":"1",
       "appintments":"Missed",
       "orders":""
        };
        data_type2 = {
       "usertype":"2",
       "appintments":"Missed",
       "orders":""
        };



       sendnotify(req.body.user_id,title,pet_body,pet_subtitle,date,data_type1);
       sendnotify(req.body.sp_id,title,doc_body,doc_subtitle,date,data_type2);
       } 
       else if(req.body.status == "Doctor Appointment Cancelled"){
       title = "Appointment Cancelled";
       doc_subtitle = "Appointment Cancelled";
       doc_body = "You have Cancelled the Appointment with "+appointment_id+" at "+date;
       pet_subtitle = "Choose a Different Service Provider for Your Pet";
       pet_body = "SP Cancelled the appointment for Your "+appointment_id+" at "+date;

        data_type1 = {
       "usertype":"1",
       "appintments":"Missed",
       "orders":""
        };
        data_type2 = {
       "usertype":"2",
       "appintments":"Missed",
       "orders":""
        };


       sendnotify(req.body.user_id,title,pet_body,pet_subtitle,date,data_type1);
       sendnotify(req.body.sp_id,title,doc_body,doc_subtitle,date,data_type2);
       } 
       else if(req.body.status == "No show"){

       title = "Appointment Missed";
       doc_subtitle = "Appointment Missed";
       doc_body = "You have missed the appointment of "+appointment_id+" at "+date;
       pet_subtitle = "Appointment Missed";
       pet_body = "You have missed the appointment of "+appointment_id+" at "+date;

        data_type1 = {
       "usertype":"1",
       "appintments":"Missed",
       "orders":""
        };

       data_type2 = {
       "usertype":"2",
       "appintments":"Missed",
       "orders":""
        };

       sendnotify(req.body.user_id,title,pet_body,pet_subtitle,date,data_type1);
       sendnotify(req.body.sp_id,title,doc_body,doc_subtitle,date,data_type2);

       }


       else if(req.body.status == "Appointment Remainder"){
       title = "Appointment Remainder";
       doc_subtitle = "Appointment Remainder";
       doc_body = "You have an appointment of "+appointment_id+" at "+date;
       pet_subtitle = "Appointment Remainder";
       pet_body = "You have an appointment of "+appointment_id+" at "+date;


       data_type1 = {
       "usertype":"1",
       "appintments":"New",
       "orders":""
        };

       data_type2 = {
       "usertype":"2",
       "appintments":"New",
       "orders":""
        };


       sendnotify(req.body.user_id,title,pet_body,pet_subtitle,date,data_type1);
       sendnotify(req.body.sp_id,title,doc_body,doc_subtitle,date,data_type2);

       }

       else if(req.body.status == "Appointment Completed"){
       title = "Appointment Completed";
       doc_subtitle = "Appointment Completed";
       doc_body = "You have Successfully Completed the Appointment with "+appointment_id;
       pet_subtitle = "Appointment Completed Successfully";
       pet_body = "Your Appointment with "+Appointment_details.sp_business_info[0].bussiness_name+" Has Been Completed Successfully ";

        data_type1 = {
       "usertype":"1",
       "appintments":"Completed",
       "orders":""
        };

       data_type2 = {
       "usertype":"2",
       "appintments":"Completed",
       "orders":""
        };


       sendnotify(req.body.user_id,title,pet_body,pet_subtitle,date,data_type1);
       sendnotify(req.body.sp_id,title,doc_body,doc_subtitle,date,data_type2);

       }
       
async function sendnotify(user_id,title1,body1,subtitle1,datetime1,data_type) {
  console.log(user_id,title1,body1,subtitle1,datetime1);

let phone  =  await userdetailsModel.findOne({_id:user_id});

  var user_id = user_id; 
  var title1 = title1;
  var body1 = body1;
  var subtitle1 = subtitle1;
  var datetime1 = datetime1;
  var data_type = data_type;


 // userdetailsModel.findOne({_id:user_id},async function (err, phone) {
          // res.json({Status:"Success",Message:"Notification Details", Data : phone ,Code:200});
// console.log(phone);
const headers = {
 'Authorization': 'key=',
 'Content-Type': 'application/json'
}
     // Set the message as high priority and have it expire after 24 hours.
        var options = {
          priority: "high",
          timeToLive: 60 * 60 * 24
        };
          var request1 = require("request");
           // firebase url
        var myURL1 = "https://fcm.googleapis.com/fcm/send";
        var body1 = {
          to: phone.fb_token,
          notification: {
            title: title1,
            body: body1,
            // subtitle: subtitle1,
            sound: "default"
          },
          data : data_type
        };
        console.log(body1);
         request1.post(
            {
              url: myURL1,
              method: "POST",
              headers,
              body: body1,
              options,
              json: true
            }, function(error, response, body1) {
              if (error) {
                return res.json(
                  _.merge(
                    {
                      error: error
                    },
                    utils.errors["500"]
                  )
                );
              }else {
                console.log(response.body);
                console.log("Firebase Send");
              }
            });

  try{
        await notificationModel.create({
            user_id:  phone._id,
            notify_title : subtitle1,
            notify_descri : body1.notification.body,
            notify_img : "http://35.164.43.170:3000/api/uploads/1629809356957.png",
            notify_time : datetime1,
            date_and_time : datetime1,
             delete_status : false
        }, 
        function (err, user) {
          console.log(user)
        // res.json({Status:"Success",Message:"Notification Added successfully", Data : user ,Code:200}); 
        });
}catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}

// });

}
 res.json({Status:"Success",Message:"Notification Send successfully", Data : {} ,Code:200}); 
});




router.post('/admin_send_notification', function (req, res) {
  res.json({Status:"Success",Message:"Notification Send successfully", Data : '' ,Code:200});
});


router.post('/sendnotification_doc_start', async function(req, res) {
   let phone  =  await userdetailsModel.findOne({_id:req.body.user_id});
     const headers = {
 'Authorization': 'key=AAAAcrNOA3s:APA91bFsNJdceZbPYvpCEjyHIcSzKzHEZLt3tNydLbM_GhsvAImASRpMtq-Md-n5cpB-dMe97IxgaI-NOjow5YIuQY87wKllZAweDOy8PAfjF--7e7BsgQJHbnxVM72Gu_L8Zm85ylXn',
 'Content-Type': 'application/json'
}
     // Set the message as high priority and have it expire after 24 hours.
        var options = {
          priority: "high",
          timeToLive: 60 * 60 * 24
        };
          var request1 = require("request");
           // firebase url
        var myURL1 = "https://fcm.googleapis.com/fcm/send";
        var body1 = {
          to: phone.user_token,
          notification: {
            title: "Appointment Startard....",
            body: "Doctor Start the appointment, waiting for you",
            // subtitle: "Appointment Startard....",
            sound: "default"
          }
        };
         request1.post(
            {
              url: myURL1,
              method: "POST",
              headers,
              body: body1,
              options,
              json: true
            }, function(error, response, body1) {
              if (error) {
                return res.json(
                  _.merge(
                    {
                      error: error
                    },
                    utils.errors["500"]
                  )
                );
              }else {
                console.log(response.body);
                console.log("Firebase Send");
              }
            });

  try{
        await notificationModel.create({
            user_id:  req.body.user_id,
            notify_title : "Appointment",
            notify_descri : "Doctor Start the appointment, waiting for you",
            notify_img : "http://35.164.43.170:3000/api/uploads/1629809356957.png",
            notify_time : "",
            date_and_time : req.body.date_and_time,
             delete_status : false
        }, 
        function (err, user) {
          console.log(user)
        res.json({Status:"Success",Message:"Notification Added successfully", Data : user ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});




router.post('/send_notifiation', async function(req, res) {
  console.log("Notification Send Request", req.body);
     const headers = {
 'Authorization': 'key=AAAAcrNOA3s:APA91bFsNJdceZbPYvpCEjyHIcSzKzHEZLt3tNydLbM_GhsvAImASRpMtq-Md-n5cpB-dMe97IxgaI-NOjow5YIuQY87wKllZAweDOy8PAfjF--7e7BsgQJHbnxVM72Gu_L8Zm85ylXn',
 'Content-Type': 'application/json'
}
     // Set the message as high priority and have it expire after 24 hours.
        var options = {
          priority: "high",
          timeToLive: 60 * 60 * 24
        };
          var request1 = require("request");
           // firebase url
        var myURL1 = "https://fcm.googleapis.com/fcm/send";
        var body1 = {
          to: req.body.user_token,
          notification: {
            title: req.body.notify_title,
            body: req.body.notify_descri,
            // subtitle: req.body.notify_title,
            sound: "default"
          },
          data : req.body.data_type
        };
         request1.post(
            {
              url: myURL1,
              method: "POST",
              headers,
              body: body1,
              options,
              json: true
            }, function(error, response, body1) {
              if (error) {
                return res.json(
                  _.merge(
                    {
                      error: error
                    },
                    utils.errors["500"]
                  )
                );
              }else {
              	console.log(response.body);
                console.log("Firebase Send");
              }
            });

  try{
        await notificationModel.create({
            user_id:  req.body.user_id,
            notify_title : req.body.notify_title,
            notify_descri : req.body.notify_descri,
            notify_img : "http://35.164.43.170:3000/api/uploads/1629809356957.png",
            notify_time : "",
            date_and_time : req.body.date_and_time,
             delete_status : false
        }, 
        function (err, user) {
          console.log(user)
        res.json({Status:"Success",Message:"Notification Added successfully", Data : user ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});



router.get('/deletes', function (req, res) {
      notificationModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"Notification Deleted", Data : {} ,Code:200});     
      });
});


router.post('/mobile/getlist_id', function (req, res) {
        notificationModel.find({user_id:req.body.user_id}, function (err, StateList) {
             StateList.sort(function compare(a, b) {
               var dateA = new Date(a.updatedAt);
               var dateB = new Date(b.updatedAt);
               return dateB - dateA;
               });
          res.json({Status:"Success",Message:"Notification List", Data : StateList ,Code:200});
        });
});



router.get('/getlist', function (req, res) {
        notificationModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Notification Details", Data : Functiondetails ,Code:200});
        });
});


router.post('/mark_readed', function (req, res) {
        notificationModel.find({user_id:req.body.user_id,delete_status : false},async function (err, Functiondetails) {
         if(Functiondetails.length == 0){
            res.json({Status:"Success",Message:"Notification Marked Readed", Data : {} ,Code:200});
         }else {
         for(let a = 0 ; a < Functiondetails.length ; a ++){
  let c = {
    delete_status : true
  }
  notificationModel.findByIdAndUpdate(Functiondetails[a]._id, c, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             // res.json({Status:"Success",Message:"Location Deleted successfully", Data : UpdatedDetails ,Code:200});
  });
         if(a == Functiondetails.length - 1){
           res.json({Status:"Success",Message:"Notification Details", Data : {} ,Code:200});
         }
         }
         }
        });
});


router.get('/mobile/getlist', function (req, res) {
        notificationModel.find({}, function (err, Functiondetails) {
          let a = {
            usertypedata : Functiondetails
          }
          res.json({Status:"Success",Message:"Notification Details", Data : a ,Code:200});
        });
});

router.post('/edit', function (req, res) {
        notificationModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Notification Updated", Data : UpdatedDetails ,Code:200});
        });
});


router.post('/delete', function (req, res) {
 let c = {
    delete_status : true
  }
  notificationModel.findByIdAndUpdate(req.body._id, c, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Location Deleted successfully", Data : UpdatedDetails ,Code:200});
  });
});

// // DELETES A USER FROM THE DATABASE
router.post('/admin_delete', function (req, res) {
      notificationModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Notification Deleted successfully", Data : {} ,Code:200});
      });
});

module.exports = router;
