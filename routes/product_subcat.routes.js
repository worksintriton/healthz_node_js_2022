var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var product_subcatModel = require('./../models/product_subcatModel');


router.post('/create', async function(req, res) {
   let userdetails  =  await product_subcatModel.findOne({product_sub_cate:req.body.product_sub_cate});
   console.log(userdetails);
   if(userdetails == null){
  try{
        await product_subcatModel.create({
            img_path:  req.body.img_path,
            product_categ : req.body.product_categ,
            product_sub_cate : req.body.product_sub_cate,
            img_index : req.body.img_index,
            show_status : req.body.show_status,
            date_and_time : req.body.date_and_time,
            delete_status : false
        }, 
        function (err, user) {
          console.log(user)
        res.json({Status:"Success",Message:"product Sub categories screen Added successfully", Data : user ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
   }
   else{
            res.json({Status:"Failed",Message:"This Sub categories already added", Data : {} ,Code:404}); 
   }

});

router.post('/filter_date', function (req, res) {
        product_subcatModel.find({}, function (err, StateList) {
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
              res.json({Status:"Success",Message:"Demo screen List", Data : final_Date ,Code:200});
            }
          }
        });
});


router.get('/deletes', function (req, res) {
      product_subcatModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"product Sub categories screen  Deleted", Data : {} ,Code:200});     
      });
});


router.post('/getlist_id', function (req, res) {
        product_subcatModel.find({product_categ:req.body.product_categ}, function (err, StateList) {
          res.json({Status:"Success",Message:"product Sub categories screen  List", Data : StateList ,Code:200});
        });
});



router.get('/getlist', function (req, res) {
        product_subcatModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"product Sub categories screen  Details", Data : Functiondetails ,Code:200});
        });
});


router.get('/mobile/getlist', function (req, res) {
        product_subcatModel.find({show_status:true}, function (err, Functiondetails) {
          let a ={
             SplashScreendata : Functiondetails
          }
          res.json({Status:"Success",Message:"product Sub categories screen  Details", Data : a ,Code:200});
        });
});


router.post('/edit', function (req, res) {
        product_subcatModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"product Sub categories screen  Updated", Data : UpdatedDetails ,Code:200});
        });
});

router.post('/delete', function (req, res) {
 let c = {
    delete_status : true
  }
  product_subcatModel.findByIdAndUpdate(req.body._id, c, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Location Deleted successfully", Data : UpdatedDetails ,Code:200});
  });
});


// // DELETES A USER FROM THE DATABASE
router.post('/admin_delete', function (req, res) {
      product_subcatModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"product Sub categories screen Deleted successfully", Data : {} ,Code:200});
      });
});

module.exports = router;
