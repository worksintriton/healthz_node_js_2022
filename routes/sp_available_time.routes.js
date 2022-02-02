var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
const moment = require('moment');
//var VerifyToken = require('./VerifyToken');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var SP_available_timeModel = require('./../models/SP_available_timeModel');
var date_datas = require('./date_datas.json');
var responseMiddleware = require('./../middlewares/response.middleware');
var HolidayModel = require('./../models/SP_HolidayModel');
var doctordetailsModel = require('./../models/doctordetailsModel');
var AppointmentsModel = require('./../models/AppointmentsModel');
var vendordetailsModel = require('./../models/vendordetailsModel');
var block_slotModel = require('./../models/block_slotModel');


router.use(responseMiddleware());


router.post('/fetch_dates',async function(req, res) {
  var date_details = await SP_available_timeModel.findOne({user_id:req.body.user_id});
  console.log(date_details);
  console.log(req.body);
  if(date_details == null){
    let Datass = [];
     if(req.body.types == 1){
             let a  = [
             {
              'Title' : 'Monday',
              'Time' : date_datas.onehour
             },
             {
              'Title' : 'Tuesday',
              'Time' : date_datas.onehour
             },
             {
              'Title' : 'Wednesday',
              'Time' : date_datas.onehour
             },
             {
              'Title' : 'Thursday',
              'Time' : date_datas.onehour
             },
             {
              'Title' : 'Friday',
              'Time' : date_datas.onehour
             },
             {
              'Title' : 'Saturday',
              'Time' : date_datas.onehour
             },
             {
              'Title' : 'Sunday',
              'Time' : date_datas.onehour
             }
             ];
             Datass =   a;
     }else if(req.body.types == 2){
             let a  = [
             {
              'Title' : 'Monday',
              'Time' : date_datas.thirtymin
             },
             {
              'Title' : 'Tuesday',
              'Time' : date_datas.thirtymin
             },
             {
              'Title' : 'Wednesday',
              'Time' : date_datas.thirtymin
             },
             {
              'Title' : 'Thursday',
              'Time' : date_datas.thirtymin
             },
             {
              'Title' : 'Friday',
              'Time' : date_datas.thirtymin
             },
             {
              'Title' : 'Saturday',
              'Time' : date_datas.thirtymin
             },
             {
              'Title' : 'Sunday',
              'Time' : date_datas.thirtymin
             }
             ];
             Datass = a;
     }else if(req.body.types == 3){
      let a  = [
             {
              'Title' : 'Monday',
              'Time' : date_datas.fiftymin
             },
             {
              'Title' : 'Tuesday',
              'Time' : date_datas.fiftymin
             },
             {
              'Title' : 'Wednesday',
              'Time' : date_datas.fiftymin
             },
             {
              'Title' : 'Thursday',
              'Time' : date_datas.fiftymin
             },
             {
              'Title' : 'Friday',
              'Time' : date_datas.fiftymin
             },
             {
              'Title' : 'Saturday',
              'Time' : date_datas.fiftymin
             },
             {
              'Title' : 'Sunday',
              'Time' : date_datas.fiftymin
             }
             ];
             Datass = a;
     }
     // console.log(a);
    SP_available_timeModel.create({
          sp_name: req.body.Doctor_name,
          user_id: req.body.user_id,
          sp_date_time: date_datas.Days,
          sp_time : Datass,
          mobile_type : req.body.mobile_type,
          Update_date: new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"})
        }, 
        function (err, user) {
          if (err) res.json({Status:"Failed",Message:"Failed to Insert", Data : {},Code:300});
          res.json({Status:"Success",Message:"Data Insert successfully", Data : user.sp_date_time,Code:200});
        });
  }else {
    res.json({Status:"Success",Message:"Data Fetched successfully", Data : date_details.sp_date_time,Code:200});
  }     
});


router.post('/get_time_Details',async function (req, res) {
  var date_details = await SP_available_timeModel.findOne({user_id:req.body.user_id});
   if(req.body.Day.length == 0){
       let datasss = [];
          datasss = date_datas.fiftymin;       
    res.json({Status:"Success",Message:"Time list Details", Data : datasss ,Code:200});
   }else {
     let times = date_details.sp_time;
     for(let a  = 0 ; a < times.length ; a ++){
      if(times[a].Title == req.body.Day){
         res.json({Status:"Success",Message:"Time list Details", Data : times[a].Time ,Code:200});
      }
     }
   } 
});



