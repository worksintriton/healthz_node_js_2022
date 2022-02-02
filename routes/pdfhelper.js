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
var fs = require('fs');
var pug = require ('pug');
var BaseUrl = "https://petfolio.app";
var app = express();
app.use('/api/', express.static(path.join(__dirname, 'public')));

exports.pdfgenerator = async function (pet_details,user_details,doctordata,Prescription_data,doctor_commeents,allergies,diagnosis,sub_diagnosis) {
   try{
    //console.log(Prescription_data);
    console.log("image path",doctordata);
    console.log("pet_details",pet_details);
    console.log("user_details",user_details);
    console.log("allergies",allergies);
    console.log("diagnosis",diagnosis);
    console.log("sub_diagnosis",sub_diagnosis);


       var source = fs.readFileSync(path.resolve(__dirname, "./views/doctor.pug"),'utf-8');
       //console.log(source)
     var specialization = "";
     for(let a  = 0 ; a < Prescription_data.length ; a++){
      if(Prescription_data[a].consumption.morning == true){
       Prescription_data[a].consumption.morning = 1;
      }
      if(Prescription_data[a].consumption.evening == true){
       Prescription_data[a].consumption.evening = 1;
      }
      if(Prescription_data[a].consumption.night == true){
       Prescription_data[a].consumption.night = 1;
      }
      if(Prescription_data[a].consumption.morning == false){
       Prescription_data[a].consumption.morning = 0;
      }
      if(Prescription_data[a].consumption.evening == false){
       Prescription_data[a].consumption.evening = 0;
      }
      if(Prescription_data[a].consumption.night == false){
       Prescription_data[a].consumption.night = 0;
      }
       let temp_data = 'Morning - '+Prescription_data[a].consumption.morning+", Afternoon - "+Prescription_data[a].consumption.evening+", Night - "+Prescription_data[a].consumption.night;
       console.log(temp_data);
        Prescription_data[a].consumption = ""+temp_data;
     }

     for(var i=0; i< doctordata.specialization.length; i++){
            
            if(i == 0){
              specialization = doctordata.specialization[i].specialization;
            }
            else{
              specialization = specialization + "," + doctordata.specialization[i].specialization;
            }
     }
     console.log(specialization)
     let template = pug.compile(source);
    








     let data = {
      doctorname : doctordata.dr_name,
      doctorsepecilization: specialization,
      doctorsignature: doctordata.signature,
      owner_name : user_details.first_name + " " + user_details.last_name,
      pet_type :  pet_details.pet_type,
      breed : pet_details.pet_breed,
      sex : pet_details.pet_gender,
      weight : pet_details.pet_weight,
      age : pet_details.pet_age,
      allegroies : allergies,
      Prescription_data:Prescription_data,
      doctor_commeents:doctor_commeents,
      diagnosis : diagnosis || "",
      sub_diagnosis : sub_diagnosis || "", 
     }
     console.log(data);
     let html = template(data);
     let text = new Date().getTime();



        var options = { format: 'Letter', height: "16in",
  width: "18in"};
        var filepath = __dirname + '/public/' + text + '.pdf' ;
        console.log("beffore PDF TRm",filepath);
        var filepart = filepath.slice(38,110);
        console.log("filepart_1",filepath)
        var Finalpath = BaseUrl +'/api/public/' + filepart;
        console.log("Finalpath",Finalpath)
         return new Promise(async function (resolve, reject) {
                 await pdf.create(html, options).toFile(filepath, function(err, response) {
                    if (err){
                        console.log("error",err)
                        reject( false);
                    }
                    resolve(Finalpath);
                });
            });
         return Finalpath;

      }
      catch(e){
        console.log("error in catch", e)
       return false;
      }
}
