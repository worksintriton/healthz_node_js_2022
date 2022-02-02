var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var minibannerModel = require('./../models/minibannerModel');


router.post('/create', async function(req, res) {
  try{

        await minibannerModel.create({
            img_path:  req.body.img_path,
            img_title : req.body.img_title,
            img_describ : req.body.img_describ,
            img_index : req.body.img_index,
            show_status : req.body.show_status,
            date_and_time : req.body.date_and_time,
            delete_status : false
        }, 
        function (err, user) {
          console.log(user)
        res.json({Status:"Success",Message:"Mini Banner Added successfully", Data : user ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});


router.post('/filter_date', function (req, res) {
        minibannerModel.find({}, function (err, StateList) {
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
              res.json({Status:"Success",Message:"Mini Banner  List", Data : final_Date ,Code:200});
            }
          }
        });
});



router.get('/deletes', function (req, res) {
      minibannerModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"Mini Banner Deleted", Data : {} ,Code:200});     
      });
});


router.post('/getlist_id', function (req, res) {
        minibannerModel.find({Person_id:req.body.Person_id}, function (err, StateList) {
          res.json({Status:"Success",Message:"Mini Banner List", Data : StateList ,Code:200});
        });
});



router.get('/getlist', function (req, res) {
        minibannerModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"Mini Banner  Details", Data : Functiondetails ,Code:200});
        });
});



router.get('/mobile/getlist', function (req, res) {
        minibannerModel.find({show_status:true}, function (err, Functiondetails) {
          let a = {
            Demodata : Functiondetails
          }
          res.json({Status:"Success",Message:"Mini Banner Details", Data : a ,Code:200});
        });
});

router.post('/edit', function (req, res) {
        minibannerModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Mini Banner  Updated", Data : UpdatedDetails ,Code:200});
        });
});

router.post('/delete', function (req, res) {
 let c = {
    delete_status : true
  }
  minibannerModel.findByIdAndUpdate(req.body._id, c, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Mini Banner Deleted successfully", Data : UpdatedDetails ,Code:200});
  });
});



// // DELETES A USER FROM THE DATABASE
router.post('/admin_delete', function (req, res) {
      minibannerModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Mini Banner Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;