router.post('/update_doc_date',async function (req, res) {
  let doctordetails  =  await vendordetailsModel.findOne({user_id:req.body.user_id});
  vendordetailsModel.findByIdAndUpdate(doctordetails._id,{calender_status : true}, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
  });
    var date_details = await SP_available_timeModel.findOne({user_id:req.body.user_id});
     for(let d = 0 ; d < req.body.days.length ; d ++)
     {
     for(let a = 0 ; a < date_details.sp_date_time.length ; a ++){
      if(date_details.sp_date_time[a].Title == req.body.days[d]){
           date_details.sp_date_time[a].Status  = true ;
           date_details.sp_time[a].Time = req.body.timing;
             const update = { sp_time : date_details.sp_time, sp_date_time:date_details.sp_date_time };
            var Corporatecodeupdate = await SP_available_timeModel.findByIdAndUpdate({_id:date_details._id},update,{
            new: true
            });
      }
     }
     if(d == req.body.days.length - 1){
      res.json({Status:"Success",Message:"Calendar Details Updated", Data : Corporatecodeupdate ,Code:200});
     }  
     }    
});






router.post('/check', async function(req, res) {
  try{
    let a = [{
       "Total_time_slot" : req.body.Time
    }]
    let a1 = req.body.Time;
    var indiaTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
    var testime = (new Date(indiaTime)).toISOString();
    let timeslot = a1[0].Total_time_slot;
    let timeslotpart = timeslot.slice(0,8).toString();
    let timeslotpart2 = timeslot.slice(11,19).toString();
    var dt = moment(timeslotpart, ["h:mm A"]).format("HH:mm");
    var d2 = moment(timeslotpart2, ["h:mm A"]).format("HH:mm");
          let Doctor_ava_Date = req.body.Doctor_ava_Date;
          let totallist = Doctor_ava_Date + timeslot;
          let date = new Date();
         const time = moment(testime);
         var finaltime = moment(time).format("HH:mm");
         var finaldate = moment(new Date()).format("DD-MM-YYYY");
        if(Doctor_ava_Date == finaldate){
          if(finaltime > dt && finaltime < d2){
          await Doctor_time.findOne({Doctor_email_id:req.body.Doctor_email_id,Doctor_ava_Date:req.body.Doctor_ava_Date,Time:req.body.Time}, function (err, Appointmentdetails) {
          if(Appointmentdetails!== null){
            res.json({Status:"Failed",Message:"This time slot is already created",Data : {} ,Code:300});
          }
          else{
            res.json({Status:"Success",Message:"Available",Data : {} ,Code:200});
          }
          
        });
          }
          else{
            if(dt>finaltime){
              await Doctor_time.findOne({Doctor_email_id:req.body.Doctor_email_id,Doctor_ava_Date:req.body.Doctor_ava_Date,Time:req.body.Time}, function (err, Appointmentdetails) {
          if(Appointmentdetails!== null){
            res.json({Status:"Failed",Message:"This time slot is already created",Data : {} ,Code:300});
          }
          else{
            res.json({Status:"Success",Message:"Available",Data : {} ,Code:200});
          }
          
        });
            }
           else{
             res.json({Status:"Failed",Message:"You have selected expired slot",Data : {} ,Code:300});
           }
          }
}
else{
  res.json({Status:"Success",Message:"Available",Data : {} ,Code:200});
}
}
catch(e){
      res.error(500, "Internal server error");
}
});

router.post('/testcheck', async function(req, res) {
  try{
    let a = [{
       "Total_time_slot" : req.body.Time
    }]
    let a1 = req.body.Time;
    var indiaTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
    var testime = (new Date(indiaTime)).toISOString();
    let timeslot = a1[0].Total_time_slot;
    let timeslotpart = timeslot.slice(0,8).toString();
    let timeslotpart2 = timeslot.slice(11,19).toString();
    var dt = moment(timeslotpart, ["h:mm A"]).format("HH:mm");
    var d2 = moment(timeslotpart2, ["h:mm A"]).format("HH:mm");
          let Doctor_ava_Date = req.body.Doctor_ava_Date;
          let totallist = Doctor_ava_Date + timeslot;
          let date = new Date();
         const time = moment(testime);
         var finaltime = moment(time).format("HH:mm");
         var finaldate = moment(new Date()).format("DD-MM-YYYY");
        if(Doctor_ava_Date == finaldate){
          if(finaltime > dt && finaltime < d2){
             await Doctor_time.findOne({Doctor_email_id:req.body.Doctor_email_id,Doctor_ava_Date:req.body.Doctor_ava_Date,Time:req.body.Time}, function (err, Appointmentdetails) {
          if(Appointmentdetails!== null){
            res.json({Status:"Failed",Message:"Slot not Available",Data : {} ,Code:300});
          }
          else{
            res.json({Status:"Success",Message:"Available",Data : {} ,Code:200});
          }
          
        });
          }
          else{
            if(dt>finaltime){
              await Doctor_time.findOne({Doctor_email_id:req.body.Doctor_email_id,Doctor_ava_Date:req.body.Doctor_ava_Date,Time:req.body.Time}, function (err, Appointmentdetails) {
          if(Appointmentdetails!== null){
            res.json({Status:"Failed",Message:"Slot not Available",Data : {} ,Code:300});
          }
          else{
            res.json({Status:"Success",Message:"Available",Data : {} ,Code:200});
          }
          
        });
            }
           else{
             res.json({Status:"Failed",Message:"Invalid time slot",Data : {} ,Code:300});
           }
          }
}
}
catch(e){
      res.error(500, "Internal server error");
}
});

