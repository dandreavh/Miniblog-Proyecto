var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

// Modelos (como tiene una referencia, necesito capturarlo)
var Post = require('../models/Post');
var User = require('../models/User');
var db = mongoose.connection;

// GET del listado de posts ordenados por fecha de publicación
router.get('/', function(req, res, next) {
    // Sin el populate solo devuelve el ObjectID, pero con el populate consigo todos los datos del id que ponga (mirar bien el nombre)
    // si quiero solo unos campos concretos, hago los filtros en el find
    Post.find() // devuleve todo (sin proyección)
    .sort('-publicationdate') // ordena descentente
    .populate('user') // captura todos los datos del usuario referenciado
    .exec(function(err, posts) {
        if (err) res.status(500).send(err);
        else res.status(200).json(posts);
    });
});

// GET de todos los posts de un usuario dado (identificado por su Id)
router.get('/all/:id', function(req, res, next) {
    Post.find({ 'user': req.params.id}) // aquí tenemos el filtro
    .sort('-publicationdate')
    .populate('user')
    .exec(function(err, posts){
        if (err) res.status(500).send(err);
        else res.status(200).json(posts);
    });
});

// POST de un nuevo post o entrada
router.post('/', function(req, res, next) {
    User.findById(req.body.iduser, function(err, userinfo) {
    if (err) res.status(500).send(err);
    else {
    // crear la instancia Post
    var postInstance = new Post({
        user: req.body.iduser,
        title: req.body.title,
        description: req.body.description
    });
    // añadir postInstance al array de posts del usuario
    userinfo.posts.push(postInstance);
    // salvar el post en las colecciones users y posts
    userinfo.save(function(err) {
        if (err) res.status(500).send(err);
        else {
    postInstance.save(function(err) {
        if (err) res.status(500).send(err);
        res.sendStatus(200);
    });
    }
    });
    }
    });
});

// PUT de un post existente (identificado por su Id)
router.put('/:id', function(req, res, next) {
    Post.findByIdAndUpdate(req.params.id, req.body, function(err, postinfo) {
    if (err) res.status(500).send(err);
    else res.sendStatus(200);
    });
});

// DELETE de un post existente (identificado por su Id)
router.delete('/:id', function(req, res, next) {
    Post.findByIdAndDelete(req.params.id, function(err, postinfo) {
        if (err) res.status(500).send(err);
        else {
            User.findByIdAndUpdate(postinfo.user, { $pull: { posts:
            postinfo._id } }, function(err, userinfo) {
        if (err) res.status(500).send(err);
        else {
            res.sendStatus(200);
        }});
    }});
});
    

/* GET home page. */
/* router.get('/', function(req, res, next) {
    res.render('posts', { title: 'Express' });
}); */

module.exports = router;