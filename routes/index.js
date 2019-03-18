var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
var path = require('path');
var passport = require('passport');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;


/* index page for regular people */
router.get('/', function(req, res, next) {
  res.render('index');
})


/* GET admin page. */
router.get('/admin/', 
  // ensureLoggedIn('/login'),
  function(req, res){
    res.render('admin', { user: req.user });
  }
);

/* edit JSON */
router.post('/edit/', function(req, res, next) {
  if(req.body) {
    personId = req.body.id;
    var fileName = path.join(__dirname, '..', '/public/json/mom.json');
    var file = require(fileName);
    var element = findNodeById(personId, file);

    console.log(req.body.location);
    console.log(req.body.contact);

    element.name = req.body.name;
    element.location = req.body.location;
    element.contact = req.body.contact
    element.dob = req.body.dob;

    fs.writeFile(fileName, JSON.stringify(file, null, 2), function (err) {
      if (err) return console.log(err);
    });
  }
 
  res.redirect('../admin');
})

/* add a child */
router.post('/add/', function(req, res, next) {
  personId = req.body.id;
  var fileName = path.join(__dirname, '..', '/public/json/mom.json');
  var file = require(fileName);
  var element = findNodeById(personId, file);

  if (!element.children) {
    element.children = [];
  }
  file.maxid = file.maxid + 1;
  console.log(file.maxid);
  element.children.push({"name":"New Person","id":file.maxid,"location":"","contact":"", "dob":"1900", "image": "images/"+file.maxid+".png"});

  fs.writeFile(fileName, JSON.stringify(file, null, 2), function (err) {
    if (err) return console.log(err);
  });

  res.redirect('../admin');
})


/* delete a child */
router.post('/delete/', function(req, res, next) {
  personId = req.body.id;
  var fileName = path.join(__dirname, '..', '/public/json/mom.json');
  var file = require(fileName);
  var element = DeleteNodeById(personId, file);


  fs.writeFile(fileName, JSON.stringify(file, null, 2), function (err) {
    if (err) return console.log(err);
  });

  res.redirect('../');
})

/* multer housekeeping */
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', '/public/images/'))
  },
  filename: function (req, file, cb) {
    cb(null, req.body.id + '.png')
  }
})
var upload = multer({ storage: storage })

/* Add an image */
router.post('/image/', upload.single('image'), function(req, res, next) {
  if (!req.file) {
    return res.send({
      success: false
    });

  } else {
    res.redirect('../admin');
  }
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

/* Helper Function to find Node by ID */
function DeleteNodeById(id, element) {
  if (element.id == id) {
    return element;
  }

  var children = element.children;
  if( children ) {   
    for (var i = 0; i < children.length; i++) {
      var result = null;
      result = DeleteNodeById(id, children[i]);
      if (result) {
        children.splice(i, 1);
        return;
      }
    }
  }
}

// LOGIN STUFF
router.get('/login',
  function(req, res){
    res.render('login');
  });
  
router.post('/login', 
  passport.authenticate('local', { successReturnToOrRedirect: '/', failureRedirect: '/login' }),
  );
  
router.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });

module.exports = router;