router.post('/avtime', async function(req, res) {
  try{
    let a = req.body.Time;
    let timeslot = a[0].Total_time_slot;
    let timeslotpart = timeslot.slice(0,8)
    let Doctor_ava_Date = req.body.Doctor_ava_Date;
    let totallist = Doctor_ava_Date + timeslot;
     let date = new Date();
         const time = moment(date);
         var finaltime = moment(new Date()).format("hh:mm A");
         var finaldate = moment(new Date()).format("DD-MM-YYYY");
        if(Doctor_ava_Date < finaldate){
         
             res.json({Status:"Failed",Message:"Time slot expired",Data : {} ,Code:300}); 
          
        }
        else if(timeslotpart <= finaltime){
            res.json({Status:"Failed",Message:"Time slot expired",Data : {} ,Code:300}); 
        }
    // var today = new Date();
          else{
            res.json({Status:"sucess",Message:"Available",Data : {} ,Code:300}); 
          }
      
}
catch(e){
      res.error(500, "Internal server error");
}
});
router.get('/deletes', function (req, res) {
      SP_available_timeModel.remove({}, function (err, user) {
      if (err) return res.status(500).send("There was a problem deleting the user.");
      res.json({Status:"Success",Message:"Doctor_time Details Deleted", Data : {} ,Code:200});     
      });
});


router.post('/filter_date', function (req, res) {
        SP_available_timeModel.find({}, function (err, StateList) {
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



router.post('/doctor_date_avl', function (req, res) {
        Doctor_time.find({Doctor_email_id:req.body.Doctor_email_id,Doctor_ava_Date:req.body.Doctor_ava_Date}, function (err, doctors) {
            if (err) return res.status(500).send("There was a problem finding the Doctors.");
            if(doctors.length == 0){
                res.json({Status:"Failed",Message:"Doctor Not Available today Please select another Date", Data : [] ,Code:300});
                }else {
    let timeslot = doctors[0].Time[0].Total_time_slot;
    var indiaTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
    var testime = (new Date(indiaTime)).toISOString();
    let timeslotpart = timeslot.slice(0,8).toString();
    let timeslotpart2 = timeslot.slice(11,19).toString();
    var dt = moment(timeslotpart, ["h:mm A"]).format("HH:mm");
    var d2 = moment(timeslotpart2, ["h:mm A"]).format("HH:mm");
          let Doctor_ava_Date = req.body.Doctor_ava_Date;
          let totallist = Doctor_ava_Date + timeslot;
          let date = new Date();
         const time = moment(testime);
         var finaltime = moment(time).format("HH:mm");
         var finaldate = moment(new Date()).format("DD-MM-YYYY");
     if(Doctor_ava_Date == finaldate){
          if(finaltime > dt && finaltime < d2){

             res.json({Status:"Success",Message:"Data List", Data : doctors ,Code:200}); 
          }
          else{
            if(dt>finaltime){
             res.json({Status:"Success",Message:"Data List", Data : doctors ,Code:200});
            }
           else{
             res.json({Status:"Failed",Message:"Doctor Not Available today Please select another Date",Data : [] ,Code:300});
           }
          }
      }
      else{
        res.json({Status:"Success",Message:"Data List", Data : doctors ,Code:200});
      }            
        }

        });
});

router.get('/getlist', function (req, res) {
        SP_available_timeModel.find({}, function (err, Homebanners) {
            if (err) return res.status(500).send("There was a problem finding the Homebanners.");
            res.json({Status:"Success",Message:"Data Insert successfully", Data : Homebanners,Code:200});
        });
});


router.post('/doctor_ava_all', function (req, res) {
  var mysort = {Doctor_ava_Date: 1, Time: 1};
        SP_available_timeModel.find({Doctor_email_id:req.body.Doctor_email_id}, function (err, Homebanners) {
            if (err) return res.status(500).send("There was a problem finding the Homebanners.");
                     res.json({Status:"Success",Message:"Data List successfully", Data : Homebanners,Code:200});
        }).sort(mysort);
});



router.post('/edit', async function (req, res) {
    let a1 = req.body.Time;
    var indiaTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
    var testime = (new Date(indiaTime)).toISOString();
    let timeslot = a1[0].Total_time_slot;
    let timeslotpart = timeslot.slice(0,8).toString();
    let timeslotpart2 = timeslot.slice(11,19).toString();
    var dt = moment(timeslotpart, ["h:mm A"]).format("HH:mm");
    var d2 = moment(timeslotpart2, ["h:mm A"]).format("HH:mm");
          let Doctor_ava_Date = req.body.Doctor_ava_Date;
          let totallist = Doctor_ava_Date + timeslot;
          let date = new Date();
         const time = moment(testime);
         var finaltime = moment(time).format("HH:mm");
         var finaldate = moment(new Date()).format("DD-MM-YYYY");
        if(Doctor_ava_Date == finaldate){
          if(finaltime > dt && finaltime < d2){
          await Doctor_time.findOne({Doctor_email_id:req.body.Doctor_email_id,Doctor_ava_Date:req.body.Doctor_ava_Date,Time:req.body.Time}, async function (err, Appointmentdetails) {
          if(Appointmentdetails!== null){
            res.json({Status:"Failed",Message:"Slot not Available",Data : req.body ,Code:300});
          }
          else{
             await Doctor_time.findByIdAndUpdate(req.body._id, req.body, {new: true}, async function (err, user) {
            if (err) return res.status(500).send("There was a problem updating the user.");
            res.json({Status:"Success",Message:"Data updated successfully", Data : user,Code:200});
      });
          }
          
        });
          }
          else{
            if(dt>finaltime){
          await Doctor_time.findOne({Doctor_email_id:req.body.Doctor_email_id,Doctor_ava_Date:req.body.Doctor_ava_Date,Time:req.body.Time}, async function (err, Appointmentdetails) {
          if(Appointmentdetails!== null){
            res.json({Status:"Failed",Message:"Slot not Available",Data : req.body ,Code:300});
          }
          else{
           await Doctor_time.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, user) {
            if (err) return res.status(500).send("There was a problem updating the user.");
            res.json({Status:"Success",Message:"Data updated successfully", Data : user,Code:200});
      });
          }
          
        });
            }
           else{
             res.json({Status:"Failed",Message:"Invalid time slot",Data: req.body ,Code:300});
           }
          }
      }
      else
      {
        await Doctor_time.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, user) {
            if (err) return res.status(500).send("There was a problem updating the user.");
            res.json({Status:"Success",Message:"Data updated successfully", Data : user,Code:200});
      
        });
      }
        });




