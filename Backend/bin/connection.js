/*
 * Purpose : This page is for Connect to Mysql Backend
 * Devlopers : Sethu
 */

const mysql = require("mysql");

const connection = mysql.createConnection({

  host: 'localhost',
  user: 'root',
  password: '',
  database: 'react-from-scratch',
});

connection.connect(function(err, res) {
  if (err) throw err;
  console.log("connection established"); });

module.exports = connection;