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
    personName = req.body.name;
    var fileName = path.join(__dirname, '..', '/public/json/test.json');
    var file = require(fileName);

    var element = findNodeByName(personName, file);
    element.bio = "we changed this one";

    fs.writeFile(fileName, JSON.stringify(file, null, 2), function (err) {
      if (err) return console.log(err);
    });
  }

  res.redirect('../');
})

function findNodeByName(name, element) {
  if (element.name == name) {
    return element;
  }

  var children = element.children;
  for (var i = 0; i < children.length; i++) {
    var result = null;
    result = findNodeByName(name, children[0]);
    return result;
  }
}


module.exports = router;
