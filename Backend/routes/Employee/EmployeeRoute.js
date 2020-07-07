
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

router.post('/userDetails', (req, res) => {


  console.log(req.body.data,"+++++employee data");

  /*  COUNT (*) function returns the number of rows in userDetails */

  connection.query(
    "SELECT count(*) as total FROM userDetails WHERE userId = ?",
    [req.body.data.userId],
    function (error, results, fields) {
      if (results[0].total == 1) {
        /*  UPDATE the  Details of userRegistration , userDetails,skillTable   */
        connection.query(
          "UPDATE userRegistration SET userName = ?, email =? WHERE userId=?",
          [req.body.data.Name, req.body.data.Email, req.body.data.userId],
          function (err, result) {
            if (!err) {
              connection.query(
                "UPDATE userDetails SET graduation =?, visaType =? WHERE userId=?",
                [
                  req.body.data.LatestDegree,
                  req.body.data.Visa,
                  req.body.data.userId
                ],
                function (err, result) {
                  if (!err) { 
                    connection.query(
                      "UPDATE interestedSectors SET sector =? WHERE userId=?",
                      [req.body.data.AreaOfInterest, req.body.data.userId],
                      function (err, result) {
                        if (!err) {
                          connection.query(
                            "UPDATE interestedLocations SET location =? WHERE userId=?",
                            [req.body.data.Location, req.body.data.userId],
                            function (err, result) {
                              if (!err) {
                                res.status(200).json([
                                  {
                                    status: "success" // success response
                                  }
                                ]);
                              }
                            }
                          );
                        }
                      }
                    );
                  } else {
                    res.status(502).json([
                      {
                        status: "failed", // failure response
                        errMsg: "Error while inserting data."
                      }
                    ]);
                  }
                }
              );
            }
          }
        );
      } else {
        /* insert new records in  userDetails table*/
        console.log("insert");
        console.log(req.body.data.userId,req.body.data.LatestDegree ,req.body.data.completion_date,req.body.data.Visa)
        connection.query(
          "INSERT INTO `userDetails`(`userId`,`graduation`,`gradDate`,`college`,`university`,`visaType`) VALUES ('" +
          req.body.data.userId +
          "','" +
          req.body.data.LatestDegree +
          "','" +
          req.body.data.PassingYear +
          "','','','" +
          req.body.data.Visa +
          "')",
          function (err, result) {
            if (!err) {
              /* insert new records in skilltable table*/
              connection.query(
                "INSERT INTO `interestedSectors`(`userId`,`sector`) VALUES ('" +
                req.body.data.userId +
                "','" +
                req.body.data.AreaOfInterest +
                "')",
                function (err, result) {
                  if (!err) {
                    connection.query(
                      "INSERT INTO `interestedLocations`(`userId`,`locationType`,`location`) VALUES ('" +
                      req.body.data.userId +
                      "','','" +
                      req.body.data.Location +
                      "')",
                      function (err, result3) {
                        if (result3) {
                          res.status(200).json([
                            {
                              status: "success", // success response
                              insertID: result3.insertId
                            }
                          ]);
                        } else {
                          res.status(502).json([
                            {
                              status: "failed", //  failure response
                              errMsg: "Error while inserting data."
                            }
                          ]);
                        }
                      }
                    );
                  }
                }
              );
            }
          }
        );
      }
    }
  );


})



router.post('/getUserData', function (req, res, next) {

  connection.query('SELECT *,count(*) as total FROM userDetails as a INNER JOIN userRegistration as b on a.userId = b.userId INNER JOIN interestedSectors as c on c.userId = b.userId INNER JOIN interestedLocations as d on d.userId=c.userId WHERE a.userId=?', req.body.userId, function (err, result) {
   console.log(result)
    if (result) {

      res.json({
        status: "success", //success response
        data: result
      });
    }
    else {
      connection.query(
        "SELECT * FROM  userRegistration  WHERE userId=?",
        req.body.userId,
        function (err, result, fields) {
          if (!err) {
            res.json({
              status: "success", //success response
              data: result
            });
          }
        })
    }
  }
  );
})