// router.post('/update_doc_date', function (req, res) {
//   console.log(date_datas);
//     res.json({Status:"Success",Message:"Calendar Details Updated", Data : {} ,Code:200});

// });


router.post('/get_day_details',async function (req, res) {
   let Data =  date_datas.Days;
    res.json({Status:"Success",Message:"Calendar Details", Data : Data ,Code:200});
});




router.get('/time_type', function (req, res) {
        let a = [{"Name":"1 Mins","type":"0"},{"Name":"30 Mins","type":"1"},{"Name":"15 Mins","type":"2"},{"Name":"10 Mins","type":"3"}];
        res.json({Status:"Success",Message:"Time_type list", Data : a,Code:200});
});



router.post('/get_sp_new',async function (req, res) {
   var Appointmentdetails = await block_slotModel.find({user_id:req.body.user_id,booking_date:req.body.Date});
   // console.log("Appointmentdetails",Appointmentdetails);
   var date_details = await SP_available_timeModel.findOne({user_id:req.body.user_id});
   var Holiday_details = await HolidayModel.find({user_id:req.body.user_id});
   // console.log(date_details);
   if(date_details ==  null){
    res.json({Status:"Failed",Message:"Service Provider is not available on this day", Data : [] ,Code:404});
   }else{
 let reqdate = req.body.Date.split("-");
  let repdate = reqdate[2]+"-"+reqdate[1]+"-"+reqdate[0];
  var d = new Date(repdate);
   let weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
   let dayss = weekday[d.getDay()];
   for(let a = 0 ; a < date_details.sp_date_time.length ; a ++){
    // console.log(dayss,date_details.sp_date_time[a].Title);
     if(dayss == date_details.sp_date_time[a].Title){
               if(date_details.sp_date_time[a].Status == false){
                res.json({Status:"Failed",Message:"Service Provider is not available on this day", Data : [] ,Code:404});
               }else{
                // console.log(date_details.sp_time[a].Time);
                   let times = date_details.sp_time[a].Time;
                   let finaltime = [];
                   for(let c = 0 ; c < times.length ; c ++){
                    if(times[c].Status == true){
                      let d = {
                        time : times[c].Time,
                        twentyfour : times[c].format
                      }
                      finaltime.push(d);
                    }
                    if(c == times.length-1){
                      let ad = [];
                      let Comm_type_chat = 'No';
                      let Comm_type_video = 'No';
                      let sp_ava_Date = req.body.Date;
                      let sp_name = "";
                      let sp_email_id =  "";
                      // if(doctor_details.call_type == 'Chat'){
                      //       Comm_type_chat = 'Yes';
                      // }else if(doctor_details.call_type == 'Video'){
                      //        Comm_type_video = 'Yes';
                      // }else if(doctor_details.call_type == 'Chat & Video'){
                      //        Comm_type_video = 'Yes';
                      //        Comm_type_chat = 'Yes';
                      // }
                      if(req.body.Date == req.body.cur_date){
                        let datas = [];
                        let check = 1;
                        for(let a  = 0 ; a < finaltime.length ; a ++)
                        {

                          let cur_time = req.body.cur_date.split("-");
                          let correct_date = cur_time[2]+"-"+cur_time[1]+"-"+cur_time[0]+" "+finaltime[a].twentyfour;
                          // console.log("Marked date time",correct_date);
                          // console.log("Current Dates time",req.body.current_time);
                          var marked_time = new Date(correct_date);
                          var current_time = new Date(req.body.current_time);
                          // console.log(marked_time);
                          // console.log(current_time);
                          if(current_time < marked_time){
                            // console.log("true");
                            let d = {
                            time : finaltime[a].time
                            }
                            datas.push(d);
                          }else {
                            // console.log("false");
                          }
                          if(a == finaltime.length - 1){
                            if(datas.length == 0){
                              finaltime = [];
                            }else{
                              finaltime = [];
                              var com = [];
                                     // console.log(datas);
                                     // let cur_time3 = req.body.cur_time.split(" ");
                                     // let cur_time1 = cur_time3[0].split(":");
                                     // let cur_time2 = datas[0].time.split(" ");
                                     // let cur_time4 = cur_time2[0].split(":");
                                     let fifteenmin = date_datas.fiftymin;   
                                     finaltime = datas;
                            }
                          }



                          // // console.log("Testing",finaltime[a].time)
                          // let cur_time = finaltime[a].time.split(":");
                          // let cur_time1 = req.body.cur_time.split(":");
                          // let cur_time2 = finaltime[a].time.split(" ");
                          // let cur_time3 = req.body.cur_time.split(" ");
                          // if(cur_time2[1] == cur_time3[1]){
                          // if(+cur_time[0] >= +cur_time1[0]){
                          //    if(cur_time2[1] == 'PM' && +cur_time[0] == 12){
                          //    }else {
                          //   check = 0;
                          //   console.log("AMS",cur_time2[1] ,cur_time3[1]);
                          //   console.log("Status True",+cur_time[0] , +cur_time1[0]);
                          //    }
                          //  }
                          //  }
                          // if(check == 0){
                          //   let d = {
                          //   time : finaltime[a].time
                          //   }
                          //   datas.push(d);

                          // }
                          // if(a == finaltime.length - 1){
                          //   if(datas.length == 0){
                          //     finaltime = [];
                          //   }else{
                          //     finaltime = [];
                          //     var com = [];
                          //            console.log(datas);
                          //            let cur_time3 = req.body.cur_time.split(" ");
                          //            let cur_time1 = cur_time3[0].split(":");
                          //            let cur_time2 = datas[0].time.split(" ");
                          //            let cur_time4 = cur_time2[0].split(":");
                          //            // if(+cur_time1[1] > 0 &&  cur_time1[0] == cur_time4[0]){
                          //            //     datas.splice(0, 1);
                          //            // }
                          //           let fifteenmin = date_datas.fiftymin;

                          //           // for(let v = 0 ; v < datas.length ; v ++){
                          //           //    let datas_15_spa = datas[v].time.split(" ");
                          //           //    let datas_15_col = datas_15_spa[0].split(":");
                          //           //  for(let y = 0 ; y < fifteenmin.length ; y ++){
                          //           //  let time_15_spa = fifteenmin[y].Time.split(" ");
                          //           //  let time_15_col = time_15_spa[0].split(":");
                          //           //  // console.log(datas_15_spa[1],datas_15_col[0],datas_15_col[1]);
                          //           //  // console.log(time_15_spa[1],time_15_col[0],time_15_col[1]);
                          //           //  if(datas_15_spa[1] == time_15_spa[1] && datas_15_col[0] == time_15_col[0]){
                        
                          //           //       let d = {
                          //           //        time : fifteenmin[y].Time
                          //           //        }
                          //           //     com.push(d);
                          //           //  }
                          //           //  }
                          //           // }
                                    
                          //   finaltime = datas;
                          //   }
                          // }
                        }
                      }
                      // console.log(finaltime);
                      let dd = {
                        Comm_type_chat : Comm_type_chat,
                        Comm_type_video : Comm_type_video,
                        sp_email_id : sp_email_id,
                        sp_ava_Date : sp_ava_Date,
                        sp_name : sp_name,
                        Times : finaltime    
                      }
                      ad.push(dd);
                       // console.log("VVVVVVV",Holiday_details);
                       let checkss = 0
                     
                       if(Holiday_details.length == 0){
                             if(ad[0].Times.length == 0){
                                              res.json({Status:"Failed",Message:"Service Provider is not available on this day", Data : [] ,Code:404});

                                       }else{

                                           time_final = [];
                                        for(let p = 0; p < ad[0].Times.length; p++){
                                              var checks1 = 0;  
                                              if(Appointmentdetails.length == 0){
                                          {
                                                           let o = 
                                          {
                                          "time": ad[0].Times[p].time,
                                          "book_status" :  true, // true
                                          "status" : "Available"
                                          }
                                          time_final.push(o);
                                                      }
                    
                                              }else{
                                                 for(let q = 0 ; q < Appointmentdetails.length; q ++ ){
                                                  // console.log(ad[0].sp_ava_Date,req.body.Date,ad[0].Times[p].time,Appointmentdetails[q].booking_time);
                                                   if(ad[0].sp_ava_Date == req.body.Date && ad[0].Times[p].time == Appointmentdetails[q].booking_time){
                                                    // console.log("Checking in");
                                                    checks1 = 1
                                                   }
                                                   if(q == Appointmentdetails.length - 1){
                                                      if(checks1 == 1){
                                                         let o = 
                                                        {
                                          "time": ad[0].Times[p].time,
                                          "book_status" : false,
                                          "status" : "Not Available"
                                          }
                                          time_final.push(o);

                                                      }
                                                      else{
                                                           let o = 
                                          {
                                          "time": ad[0].Times[p].time,
                                          "book_status" :  true, // true
                                          "status" : "Available"
                                          }
                                          time_final.push(o);
                                                      }
                                                   }
                                              }
                                              }                    
                                          if(p == ad[0].Times.length - 1){
                                              ad[0].Times = time_final
                                            res.json({Status:"Success",Message:"Service Provider Available", Data : ad,Code:200});
                                          }
                                        }

                                              // res.json({Status:"Success",Message:"Service Provider Available", Data : ad,Code:200});

                                       }
                       }else{
                       for(let t = 0 ; t < Holiday_details.length ; t++){
                           if(req.body.Date == Holiday_details[t].Date){
                            checkss = 1
                           }
                           if(t == Holiday_details.length - 1){
                                 if(checkss == 0){
                                       if(ad[0].Times.length == 0){
                                              res.json({Status:"Failed",Message:"Service Provider is not available on this day", Data : [] ,Code:404});

                                       }else{

                                        time_final = [];
                                        for(let p = 0; p < ad[0].Times.length; p++){
                                              var checks1 = 0;  
                                              if(Appointmentdetails.length == 0){
                                          {
                                                           let o = 
                                          {
                                          "time": ad[0].Times[p].time,
                                          "book_status" :  true, // true
                                          "status" : "Available"
                                          }
                                          time_final.push(o);
                                                      }
                    
                                              }else{
                                                 for(let q = 0 ; q < Appointmentdetails.length; q ++ ){
                                                  // console.log(ad[0].sp_ava_Date,req.body.Date,ad[0].Times[p].time,Appointmentdetails[q].booking_time);
                                                   if(ad[0].sp_ava_Date == req.body.Date && ad[0].Times[p].time == Appointmentdetails[q].booking_time){
                                                    // console.log("Checking in");
                                                    checks1 = 1
                                                   }
                                                   if(q == Appointmentdetails.length - 1){
                                                      if(checks1 == 1){
                                                         let o = 
                                                        {
                                          "time": ad[0].Times[p].time,
                                          "book_status" : false,
                                          "status" : "Not Available"
                                          }
                                          time_final.push(o);

                                                      }
                                                      else{
                                                           let o = 
                                          {
                                          "time": ad[0].Times[p].time,
                                          "book_status" :  true, // true
                                          "status" : "Available"
                                          }
                                          time_final.push(o);
                                                      }
                                                   }
                                              }
                                              }                    
                                          if(p == ad[0].Times.length - 1){
                                              ad[0].Times = time_final
                                            res.json({Status:"Success",Message:"Service Provider Available", Data : ad,Code:200});
                                          }
                                        }

                                              // res.json({Status:"Success",Message:"Service Provider Available", Data : ad,Code:200});

                                       }

                                                       }else{
                                                                   res.json({Status:"Failed",Message:"Service Provider is not available on this day", Data : [] ,Code:404});
                                                       }
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




router.post('/slot/get_sp_new',async function (req, res) {
  // console.log(req.body);
   var Appointmentdetails = await block_slotModel.find({user_id:req.body.user_id,booking_date:req.body.Date});
   // console.log("Appointmentdetails",Appointmentdetails);
   var date_details = await SP_available_timeModel.findOne({user_id:req.body.user_id});
   var Holiday_details = await HolidayModel.find({user_id:req.body.user_id});
   console.log("Holiday Detail",Holiday_details);
   if(date_details ==  null){
    res.json({Status:"Failed",Message:"Service Provider is not available on this day", Data : [] ,Code:404});
   }else{
 let reqdate = req.body.Date.split("-");
  let repdate = reqdate[2]+"-"+reqdate[1]+"-"+reqdate[0];
  var d = new Date(repdate);
   let weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
   let dayss = weekday[d.getDay()];
   for(let a = 0 ; a < date_details.sp_date_time.length ; a ++){
     if(dayss == date_details.sp_date_time[a].Title){
               if(date_details.sp_date_time[a].Status == false){
                res.json({Status:"Failed",Message:"Service Provider is not available on this day", Data : [] ,Code:404});
               }else{
                   let times = date_details.sp_time[a].Time;
                   let finaltime = [];
                   for(let c = 0 ; c < times.length ; c ++){
                    if(times[c].Status == true){
                      let d = {
                        time : times[c].Time,
                        twentyfour : times[c].format
                      }
                      finaltime.push(d);
                    }
                    if(c == times.length-1){
                      let ad = [];
                      let Comm_type_chat = 'No';
                      let Comm_type_video = 'No';
                      let sp_ava_Date = req.body.Date;
                      let sp_name = "";
                      let sp_email_id =  "";
                      // if(doctor_details.call_type == 'Chat'){
                      //       Comm_type_chat = 'Yes';
                      // }else if(doctor_details.call_type == 'Video'){
                      //        Comm_type_video = 'Yes';
                      // }else if(doctor_details.call_type == 'Chat & Video'){
                      //        Comm_type_video = 'Yes';
                      //        Comm_type_chat = 'Yes';
                      // }
                      if(req.body.Date == req.body.cur_date){
                        let datas = [];
                        let check = 1;
                        for(let a  = 0 ; a < finaltime.length ; a ++)
                        {

                          let cur_time = req.body.cur_date.split("-");
                          let correct_date = cur_time[2]+"-"+cur_time[1]+"-"+cur_time[0]+" "+finaltime[a].twentyfour;
                          // console.log("Current Dates time",req.body.current_time);
                          var marked_time = new Date(correct_date);
                          var current_time = new Date(req.body.current_time);
                          if(current_time < marked_time){
                            let d = {
                            time : finaltime[a].time
                            }
                            datas.push(d);
                          }else {
                          }
                          if(a == finaltime.length - 1){
                            if(datas.length == 0){
                              finaltime = [];
                            }else{
                              finaltime = [];
                              var com = [];
                                     // let cur_time3 = req.body.cur_time.split(" ");
                                     // let cur_time1 = cur_time3[0].split(":");
                                     // let cur_time2 = datas[0].time.split(" ");
                                     // let cur_time4 = cur_time2[0].split(":");
                                     let fifteenmin = date_datas.fiftymin;   
                                     finaltime = datas;
                            }
                          }



                          // // console.log("Testing",finaltime[a].time)
                          // let cur_time = finaltime[a].time.split(":");
                          // let cur_time1 = req.body.cur_time.split(":");
                          // let cur_time2 = finaltime[a].time.split(" ");
                          // let cur_time3 = req.body.cur_time.split(" ");
                          // if(cur_time2[1] == cur_time3[1]){
                          // if(+cur_time[0] >= +cur_time1[0]){
                          //    if(cur_time2[1] == 'PM' && +cur_time[0] == 12){
                          //    }else {
                          //   check = 0;
                          //   console.log("AMS",cur_time2[1] ,cur_time3[1]);
                          //   console.log("Status True",+cur_time[0] , +cur_time1[0]);
                          //    }
                          //  }
                          //  }
                          // if(check == 0){
                          //   let d = {
                          //   time : finaltime[a].time
                          //   }
                          //   datas.push(d);

                          // }
                          // if(a == finaltime.length - 1){
                          //   if(datas.length == 0){
                          //     finaltime = [];
                          //   }else{
                          //     finaltime = [];
                          //     var com = [];
                          //            console.log(datas);
                          //            let cur_time3 = req.body.cur_time.split(" ");
                          //            let cur_time1 = cur_time3[0].split(":");
                          //            let cur_time2 = datas[0].time.split(" ");
                          //            let cur_time4 = cur_time2[0].split(":");
                          //            // if(+cur_time1[1] > 0 &&  cur_time1[0] == cur_time4[0]){
                          //            //     datas.splice(0, 1);
                          //            // }
                          //           let fifteenmin = date_datas.fiftymin;

                          //           // for(let v = 0 ; v < datas.length ; v ++){
                          //           //    let datas_15_spa = datas[v].time.split(" ");
                          //           //    let datas_15_col = datas_15_spa[0].split(":");
                          //           //  for(let y = 0 ; y < fifteenmin.length ; y ++){
                          //           //  let time_15_spa = fifteenmin[y].Time.split(" ");
                          //           //  let time_15_col = time_15_spa[0].split(":");
                          //           //  // console.log(datas_15_spa[1],datas_15_col[0],datas_15_col[1]);
                          //           //  // console.log(time_15_spa[1],time_15_col[0],time_15_col[1]);
                          //           //  if(datas_15_spa[1] == time_15_spa[1] && datas_15_col[0] == time_15_col[0]){
                        
                          //           //       let d = {
                          //           //        time : fifteenmin[y].Time
                          //           //        }
                          //           //     com.push(d);
                          //           //  }
                          //           //  }
                          //           // }
                                    
                          //   finaltime = datas;
                          //   }
                          // }
                        }
                      }
                      let dd = {
                        Comm_type_chat : Comm_type_chat,
                        Comm_type_video : Comm_type_video,
                        sp_email_id : sp_email_id,
                        sp_ava_Date : sp_ava_Date,
                        sp_name : sp_name,
                        Times : finaltime    
                      }
                      ad.push(dd);
                       let checkss = 0
                     
                       if(Holiday_details.length == 0){
                             if(ad[0].Times.length == 0){
                                              res.json({Status:"Failed",Message:"Service Provider is not available on this day", Data : [] ,Code:404});

                                       }else{


                                          time_final = [];
                                        for(let p = 0; p < ad[0].Times.length; p++){
                                              var checks1 = 0;  
                                              if(Appointmentdetails.length == 0){
                                          {
                                                           let o = 
                                          {
                                          "time": ad[0].Times[p].time,
                                          "book_status" :  true, // true
                                          "status" : "Available"
                                          }
                                          time_final.push(o);
                                                      }
                    
                                              }else{
                                                 for(let q = 0 ; q < Appointmentdetails.length; q ++ ){
                                                  // console.log(ad[0].sp_ava_Date,req.body.Date,ad[0].Times[p].time,Appointmentdetails[q].booking_time);
                                                   if(ad[0].sp_ava_Date == req.body.Date && ad[0].Times[p].time == Appointmentdetails[q].booking_time){
                                                    // console.log("Checking in");
                                                    checks1 = 1
                                                   }
                                                   if(q == Appointmentdetails.length - 1){
                                                      if(checks1 == 1){
                                                         let o = 
                                                        {
                                          "time": ad[0].Times[p].time,
                                          "book_status" : false,
                                          "status" : "Not Available"
                                          }
                                          time_final.push(o);

                                                      }
                                                      else{
                                                           let o = 
                                          {
                                          "time": ad[0].Times[p].time,
                                          "book_status" :  true, // true
                                          "status" : "Available"
                                          }
                                          time_final.push(o);
                                                      }
                                                   }
                                              }
                                              }                    
                                          if(p == ad[0].Times.length - 1){
                                              ad[0].Times = time_final
                                            res.json({Status:"Success",Message:"Service Provider Available", Data : ad,Code:200});
                                          }
                                        }



                                              // res.json({Status:"Success",Message:"Service Provider Available", Data : ad,Code:200});

                                       }
                       }else{
                       for(let t = 0 ; t < Holiday_details.length ; t++){
                           if(req.body.Date == Holiday_details[t].Date){
                            checkss = 1
                           }
                           if(t == Holiday_details.length - 1){
                                 if(checkss == 0){
                                       if(ad[0].Times.length == 0){
                                              res.json({Status:"Failed",Message:"Service Provider is not available on this day", Data : [] ,Code:404});

                                       }else
                                       {
                                              
                                              time_final = [];
                                          for(let p = 0; p < ad[0].Times.length; p++){
                                              var checks1 = 0;  
                                              if(Appointmentdetails.length == 0){
                                          {
                                                           let o = 
                                          {
                                          "time": ad[0].Times[p].time,
                                          "book_status" : true, // true
                                          "status" : "Available"
                                          }
                                          time_final.push(o);
                                                      }
                    
                                              }else{
                                                 for(let q = 0 ; q < Appointmentdetails.length; q ++ ){
                                                // console.log(ad[0].sp_ava_Date,req.body.Date,ad[0].Times[p].time,Appointmentdetails[q].booking_time);
                                                   if(ad[0].sp_ava_Date == req.body.Date && ad[0].Times[p].time == Appointmentdetails[q].booking_time){
                                                    // console.log("Checking in");
                                                    checks1 = 1
                                                   }
                                                   if(q == Appointmentdetails.length - 1){
                                                      if(checks1 == 1){
                                                         let o = 
                                                        {
                                          "time": ad[0].Times[p].time,
                                          "book_status" : false,
                                          "status" : "Not Available"
                                          }
                                          time_final.push(o);

                                                      }
                                                      else{
                                                           let o = 
                                          {
                                          "time": ad[0].Times[p].time,
                                          "book_status" : true, // true
                                          "status" : "Available"
                                          }
                                          time_final.push(o);
                                                      }
                                                   }
                                              }
                                              }                    
                                          if(p == ad[0].Times.length - 1){
                                              ad[0].Times = time_final
                                            res.json({Status:"Success",Message:"Doctor Available", Data : ad,Code:200});
                                          }
                                        }
                                       // res.json({Status:"Success",Message:"Doctor Available", Data : ad,Code:200});



                                       }

                                                       }else{
                                                                   res.json({Status:"Failed",Message:"Service Provider is not available on this day", Data : [] ,Code:404});
                                                       }
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


router.post('/delete', function (req, res) {
      SP_available_timeModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Holiday Deleted successfully", Data : {} ,Code:200});
      });
});





router.post('/delete/:id', function (req, res) {
      Doctor_time.findByIdAndRemove(req.params.id, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting details.");
          res.success(200, "Data Deleted Successfully");
      });
});




// // DELETES A USER FROM THE DATABASE
router.delete('/delete/:id', function (req, res) {
      Doctor_time.findByIdAndRemove(req.params.id, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting details.");
          res.success(200, "Data Deleted Successfully");
      });
});

module.exports = router;
