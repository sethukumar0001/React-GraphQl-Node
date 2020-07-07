
/*
 * Purpose : This page is for Connect to Mysql Backend
 * Devlopers : Sethu
 */

var express = require('express');
var router = express.Router();
const connection = require("../../bin/connection");
const bcrypt = require('bcryptjs')
const keys = require('../../config/keys')
const jwt = require("jsonwebtoken");



router.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

router.post('/userRegistration', (req, res) => {

  console.log(req.body)
  connection.query("SELECT count(*) as total FROM `userRegistration` WHERE `email` = ?",[req.body.email],
    function (err, result) {
      console.log(result[0].total);

      if(result[0].total == 0){
        var userData  ={
          userName:req.body.userName,
          email:req.body.email,
          mobileNumber:req.body.number,
          password:req.body.password
        }
        var user = userData;
        bcrypt.hash(user.password, 10, function(err, hash){
          if(err) console.log(err);
          user.password = hash;
        /* insert new records in userRegistration table*/
        connection.query("INSERT INTO `userRegistration`(`userName`, `email`, `mobileNumber`, `password`,`role`) VALUES (?,?,?,?,?)",[user.userName,user.email,user.mobileNumber,hash,""],
          function (err, result) {
            if (err) {
              throw err;
            } else {
              res.status(200).json({ result: "Registration successful" }); //success response
            }
          }
        );
      })} else {
        res.status(200).json({ result: "Email Already Registered" }); //failure response
      }
    }
  );
})



router.post('/userLogin', function (req, res, next) {
  console.log(req.body)
  connection.query(
    "SELECT *,count(*) as total FROM `userRegistration` WHERE `email` =?",[req.body.email],
    function (err, result) {
      if(result[0].total === 0){
        return res.status(200).json({message: 'Email Not Found'})
      }else{
        bcrypt.compare(req.body.password, result[0].password).then(isMatch => {
          if (isMatch) {
            // User matched
            // Create JWT Payload
            const payload = {
              id: result[0].userId,
              userName: result[0].userName,
              role:result[0].role
            };
            jwt.sign(
              payload,
              keys.secretOrKey,
              {
                expiresIn: 31556926 // 1 year in seconds
              },
              (err, token) => {
                res.status(200).json({
                  success: true,
                  token: "Bearer " + token,
                  message: 'Login successful'
                  
                });
              }
            );
          }
         else {
          return res.status(200).json({ message: 'Wrong credentials' });
        }
        })
      }
      }
    )})
module.exports = router