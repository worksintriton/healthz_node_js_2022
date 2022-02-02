var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
//var VerifyToken = require('./VerifyToken');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
// var Patient = require('./../models/PatientModel');
// var Doctor = require('./../models/DoctorModel');
var family = require('./../models/familymemberModel');
var responseMiddleware = require('./../middlewares/response.middleware');
router.use(responseMiddleware());



router.post('/create', async function(req, res) {
  console.log(req.body);
  try{
        await family.create({
  user_id: req.body.user_id || '',
  name: req.body.name || '',
  gender : req.body.gender || '',
  relation_type : req.body.relation_type || '',
  health_issue : req.body.health_issue || '',
  dateofbirth : req.body.dateofbirth || '',
  anymedicalinfo : req.body.anymedicalinfo || '',
  covide_vac : req.body.covide_vac || '',
  weight: req.body.weight || '',
  pic: req.body.pic || [],
          delete_status : false
        }, 
       async function (err, user) {
          console.log(user);
             console.log(err);
        res.json({Status:"Success",Message:"Added successfully", Data : user,Code:200}); 
        });
}
catch(e){
      res.error(500, "Internal server error");
}
});



router.get('/dropdown', function (req, res) {
// mother
// mom
// father
// dad
// parent
// children
// son
// daughter
// sister
// brother
// grandmother
// grandfather
// grandparent
// grandson
// granddaughter
// grandchild
// aunt
// uncle
// niece
// nephew
// cousin
// husband
// wife
// sister-in-law
// brother-in-law
// mother-in-law
// father-in-law
// partner
// fiancé
// fiancée
  let a  = [
   {name : "Self"},
   {name : "Mother"},
   {name : "Husband"},
   {name : "Father"},
   {name : "Son"},
   {name : "Daughter"},
   {name : "Wife"},
   {name : "Friend"},
   {name : "Others"},
  ]
  res.json({Status:"Success",Message:"Family Members List", Data : a,Code:200});
});





router.get('/getlist', function (req, res) {
        family.find({}, function (err, Familydetails) {
          res.json({Status:"Success",Message:"Familydetails", Data : Familydetails ,Code:200});
        });
});



router.post('/getlist_by_userid', function (req, res) {
        family.find({user_id: req.body.user_id,delete_status : false}, function (err, Familydetails) {
          res.json({Status:"Success",Message:"Family details", Data : Familydetails ,Code:200});
        });
});


router.post('/getlist_relation', function (req, res) {
        family.find({Patient_id:req.body.Patient_id}, function (err, Familydetails) {
          var data = [];
		  if(0 == Familydetails.length){
                 res.json({Status:"Success",Message:"Relation type List", Data : Familydetails ,Code:200});
           }
		console.log(Familydetails);
          for(var a = 0 ; a < Familydetails.length ; a ++){
            let b = {
              Relation_type : Familydetails[a].Relation,
              Family_id : Familydetails[a]._id,
              Family_name : Familydetails[a].Name
            }
               data.push(b);
               if(a == Familydetails.length - 1){
                 res.json({Status:"Success",Message:"Relation type List", Data : data ,Code:200});
               }
          }
        });
});

router.get('/deletes', function (req, res) {
      family.remove({}, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
             res.json({Status:"Success",Message:"family Details Deleted", Data : {} ,Code:200});     
      });
});



router.post('/mobile_delete', function (req, res) {
  let a  = {
     delete_status : true
  }
        family.findByIdAndUpdate(req.body._id, a, {new: true}, function (err, user) {
            if (err) return res.status(500).send("There was a problem updating the user.");
                       res.json({Status:"Success",Message:"Update Successfully", Data : user,Code:200}); 

        });
});



router.post('/edit', function (req, res) {
        family.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, user) {
            if (err) return res.status(500).send("There was a problem updating the user.");
                       res.json({Status:"Success",Message:"Update Successfully", Data : user,Code:200}); 

        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      family.findByIdAndRemove(req.body.pid, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
          res.json({Status:"Success",Message:"Member Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;