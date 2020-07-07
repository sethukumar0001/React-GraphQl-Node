/*
 * Purpose : This page is for Employer  Backend routes
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

router.post('/companyProfile', (req, res) => {

  console.log(req.body)
  connection.query(
    "SELECT count(*) as total FROM companyDetails WHERE userId = ?",
    [req.body.data.id],
    function (error, results, fields) {
      if (results[0].total === 1) {
        // console.log(update)
        connection.query(
          "UPDATE companyDetails SET company = ? ,contactEmail = ? ,contact = ?, industryType = ?, branch = ? WHERE userId= ?",
          [
            req.body.data.corporateName,
            req.body.data.corporateEmail,
            req.body.data.mobileNumber,
            req.body.data.industryType,
            req.body.data.branch,
            req.body.data.id
          ],
          function (err, result) {
            if (!err) {
              res.status(200).json([
                {
                  status: "success"
                }
              ]);
            }
          }
        );
      } else {
        // console.log("insert");
        connection.query(
          "INSERT INTO `companyDetails`(`userId`,`company`,`branch`,`address`,`contact`,`website`,`contactEmail`,`industryType`,`description`,`companyImage`)VALUES('" +
          req.body.data.id +
          "','" +
          req.body.data.corporateName +
          "','" + req.body.data.branch + "','','" +
          req.body.data.mobileNumber +
          "','','" +
          req.body.data.corporateEmail +
          "','" +
          req.body.data.industryType +
          "','','')",
          function (err, result) {
            if (!err) {
              res.status(200).json([
                {
                  status: "success",
                  insertID: result.insertId
                }
              ]);
            } else {
              res.status(502).json([
                {
                  status: "failed",
                  errMsg: "Error while inserting data."
                }
              ]);
            }
          }
        );
      }
    }
  );

})



router.post('/getData', function (req, res, next) {
  connection.query(
    "SELECT * FROM companyDetails WHERE userId=?",
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



router.post('/deleteEmployerPostedJob', function (req, res, next) {

  console.log(req.body.card_id);
  connection.query(
    "DELETE FROM `jobDetails` WHERE jobId=?",
    req.body.card_id,
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

router.get('/skillOptions', function (req, res, next) {
  connection.query("SELECT * FROM  skillTable", function (err, result, fields) {
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
})


router.post('/employer', function (req, res, next) {

  if (req.body.data.jobId) {
    console.log("update");
    connection.query(
      "select count(*) as total from `jobDetails` where (`jobId` = '" +
      req.body.data.jobId.key +
      "')",
      function (err, result) {

        if (result[0].total == 1) {

          connection.query(
            "UPDATE jobDetails SET jobProfile = ? ,description = ? ,experienceYearsReq = ?,specialSkills = ?,	vacancies = ? ,Location = ?,	annualSalaryLakhs = ?  WHERE jobId=?",
            [
              req.body.data.jobProfile,
              req.body.data.jobDescription,
              req.body.data.ReqExperience,
              req.body.data.specialSkills,
              req.body.data.vacancies,
              req.body.data.jobLocation,
              req.body.data.salary,
              req.body.data.jobId.key
            ],
            function (err, result) {
              if (!err) {
                connection.query(
                  "UPDATE companyDetails SET branch = ? WHERE userId=?",
                  [req.body.data.jobLocation, req.body.data.id],
                  function (err, result) {
                    if (!err) {
                      res.status(200).json({ status: "success" });
                    } else {
                      res.status(500).json({ status: "failure" }); //failure  response
                      throw err;
                    }
                  }
                );
            }
            }
          );
        } else {
          console.log("Error")
        }
      }
    );
  } else {

    console.log(req.body.data);

    connection.query("select * from companyDetails where userId=?", req.body.data.id, function (err, result11) {    
      if (result11) {
        // console.table(result11)
        connection.query(
          "INSERT INTO `jobDetails`(`jobProfile`,`description`,`experienceYearsReq`,`companyId`,`specialSkills`,`vacancies`,`Location`,`annualSalaryLakhs`,`startDate`,`lastDate`)VALUES('" +
          req.body.data.jobProfile +
          "','" +
          req.body.data.jobDescription +
          "','" +
          req.body.data.ReqExperience +
          "','" +
          result11[0].companyId +
          "','" +
          req.body.data.specialSkills +
          "','" +
          req.body.data.vacancies +
          "','" +
          req.body.data.jobLocation +
          "','" +
          req.body.data.salary +
          "','" +
         ''+
          "','" +
          '' +
          "')",
          function (err, result) {
            if (!err) {
      
              req.body.selectState.map((data, i) => {
                connection.query(
                  "INSERT INTO `jobRequiredSkills` (`jobId`, `skillId`) VALUES ('" +
                  result.insertId +
                  "','" +
                  data.value +
                  "')",
                  function (err, result) {
                    if (!err) {
                      if (req.body.selectState.length == i + 1) {
                        res.status(200).json({ status: "success" });
                      } // success response
                    } else {
                      res.status(500).json({ status: "failure" }); //failure  response
                      throw err;
                    }
                  }
                );
              });
            } else
              res.json([
                {
                  status: "failed",
                  errMsg: "Error while performing query."
                }
              ]);
          }
        );
      }
    })
  }})

  router.post('/dashboard', function (req, res, next) {
    connection.query(
      "SELECT companyId,count(*) as total FROM `companyDetails` where (`userId` = '" +
      req.body.userId +
      "')",
      function (err, result) {
        if (result[0].total == 1) {
         
          connection.query(
            "SELECT * FROM `companyDetails` INNER JOIN `jobDetails` ON `jobDetails`.`companyId` = `companyDetails`.`companyId` AND `jobDetails`.`companyId` = '" +
            result[0].companyId +
            "'",
            function (err, result) {
              if (!err) {
  
                res.json({
                  status: "success",
                  data: result
                });
              }
              else
                res.json([
                  {
                    status: "failed",
                    errMsg: "Error while performing query."
                  }
                ]);
            }
          );
        }
        else {
       
          res.json([
            {
              status: "failed",
              errMsg: "Error CompanyId not Found Please update companydetails."
            }
          ]);
  
        }
      }
    );
  
  
  })
  router.post('/applyDetails', function (req, res, next) {

    var data = [];

    req.body.dashboardData.map((val, i) => {
      connection.query(
        "SELECT userRegistration.userName,userRegistration.email,userRegistration.mobileNumber,userJobApplication.userId,userJobApplication.jobId, COUNT(userJobApplication.applicationId) as total FROM userRegistration INNER JOIN userJobApplication ON userJobApplication.userId=userRegistration.userId WHERE userJobApplication.jobStatus != 'applied' and  userJobApplication.jobId=? GROUP BY userJobApplication.jobId HAVING total >0",
        val.jobId,
        function (err, result) {
        
          if (result) {
            data.push(result);
          }
         
          if (req.body.dashboardData.length === i + 1) {
         
            res.json({
              status: "success",
              data: data
            });
          }
        }
      );
    });
  })
  router.post('/AppliedApplicants', function (req, res, next) {

   connection.query(
    "SELECT companyId,count(*) as total FROM `companyDetails` where (`userId` = '" +
    req.body.userId +
    "')",
    function (err, result1) {
      if (result1[0].total == 1) {

        connection.query("SELECT * FROM `userJobApplication` INNER JOIN `userRegistration` ON `userRegistration`.`userId` = `userJobApplication`.`userId`and `userJobApplication`.`companyId`= ?", [result1[0].companyId], function (err, result3) {
          if (result3) {
            res.json([{
              status: "success",
              data: result3
            }])
          }
          else
            res.json([
              {
                status: "failed",
                errMsg: "Error while performing query."
              }
            ]);
        })
      }
      else {
       
        res.json([
          {
            status: "failed",
            errMsg: "Error CompanyId not Found Please update companydetails."
          }
        ]);

      }

    });

  })

  router.post('/acceptDetails', function (req, res, next) {
    connection.query(
      "UPDATE userJobApplication SET jobStatus =? WHERE userId=? AND jobId=?",
      [req.body.jobStatus, req.body.userData, req.body.jobData],
      function (err, result) {
        if (!err)
          res.json({
            status: "success",
            data: result
          });
        else
          res.json([
            {
              status: "failed",
              errMsg: "Error while performing query."
            }
          ]);
      }
    ); 
  })

  router.post('/editJobPostData', function (req, res, next) {
    console.log(req.body.jobId);
    connection.query(
      "SELECT companyDetails.branch,GROUP_CONCAT(skillTable.skill) as skill,jobRequiredSkills.skillId,jobDetails.* FROM `jobDetails` LEFT JOIN jobRequiredSkills ON jobDetails.jobId=jobRequiredSkills.jobId LEFT JOIN skillTable ON skillTable.skillId=jobRequiredSkills.skillId INNER JOIN companyDetails ON companyDetails.companyId=jobDetails.companyId and jobDetails.jobId = ?",[req.body.jobId.key],
      function (err, result) {
        if (!err)
          res.json({
            status: "success",
            data: result
          });
        else
          res.json([
            {
              status: "failed",
              errMsg: "Error while performing query."
            }
          ]);
      }
    ); 
  })

module.exports = router