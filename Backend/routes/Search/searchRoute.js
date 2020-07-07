
/*
 * Purpose : This page is for Connect to Mysql Backend
 * Devlopers : Sethu
 */

var express = require('express');
var router = express.Router();
const connection = require("../../bin/connection");

router.post('/getDetails', function (req, res, next) {
 
    if(req.body.searchData != "" && req.body.location == ""){
    connection.query("SELECT * FROM `jobDetails` INNER JOIN `companyDetails` ON `jobDetails`.`companyId` = `companyDetails`.`companyId` AND jobDetails.jobProfile LIKE '%"+ req.body.searchData +"%'", function (err, result, fields) {   
        if (!err)          
            res.json({
                status: "success", //success response
                data: result
            });
        else
            res.json([
                {
                    status: "failed", //failure response
                    errMsg: "Error while performing query."
                }
            ]);
    });
    }
    else if (req.body.location != "" && req.body.searchData == "") {
        connection.query("SELECT * FROM `jobDetails` INNER JOIN `companyDetails` ON `jobDetails`.`companyId` = `companyDetails`.`companyId` AND `companyDetails`.`branch` LIKE '%" + req.body.location + "%'", function (err, result, fields) {
       
            if (!err)

                res.json({
                    status: "success", //success response
                    data: result
                });
            else
                res.json([
                    {
                        status: "failed", //failure response
                        errMsg: "Error while performing query."
                    }
                ]);
        });
    }
    else if (req.body.searchData == "" && req.body.location == "") {
        connection.query("SELECT * FROM `jobDetails` ", function (err, result, fields) {
          
            if (!err)

                res.json({
                    status: "success", //success response
                    data: result
                });
            else
                res.json([
                    {
                        status: "failed", //failure response
                      errMsg: "Error while performing query."
                    }
                ]);
        });
    }
    else if(req.body.searchData != "" && req.body.location != "") {
        connection.query("SELECT * FROM `jobDetails` INNER JOIN `companyDetails` ON `jobDetails`.`companyId` = `companyDetails`.`companyId` AND `companyDetails`.`branch` LIKE '%" + req.body.location + "%' AND `jobDetails`.`jobProfile` LIKE '%" + req.body.searchData + "%'", function (err, result, fields) {
           
            if (!err)

                res.json({
                    status: "success", //success response
                    data: result
                });
            else
                res.json([
                    {
                        status: "failed", //failure response
                        errMsg: "Error while performing query."
                    }
                ]);
        });
    }
});



 router.post('/scrapData', function (req, res, next) {

    console.log(req.body)
 
    if(req.body.searchData != "" && req.body.location == ""){
    connection.query("SELECT * FROM `jobDetails2` where role LIKE '%"+ req.body.searchData +"%' LIMIT 30", function (err, result, fields) {
       
        if (!err)
            
            res.json({
                status: "success", //success response
                data: result
            });
        else
            res.json([
                {
                    status: "failed", //failure response
                    errMsg: "Error while performing query."
                }
            ]);
    });
    }
    else if (req.body.location != "" && req.body.searchData == "") {
        connection.query("SELECT * FROM `jobDetails2` where `Location` LIKE '%" + req.body.location + "%' LIMIT 30", function (err, result, fields) {
       
            if (!err)

                res.json({
                    status: "success", //success response
                    data: result
                });
            else
                res.json([
                    {
                        status: "failed", //failure response
                        errMsg: "Error while performing query."
                    }
                ]);
        });
    }
    else if (req.body.searchData == "" && req.body.location == "") {

        connection.query("SELECT * FROM `jobDetails2` LIMIT 30", function (err, result, fields) {
            console.log(result)
            if (!err)

                res.json({
                    status: "success", //success response
                    data: result
                });
            else
                res.json([
                    {
                        status: "failed", //failure response
                        errMsg: "Error while performing query."
                    }
                ]);
        });
    }
    else if(req.body.searchData != "" && req.body.location != "") {
        connection.query("SELECT * FROM `jobDetails2` where `Location` LIKE '%" + req.body.location + "%' AND `role` LIKE '%" + req.body.searchData + "%' LIMIT 30", function (err, result, fields) {
           
            if (!err)

                res.json({
                    status: "success", //success response
                    data: result
                });
            else
                res.json([
                    {
                        status: "failed", //failure response
                        errMsg: "Error while performing query."
                    }
                ]);
        });
    }})
module.exports = router