router.post('/employerPostedJob', function (req, res, next) {
  connection.query("SELECT t1.*, IFNULL(ua.applicationId, 'NA') applicationId, IFNULL(ua.userId, 'NA') appliedUser, IFNULL(ua.jobStatus, 'NA') jobStatus FROM (SELECT jd.*, ur.userId FROM `jobDetails` jd CROSS JOIN userRegistration ur) t1 LEFT JOIN userJobApplication ua ON ua.jobId= t1.jobId AND ua.userId= t1.userId WHERE t1.userId=?",
  [req.body.userId],function (err, result, fields) {
    if (!err)
      res.json({
        status: "success", //success response
        data: result
      });
    else
      res.json([
        {
          status: "failed", //failure  response
          errMsg: "Error while performing query."
        }
      ]);
  }
)

})


router.get('/getUserJobApplication', function (req, res, next) {
  connection.query("SELECT * FROM userJobApplication",
  function (err, result, fields) {
    if (!err)
      res.json({
        status: "success", //success response
        data: result
      });
    else
      res.json([
        {
          status: "failed", //failure  response
          errMsg: "Error while performing query."
        }
      ]);
  }
)

})


router.post('/jobApply', function (req, res, next) {

  console.log(req.body.jobId);
  
  connection.query("SELECT companyId,count(*) as total FROM `jobDetails` where jobId= ?", req.body.jobId,
  function (err, result) {
    if (result) {

      connection.query("select count(*) as total from userJobApplication where jobId=? and companyId=? and userId = ?", [req.body.jobId,result[0].companyId,req.body.userId], function (err, result1) {
        if (result1[0].total == 1) {
          connection.query(
            "UPDATE userJobApplication SET userId=?,jobId=?,jobStatus=?,companyId=? where jobId=?", [req.body.userId, req.body.jobId, req.body.jobStatus, req.body.companyId, req.body.jobyId],
            function (err, result) {
              if (!err) {
                res.status(200).json({ status: "success" }); //success response
              } else {
                res.status(500).json({ status: "failure" }); //failure response
                throw err;
              }
            }
          )
        }
        else {
          connection.query(
            "INSERT INTO `userJobApplication`(`userId`,`jobId`,`jobStatus`,`companyId`) VALUES ('" +
            req.body.userId +
            "','" +
            req.body.jobId +
            "','" +
            req.body.jobStatus +
            "','" +
            result[0].companyId +
            "')",
            function (err, result) {
              if (!err) {
                res.status(200).json({ status: "success" }); //success response
              } else {
                res.status(500).json({ status: "failure" }); //failure response
                throw err;
              }
            }

          );
        }
      }
      );
    };
  })


})


router.post('/applicationSkills', function (req, res, next) {

  var dataArray = [];

  connection.query(
    "SELECT * FROM userJobApplication INNER JOIN jobDetails ON jobDetails.jobId=userJobApplication.jobId INNER JOIN companyDetails ON companyDetails.companyId=userJobApplication.companyId WHERE userJobApplication.userId=?",
    req.body.userId, function (err, resultData) {

      if (!err) {
        var length = resultData.length;
        resultData.map((jobData, i) => {
          connection.query(
            "SELECT a.skill,b.jobId FROM `skillTable` AS a INNER JOIN `jobRequiredSkills` AS b ON a.skillId = b.skillId WHERE b.jobId=?",
            jobData.jobId,
            function (err, result) {
             
              if (!err) {
                let x = result.map(x => {
                  return x.skill;
                });
             
                dataArray.push({
                  jobData: jobData,
                  skills: x
                });

              }
              if (length === i + 1) {
                res.json({
                  status: "success", //success response
                  data: dataArray
                });
              }
            }
          )
        });
      } else {
        res.status(502).json([
          {
            status: "failed", //  failure response
            errMsg: "Error while inserting data."
          }
        ]);
      }
    }
  );
});

