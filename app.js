var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');	
var fileUpload = require('express-fileupload');
var pdf = require('html-pdf');
const puppeteer = require('puppeteer');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
var fs = require('fs');
var pug = require ('pug');
var request = require("request");

var responseMiddleware = require('./middlewares/response.middleware');

/*Routing*/

var Activity = require('./routes/Activity.routes');
var userdetails = require('./routes/userdetails.routes');
var Usertype = require('./routes/Usertype.routes');
var Splashscreen = require('./routes/Splashscreen.routes');
var Demoscreen = require('./routes/Demoscreen.routes');
var PrescriptionRouter  = require('./routes/Prescription.routes');




var petdetails = require('./routes/petdetails.routes');
var doctordetails = require('./routes/doctordetails.routes');
var temdoctordetails = require('./routes/temdoctordetails.routes');
var vendordetails = require('./routes/vendordetails.routes');
var locationdetails = require('./routes/locationdetails.routes');
var homebannerdetails = require('./routes/homebanner.routes');

var servicebannerdetails = require('./routes/servicebanner.routes');
var doctorbannerdetails = require('./routes/doctorbanner.routes');


var doctor_sepc = require('./routes/doctor_sepc.routes');

var sp_sepc = require('./routes/sp_sepc.routes');


var appointments = require('./routes/appointments.routes');
var walkin_appointment = require('./routes/walkin_appointment.routes');

var pettype = require('./routes/pettype.routes');
var breedtype = require('./routes/breedtype.routes');
var notification = require('./routes/notification.routes');
var New_DoctorAvailable = require('./routes/New_Doctor_available.routes');
var HolidayRouter = require('./routes/Holiday.routes');

var SP_Holiday = require('./routes/SP_Holiday.routes');
var SP_services = require('./routes/SP_services.routes');
var SP_appointments = require('./routes/sp_appointments.routes');
var SP_available_time = require('./routes/sp_available_time.routes');


var product_vendor = require('./routes/product_vendor.routes');
var product_cate = require('./routes/product_categories.routes');
var product_subcat = require('./routes/product_subcat.routes');
var product_details = require('./routes/product_details.routes');
var order_details = require('./routes/order_details.routes');
var vendor_banner_detail = require('./routes/vendor_banner_detail.routes');
var product_cart_detail = require('./routes/product_cart_detail.routes');
var vendor_order_booking = require('./routes/vendor_order_booking.routes');
var vendor_order_detail = require('./routes/vendor_order_detail.routes');
var shippingdetails = require('./routes/shippingdetails.routes');
var vendor_order_group = require('./routes/vendor_order_group.routes');
var petlover_order_group = require('./routes/petlover_order_group.routes');
var Doctor_fav = require('./routes/Doctor_fav.routes');
var Sp_fav = require('./routes/Sp_fav.routes');
var Product_fav = require('./routes/Product_fav.routes');
var newproduct_detail = require('./routes/newproduct_detail.routes');
var diagnosis = require('./routes/diagnosis.routes');
var sub_diagnosis = require('./routes/sub_diagnosis.routes');
var healthissue = require('./routes/healthissue.routes');
var minibanner = require('./routes/minibanner.routes');
var sos_pet = require('./routes/sos.routes.js');

var coupon_code = require('./routes/coupon_code.routes');
var refund_coupon = require('./routes/refund_coupon.routes');
var block_slot = require('./routes/block_slot.routes');


var familymember = require('./routes/familymember.routes');




/*Database connectivity*/

// var BaseUrl = "http://petfolio.in/api"; 
var BaseUrl = "http://35.165.75.97:3000/api"; 



const mongoose = require('mongoose'); 
mongoose.connect('mongodb://localhost:27017/Salveo'); 
var db = mongoose.connection; 
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
    console.log("connection succeeded"); 
}) 

var app = express();

app.use(fileUpload());
app.use(responseMiddleware());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('view engine', 'pug');

/*Response settings*/

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');
  next();
});



