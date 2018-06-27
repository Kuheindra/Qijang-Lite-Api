var port = process.env.PORT || 3000,
    http = require('http'),
    fs = require('fs');

var app = http.createServer(function (req, res) {
  if (req.url.indexOf('/img') != -1) {
    var filePath = req.url.split('/img')[1];
    fs.readFile(__dirname + '/public/img' + filePath, function (err, data) {
      if (err) {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.write('Error 404: Resource not found.');
        console.log(err);
      } else {
        res.writeHead(200, {'Content-Type': 'image/svg+xml'});
        res.write(data);
      }  
      res.end();
    });
  } else if (req.url.indexOf('/js') != -1) {
    var filePath = req.url.split('/js')[1];
    fs.readFile(__dirname + '/public/js' + filePath, function (err, data) {
      if (err) {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.write('Error 404: Resource not found.');
        console.log(err);
      } else {
        res.writeHead(200, {'Content-Type': 'text/javascript'});
        res.write(data);
      }  
      res.end();
    });
  } else if(req.url.indexOf('/css') != -1) {
    var filePath = req.url.split('/css')[1];
    fs.readFile(__dirname + '/public/css' + filePath, function (err, data) {
      if (err) {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.write('Error 404: Resource not found.');
        console.log(err);
      } else {
        res.writeHead(200, {'Content-Type': 'text/css'});
        res.write(data);
      }
      res.end();
    });
  } else {
    fs.readFile(__dirname + '/public/index.html', function (err, data) {
      if (err) {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.write('Error 404: Resource not found.');
        console.log(err);
      } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
      }
      res.end();
    });
  }
}).listen(port, '0.0.0.0');
var express = require('express'),
 app = express(),
 router = express.Router(),
 mysql = require('mysql'),
 moment = require("moment-timezone"),
 
  now = moment().format(),
    parser = require('body-parser');
   var path = require('path');
   
   app.set("view engine", "ejs");
   app.use(parser.urlencoded({ extended: false }))
   
   app.use(parser.json())
// var con = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database:"test"
//   });
  var connection = mysql.createConnection({
    host     : 'ec2-52-221-197-187.ap-southeast-1.compute.amazonaws.com',
   port      :  '3306',
    user     : 'root',
    password : 'qijang2018',
    database : 'qijang'
  
  });
  
  connection.connect(function(err) {
    if (err) throw err;
    console.log("aws Connected!");
  });

  // con.connect(function(err) {
  //   if (err) throw err;
  //   console.log("Connected!");
  // });

  app.get("/p_view", function (req, res) {
    res.render("view_form");

    })
    
app.post('/view_product',function(req,res)
{
    var merchant=req.body.merchant;

    // var merchant='123456';
    var sql="SELECT * FROM c_qij_prod WHERE merchant_id='"+merchant+"'";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Result: " + JSON.stringify(result));
      res.render("view_products",{
          products:result,
      });

    });
    

});
app.get("/p_create", function (req, res) {
    
      res.render("create_product");
  
      })
app.post('/create_product',function(req,res)
{
var merchant=req.body.merchant;
var p_name=req.body.p_name;
var p_code=req.body.p_code;
var p_prefix=req.body.p_prefix;
var sql="SELECT * FROM c_qij_prod  ORDER BY lm_time DESC LIMIT 1";
con.query(sql, function (err, result) {
  if (err) throw err;
  console.log(result[0].product_id);
  
var q = (result[0].product_id).match(/\d+$/)[0];
console.log(q);

  app.get("/test", function (req, res) {
    
  res.render("test",{
    result:result,
});
  });
var new_q=parseInt(q)+1;
var new_q=("00" + new_q).slice(-3)

var p_id="SPA"+p_prefix+'Q'+new_q;
var sql = "INSERT INTO c_qij_prod ( merchant_id,product_id,qij_prod_name,qij_prod_code,main_image,qij_prod_prefix,qij_main_qty,lm_time,lm_user) VALUES ('test_merchant','"+p_id+"' ,'"+p_name+"','"+p_code+"','','"+p_prefix+"','','"+now+"','kavin')";
con.query(sql, function (err, result) {
  if (err) throw err;
  console.log("1 record inserted");
  res.send("Success creating product")
});

});
});

app.get("/p_map", function (req, res) {

  res.render("");
  

})  



















app.listen(3000, function () {
    console.log("Server started");
  });        





module.exports = app;