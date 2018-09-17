var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Nguyen Family Tree'
  });
});

/* edit JSON */
router.post('/edit/', function(req, res, next) {
  if(req.body) {
    personId = req.body.id;
    var fileName = path.join(__dirname, '..', '/public/json/test.json');
    var file = require(fileName);
    var element = findNodeById(personId, file);

    element.name = req.body.name;
    element.bio = req.body.bio;

    fs.writeFile(fileName, JSON.stringify(file, null, 2), function (err) {
      if (err) return console.log(err);
    });
  }

  res.redirect('../');
})

router.post('/add/', function(req, res, next) {
  personId = req.body.id;
  var fileName = path.join(__dirname, '..', '/public/json/test.json');
  var file = require(fileName);
  var element = findNodeById(personId, file);

  if (!element.children) {
    element.children = [];
  }
  file.maxid = file.maxid + 1;
  console.log(file.maxid);
  element.children.push({"name":"New Person","id":file.maxid,"bio":"Fresh Face"});

  fs.writeFile(fileName, JSON.stringify(file, null, 2), function (err) {
    if (err) return console.log(err);
  });

  res.redirect('../');
})

/* Helper Function to find Node by ID */
function findNodeById(id, element) {
  if (element.id == id) {
    return element;
  }

  var children = element.children;
  if( children ) {   
    for (var i = 0; i < children.length; i++) {
      var result = null;
      result = findNodeById(id, children[i]);
      if (result) {
        return result;
      }
    }
  }
}


module.exports = router;
