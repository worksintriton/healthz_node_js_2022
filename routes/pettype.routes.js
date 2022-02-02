var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var pettypeModel = require('./../models/pettypeModel');
var product_categoriesModel = require('./../models/product_categoriesModel');


router.post('/create', async function(req, res) {
  try{
 let pettypedetails  =  await pettypeModel.findOne({pet_type_title:req.body.pet_type_title});

  if(pettypedetails == null){
    await pettypeModel.create({
            pet_type_title:  req.body.pet_type_title,
            user_type_value : req.body.user_type_value,
            pet_type_img : req.body.pet_type_img || "",
            date_and_time : req.body.date_and_time,
            delete_status : false
        }, 
        function (err, user) {
          console.log(user)
        res.json({Status:"Success",Message:"PET type Added successfully", Data : user ,Code:200}); 
        });
  }else{
      res.json({Status:"Failed",Message:"already pettype added", Data : {},Code:500});
  }

       
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});


router.post('/filter_date', function (req, res) {
        pettypeModel.find({delete_status : false}, function (err, StateList) {
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
      pettypeModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"PET type Deleted", Data : {} ,Code:200});     
      });
});


router.post('/getlist_id', function (req, res) {
        pettypeModel.find({Person_id:req.body.Person_id}, function (err, StateList) {
          res.json({Status:"Success",Message:"PET type List", Data : StateList ,Code:200});
        });
});



router.get('/getlist', function (req, res) {
        pettypeModel.find({delete_status : false}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"PET type Details", Data : Functiondetails ,Code:200});
        });
});


router.get('/mobile/getlist',async function (req, res) {
        let product_categories  =  await product_categoriesModel.find({delete_status : false});
        console.log(product_categories);
        pettypeModel.find({delete_status : false}, function (err, Functiondetails) {
          Functiondetails.sort(function(a, b){
          if(a.pet_type_title < b.pet_type_title) { return -1; }
          if(a.pet_type_title > b.pet_type_title) { return 1; }
          return 0;
          });
          let a = {
            usertypedata : Functiondetails,
            product_categories : product_categories
          }
          res.json({Status:"Success",Message:"Pet type details", Data : a ,Code:200});
        });
});

router.post('/edit', function (req, res) {
        pettypeModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"PET type Updated", Data : UpdatedDetails ,Code:200});
        });
});

router.post('/delete', function (req, res) {
 let c = {
    delete_status : true
  }
  pettypeModel.findByIdAndUpdate(req.body._id, c, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Location Deleted successfully", Data : UpdatedDetails ,Code:200});
  });
});



// // DELETES A USER FROM THE DATABASE
router.post('/admin_delete', function (req, res) {
      pettypeModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"PET type Deleted successfully", Data : {} ,Code:200});
      });
});


module.exports = router;
