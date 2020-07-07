
/*
 * Purpose : This page is for Connect to Mysql Backend
 * Devlopers : Sethu
 */

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const passport = require("passport");
const fileUpload = require('express-fileupload');
var connection = require('./bin/connection');
var fs = require('fs');
const graphqlHTTP = require('express-graphql').graphqlHTTP;
var { buildSchema } = require('graphql');


var app = express();

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload())
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

// graphql


var projectSchema = buildSchema(
  `type ProjectDetails {
            projectId: Int
            projectName: String
            projectDesc: String
            mainTask: String
            subTask:String
            status:String
            projectLead:String
}
type Query {
            getProjects: [ProjectDetails],
            getProjectInfo(id: Int) : ProjectDetails
}
`);


const queryDB = (req, sql, args) => new Promise((resolve, reject) => {
  connection.query(sql, args, (err, rows) => {
    if (err)
      return reject(err);
    rows.changedRows || rows.affectedRows || rows.insertId ? resolve(true) : resolve(rows);
  });
});

var root = {
  getProjects: (args, req) => queryDB(req, "select * from projectDetails").then(data => data),
  getProjectInfo: (args, req) => queryDB(req, "select * from projectDetails where projectId = ?", [args.id]).then(data => data[0])
};


app.use('/graphql', graphqlHTTP({
  schema: projectSchema,
  rootValue: root,
  graphiql: true,
}));


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
