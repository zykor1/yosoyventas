var mongoose = require('mongoose');
var graph = require('fbgraph');
var articulo = require('../models/articuloModel')


/*
 * GET users listing.
 */

var ArticuloModel = mongoose.model('ArticuloModel');
//Muestra la pantalla una vez logeado xD
exports.index = function(req, res){
	if (req.session.auth != undefined){
    ArticuloModel.find(function(err,articulos){
        res.render('principal', { title: 'Yo Soy Ventas', articulos: articulos });
    });


		
	}else{
    	res.redirect('/')
    }
};
