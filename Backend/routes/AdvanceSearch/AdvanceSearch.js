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

router.get('/advanceSearch', (req, res) => {
    connection.query(
        "SELECT * FROM jobDetails2 limit 10",
        req.body.id,
        function (err, result, fields) {
          if (!err) {
            res.json({
              status: "success",
              data: result
            });
          } else {
            res.json([
              {
                status: "failed",
                errMsg: "Error while performing query."
              }
            ]);
          }
        }
      );
 
})