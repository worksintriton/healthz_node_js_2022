var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var SP_servicesMode = require('./../models/SP_servicesModel');


router.post('/create', async function(req, res) {
   let userdetails  =  await SP_servicesMode.findOne({img_title:req.body.img_title});
   console.log(userdetails);
   if(userdetails == null){
  try{
        await SP_servicesMode.create({
            img_path:  req.body.img_path,
            img_title : req.body.img_title,
            img_index : req.body.img_index,
            img_subtitle : req.body.img_subtitle,
            img_banner : req.body.img_banner,
            show_status : req.body.show_status,
            date_and_time : req.body.date_and_time,
            delete_status : false
        }, 
        function (err, user) {
          console.log(user)
        res.json({Status:"Success",Message:"SP_servicesMode screen Added successfully", Data : user ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
   }
   else{
            res.json({Status:"Failed",Message:"This Service already added", Data : {} ,Code:404}); 
   }

});

router.post('/filter_date', function (req, res) {
        SP_servicesMode.find({}, function (err, StateList) {
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


router.get('/deletes', function (req, res) {
      SP_servicesMode.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"SP_servicesMode screen  Deleted", Data : {} ,Code:200});     
      });
});







router.post('/getlist_id', function (req, res) {
        SP_servicesMode.find({Person_id:req.body.Person_id}, function (err, StateList) {
          res.json({Status:"Success",Message:"SP_servicesMode screen  List", Data : StateList ,Code:200});
        });
});



router.get('/getlist', function (req, res) {
  let a  =  [
      {

        "time" : '15 mins'
      },
      {

        "time" : '30 mins'
      },
      {

        "time" : '45 mins'
      },
      {

        "time" : '1 hrs'
      },
      {

        "time" : '2 hrs'
      },
      {

        "time" : '3 hrs'
      }
      ];
        SP_servicesMode.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"SP_servicesMode screen  Details", Data : Functiondetails , time_list : a , Code:200});
        });
});


router.get('/mobile/getlist', function (req, res) {
        SP_servicesMode.find({show_status:true}, function (err, Functiondetails) {
          let a ={
             SplashScreendata : Functiondetails
          }
          res.json({Status:"Success",Message:"SP_servicesMode screen  Details", Data : a ,Code:200});
        });
});


router.post('/edit', function (req, res) {
        SP_servicesMode.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"SP_servicesMode screen  Updated", Data : UpdatedDetails ,Code:200});
        });
});


router.post('/delete', function (req, res) {
 let c = {
    delete_status : true
  }
  SP_servicesMode.findByIdAndUpdate(req.body._id, c, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Location Deleted successfully", Data : UpdatedDetails ,Code:200});
  });
});


// // DELETES A USER FROM THE DATABASE
router.post('/admin_delete', function (req, res) {
      SP_servicesMode.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"SP_servicesMode screen Deleted successfully", Data : {} ,Code:200});
      });
});

module.exports = router;