///////Notification Auto Schedule Process for 15 min  once ///////
const intervalObj = setInterval(() => {
var indiaTime = new Date(Date.now() + 1000 * (60 * 15)).toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
console.log(indiaTime);
// indiaTime.setMinutes(indiaTime.getMinutes() + 20);
var fiftyteen = new Date(indiaTime).toISOString().replace(/T/, ' ').replace(/\..+/, '');

var fiftyteen_test = fiftyteen.split(":");

var final_fiftyteen_test = fiftyteen_test[0]+":"+fiftyteen_test[1]+":00";

console.log(+fiftyteen_test[1]);


var indiaTime1 = new Date(Date.now() - 1000 * (60 * 30)).toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
console.log(indiaTime1);
var forutyfive = new Date(indiaTime1).toISOString().replace(/T/, ' ').replace(/\..+/, '');

var forutyfive_test = forutyfive.split(":");

var final_forutyfive_test = forutyfive_test[0]+":"+forutyfive_test[1]+":00";

console.log(+forutyfive_test[1]);
console.log(final_fiftyteen_test,final_forutyfive_test);

console.log(+final_fiftyteen_test[1]);

if(+final_fiftyteen_test[1] == 0){
 console.log("Checking Notification");
    notificationcall(final_fiftyteen_test,final_forutyfive_test);
}
if(+final_fiftyteen_test[1] == 15){
   console.log("Checking Notification");
      notificationcall(final_fiftyteen_test,final_forutyfive_test);
}
if(+final_fiftyteen_test[1] == 30){
   console.log("Checking Notification");
      notificationcall(final_fiftyteen_test,final_forutyfive_test);
}
if(+final_fiftyteen_test[1] == 45){
   console.log("Checking Notification");
   notificationcall(final_fiftyteen_test,final_forutyfive_test);
}

},60000);

function notificationcall(final_fiftyteen_test,final_forutyfive_test){
    console.log("***********************API IS CALL *********************");
    console.log("********************************************");
     var params =  {
             "display_date": final_fiftyteen_test
             }
            request.post(
                'http://35.164.43.170:3000/api/appointments/mobile/remaindernotification',
                { json: params },
                function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        console.log(body);
                    }
                }
        );



       var params1 =  {
             "display_date": final_forutyfive_test
             }
            request.post(
                'http://35.164.43.170:3000/api/appointments/mobile/noshownotification',
                { json: params1 },
                function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        console.log(body);
                    }
                }
        );


        var params =  {
             "display_date": final_fiftyteen_test
             }
            request.post(
                'http://35.164.43.170:3000/api/sp_appointments/mobile/remainder_notifications',
                { json: params },
                function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        console.log(body);
                    }
                }
        );



       var params1 =  {
             "display_date": final_forutyfive_test
             }
            request.post(
                'http://35.164.43.170:3000/api/sp_appointments/mobile/noshow_notifications',
                { json: params1 },
                function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        console.log(body);
                    }
                }
        );





//     console.log(time,dates);
// let params = {   
//         "Booking_Date" : dates,
//         "Booking_Time": time
// }
// var request = require("request");
//   request.post('http://mysalveo.com/api/notifications/notifydoctor',params,function(err,res,body)
//   {
//   if(err) //TODO: handle err
//     console.log(res.body);
// });

//     request.post('http://mysalveo.com/api/notifications/notifypatient',params,function(err,res,body)
//   {
//   if(err) //TODO: handle err
//     console.log(res.body);
// });

}


////////////// Notification Process Close here //////////////




app.post('/upload', function(req, res) {
  let sampleFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    res.error(300,'No files were uploaded.');
    return;
  }

  console.log('req.files >>>', req.files); // eslint-disable-line

  sampleFile = req.files.sampleFile;
  var exten = sampleFile.name.split('.');
  console.log(exten[exten.length - 1]);
  var filetype = exten[exten.length - 1];



  uploadPath = __dirname + '/public/uploads/'  + new Date().getTime() + "." + filetype;

  var Finalpath =  BaseUrl +'/uploads/'+ new Date().getTime() + "." + filetype;
   console.log("uploaded path",uploadPath )


  sampleFile.mv(uploadPath, function(err) {
    if (err) {
   console.log(err)
   return res.error(500, "Internal server error");
    }
   res.json({Status:"Success",Message:"file upload success", Data :Finalpath,Code:200});
  });
});



