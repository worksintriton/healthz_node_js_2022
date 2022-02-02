var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var product_categoriesModel = require('./../models/product_categoriesModel');


router.post('/create', async function(req, res) {
   let userdetails  =  await product_categoriesModel.findOne({product_cate:req.body.product_cate});
   console.log(userdetails);
   if(userdetails == null){
  try{
        await product_categoriesModel.create({
            img_path:  req.body.img_path,
            product_cate : req.body.product_cate,
            img_index : req.body.img_index,
            show_status : req.body.show_status,
            date_and_time : req.body.date_and_time,
            delete_status : false
        }, 
        function (err, user) {
          console.log(user)
        res.json({Status:"Success",Message:"product categories screen Added successfully", Data : user ,Code:200}); 
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
        product_categoriesModel.find({}, function (err, StateList) {
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
      product_categoriesModel.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"product categories screen  Deleted", Data : {} ,Code:200});     
      });
});


router.post('/getlist_id', function (req, res) {
        product_categoriesModel.find({Person_id:req.body.Person_id}, function (err, StateList) {
          res.json({Status:"Success",Message:"product categories screen  List", Data : StateList ,Code:200});
        });
});



router.get('/getlist', function (req, res) {
        product_categoriesModel.find({}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"product categories screen  Details", Data : Functiondetails ,Code:200});
        });
});



router.post('/mobile_getlist_id', function (req, res) {
          if(req.body.cat_id == ''){
          product_categoriesModel.find({delete_status : false}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"product categories list Details", Data : Functiondetails ,Code:200});
        }).skip(+req.body.skip_count).limit(10);
          }else{
        product_categoriesModel.find({_id:req.body.cat_id,delete_status : false}, function (err, Functiondetails) {
          res.json({Status:"Success",Message:"product categories list Details", Data : Functiondetails ,Code:200});
        }).skip(+req.body.skip_count).limit(10);
          }
});



router.get('/getlist_cat', function (req, res) {
        product_categoriesModel.find({delete_status : false}, function (err, StateList) {
          if(StateList.length == 0){
            res.json({Status:"Success",Message:"product categories screen  List", Data : [] ,Code:200});
          } else{
            let final_data = [];
            for(let a = 0 ; a < StateList.length ; a ++){
                    let c = {
                      _id : StateList[a]._id,
                      product_cate_name : StateList[a].product_cate,
                    }
                    final_data.push(c);
                    if(a == StateList.length - 1){
                    res.json({Status:"Success",Message:"Dropdown product categories screen  List", Data : final_data ,Code:200});
                    }
            }
          }
        });
});




router.get('/mobile/getlist', function (req, res) {
        product_categoriesModel.find({show_status:true}, function (err, Functiondetails) {
          let a ={
             SplashScreendata : Functiondetails
          }
          res.json({Status:"Success",Message:"product categories screen  Details", Data : a ,Code:200});
        });
});


router.post('/edit', function (req, res) {
        product_categoriesModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"product categories screen  Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      product_categoriesModel.findByIdAndRemove(req.body._id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"product categories screen Deleted successfully", Data : {} ,Code:200});
      });
});

module.exports = router;
