/* var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../models/User');
var db = mongoose.connection;

// GET del listado de usuarios ordenados por fecha de creación
router.get('/', function(req, res, next) {
  // busca, ordena descendente y ejecuta (una respuesta de error o los datos en formato json)
  User.find().sort('-creationdate').exec(function(err, users) {
    if (err) res.status(500).send(err);
    else res.status(200).json(users);
  });
});

// GET de un único usuario por su Id (: en la definición no en el uso)
router.get('/:id', function(req, res, next) {
  User.findById(req.params.id, function(err, userinfo) {
    if (err) res.status(500).send(err);
    else res.status(200).json(userinfo);
  });
});

// POST de un nuevo usuario
router.post('/', function(req, res, next) {
  User.create(req.body, function(err, userinfo) {
    if (err) res.status(500).send(err);
    else res.sendStatus(200);
  });
});
  
module.exports = router; */
var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
var db = mongoose.connection;


// GET del listado de todos usuarios ordenados por fecha de creación
router.get('/', function(req, res, next) {
  // guion para orden decreciente
  User.find().sort('-creationdate').exec(function(err, users) {
    if (err) res.status(500).send(err);
    else res.status(200).json(users);
  });
});

// GET de un único usuario por su Id. ':' para identificar que es un parámetro
router.get('/:id', function(req, res, next) {
  //debemos de pasarle un parámetro
  User.findById(req.params.id, function(err, userinfo) {
    if (err) res.status(500).send(err);
    else res.status(200).json(userinfo);
  });
});

// POST de un nuevo usuario
router.post('/', function(req, res, next) {
  //REQ.BODY si se le pasan las validaciones antes, es raro que
  //te devuela un error
  User.create(req.body, function(err, userinfo) {
    if (err) res.status(500).send(err);
    else res.sendStatus(200);
  });
});

// PUT de un usuario existente identificado por su Id
router.put('/:id', function(req, res, next) {
  // Cuando encontramos el registro, le paso los nuevos valores
  User.findByIdAndUpdate(req.params.id, req.body, function(err, userinfo) {
    if (err) res.status(500).send(err);
    else res.sendStatus(200);
  });
});

// DELETE de un usuario identificado por su id
router.delete('/:id', function(req, res, next){
  User.findByIdAndDelete(req.params.id, function(err, userinfo){
    if (err) res.status(500).send(err);
    else res.sendStatus(200);
  })
});

// LOGIN
// http://localhost:5000/users/signin
// Comprueba si el usuario existe
router.post('/signin', function(req, res, next) {
  User.findOne({ username: req.body.username }, function(err, user) {
  if (err) res.status(500).send('¡Error comprobando el usuario!');
  // Si el usuario existe...
  if (user != null) {
  user.comparePassword(req.body.password, function(err, isMatch) {
  if (err) return next(err);
  // Si el password es correcto...
  if (isMatch)
  res.status(200).send({ message: 'ok', role:
  user.role, id: user._id });
  else
  res.status(200).send({ message: 'la password no coincide' });
  });
  } else res.status(401).send({ message: 'usuario no registrado'
  });
  });
});

// Crear un servicio para buscar por “username”
// http://localhost:5000/users/findUsername
router.post('/findUsername', function(req, res, next){
  User.findOne({ username: req.body.username }, function(err, user) {
    if (err) res.status(500).send('¡Error comprobando el usuario!');
    // Si el usuario existe...
    if (user != null) {
      user.username = req.body.username;
      res.status(200).send({ message: 'ok', role:user.role, id: user._id });
    }
  })
});

// Crear un servicio para actualizar a todos los usuarios el “role” a “subscriber”
router.put('', function(req, res, next) {
  // Cuando encontramos el registro, le paso los nuevos valores
  User.updateMany(req.body, function(err, userinfo){
    if (err) res.status(500).send(err);
    else res.sendStatus(200);
  })
});

module.exports = router;