app.post('/upload1', function(req, res) {
  let sampleFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    res.error(300,'No files were uploaded.');
    return;
  }

  console.log('req.files >>>', req.files); // eslint-disable-line

  sampleFile = req.files.sampleFile;

  uploadPath = __dirname + '/public/uploads/' + sampleFile.name;

  var Finalpath =  BaseUrl +'/uploads/'+ sampleFile.name;
   console.log("uploaded path",uploadPath )


  sampleFile.mv(uploadPath, function(err) {
    if (err) {
   console.log(err)
   return res.error(500, "Internal server error");
    }
   res.json({Status:"Success",Message:"file upload success", Data :Finalpath,Code:200});
  });
});





app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/api/', express.static(path.join(__dirname, 'public')));
app.use('/api/', express.static(path.join(__dirname, 'routes')));


app.use('/api/activity', Activity);
app.use('/api/userdetails', userdetails);
app.use('/api/usertype', Usertype);
app.use('/api/splashscreen', Splashscreen);
app.use('/api/demoscreen', Demoscreen);

app.use('/api/petdetails',petdetails);
app.use('/api/doctordetails',doctordetails);
app.use('/api/temdoctordetails',temdoctordetails);
app.use('/api/service_provider',vendordetails);
app.use('/api/locationdetails',locationdetails);

app.use('/api/appointments',appointments);
app.use('/api/pettype',pettype);
app.use('/api/breedtype',breedtype);
app.use('/api/notification',notification);
app.use('/api/new_doctortime',New_DoctorAvailable);
app.use('/api/holiday',HolidayRouter);
app.use('/api/homebanner',homebannerdetails);

app.use('/api/doctorbanner',doctorbannerdetails);
app.use('/api/servicebanner',servicebannerdetails);


app.use('/api/doctor_spec',doctor_sepc);
app.use('/api/sp_spec',sp_sepc);
app.use('/api/prescription',PrescriptionRouter);

app.use('/api/sp_holiday',SP_Holiday);
app.use('/api/sp_services',SP_services);
app.use('/api/sp_appointments',SP_appointments);
app.use('/api/sp_available_time',SP_available_time);







app.use('/api/product_vendor',product_vendor);
app.use('/api/product_cate',product_cate);
app.use('/api/product_subcat',product_subcat);
app.use('/api/product_details',product_details);



app.use('/api/order_details',order_details);
app.use('/api/vendor_banner_detail',vendor_banner_detail);
app.use('/api/product_cart_detail',product_cart_detail);



app.use('/api/vendor_order_booking',vendor_order_booking);
app.use('/api/vendor_order_detail',vendor_order_detail);


app.use('/api/shipping_address',shippingdetails);


app.use('/api/vendor_order_group',vendor_order_group);
app.use('/api/petlover_order_group',petlover_order_group);


app.use('/api/doctor_fav',Doctor_fav);
app.use('/api/sp_fav',Sp_fav);
app.use('/api/product_fav',Product_fav);


app.use('/api/newproduct_detail',newproduct_detail);

app.use('/api/diagnosis',diagnosis);
app.use('/api/sub_diagnosis',sub_diagnosis);
app.use('/api/walkin_appointment',walkin_appointment);
app.use('/api/healthissue',healthissue);
app.use('/api/minibanner',minibanner);

app.use('/api/sos_pet',sos_pet);
app.use('/api/coupon_code',coupon_code);
app.use('/api/refund_coupon',refund_coupon);
app.use('/api/block_slot',block_slot);


app.use('/api/familymember',familymember);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