router.post('/getProfileData', function (req, res, next) {

  connection.query('SELECT a.`userId`, a.`userName`, a.`email`, a.`mobileNumber`, a.`jobProfile`,b.graduation,b.gradDate,b.college,b.university,b.visaType FROM `userRegistration` AS a INNER JOIN `userDetails` AS b ON a.userId = b.userId WHERE a.userId = ?', req.body.userId, function (err, result) {
    if (result) {
      res.json({
        status: "success", //success response
        data: result
      });
    }else{
      res.json({
        status: "Failure", //failure response
        data: "Problem in fetching data.."
      });
    }
  }
  );
})


router.post('/applyStatusUpdate', function (req, res, next) {
  console.log(req.body.jobStatus);
  console.log(req.body.userId);
  console.log(req.body.jobId);

  connection.query("UPDATE userJobApplication SET jobStatus=? where userId=? and jobId=? ",[req.body.jobStatus,req.body.userId,req.body.jobId],
  function (err, result, fields) {
    if (!err)
      res.json({
        status: "success", //success response
        data: result
      });
    else
      res.json([
        {
          status: "failed", //failure  response
          errMsg: "Error while performing query."
        }
      ]);
  }
)

})

router.post('/curentApplyStatus', function (req, res, next) {
  console.log(req.body.userId);

  connection.query("select jobStatus from userJobApplication where userId = ? ",[req.body.userId],
  function (err, result, fields) {
    if (!err)
      res.json({
        status: "success", //success response
        data: result
      });
    else
      res.json([
        {
          status: "failed", //failure  response
          errMsg: "Error while performing query."
        }
      ]);
  }
)

})

router.post('/EmpployeeHomeSearch', function (req, res, next) {
  console.log(req.body.userId);
  if(req.body.searchData != "" && req.body.location == ""){
    connection.query("SELECT * FROM `jobDetails` where jobProfile LIKE '%"+ req.body.searchData +"%' LIMIT 30", function (err, result, fields) {
       
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
        connection.query("SELECT * FROM `jobDetails` where `Location` LIKE '%" + req.body.location + "%' LIMIT 30", function (err, result, fields) {
       
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

        connection.query("SELECT * FROM `jobDetails` LIMIT 30", function (err, result, fields) {
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
        connection.query("SELECT * FROM `jobDetails` where `Location` LIKE '%" + req.body.location + "%' AND `jobProfile` LIKE '%" + req.body.searchData + "%' LIMIT 30", function (err, result, fields) {
           
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


    router.post('/scrapDataAdvance', function (req, res, next) {

      if (req.body.companyName == "" && req.body.locationName == "" && req.body.jobProfile != "")  {
        connection.query("SELECT * FROM `indeed` where `title` LIKE '%" + req.body.jobProfile + "%' LIMIT 30", function (err, result, fields) {
       
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

        else if (req.body.companyName == "" && req.body.locationName != "" && req.body.jobProfile == "")  {
          connection.query("SELECT * FROM `indeed` where `location` LIKE '%" + req.body.locationName + "%' LIMIT 30", function (err, result, fields) {
         
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

        else if (req.body.companyName != "" && req.body.locationName == "" && req.body.jobProfile == "")  {
            connection.query("SELECT * FROM `indeed` where `companyName` LIKE '%" + req.body.companyName + "%' LIMIT 30", function (err, result, fields) {
           
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
        else if(req.body.companyName == "" && req.body.locationName == "" && req.body.jobProfile == "") {
          connection.query("SELECT * FROM `indeed` LIMIT 30", function (err, result, fields) {
             
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
        else if(req.body.companyName != "" && req.body.locationName != "" && req.body.jobProfile != "") {
            connection.query("SELECT * FROM `indeed` where `companyName` LIKE '%" + req.body.companyName + "%' AND `location` LIKE '%" + req.body.locationName + "%' AND `title` LIKE '%" + req.body.jobProfile + "%' LIMIT 30", function (err, result, fields) {
               
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
      
      })
    


module.exports = router