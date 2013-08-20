var mongoose = require('mongoose');
var articulo = require('../models/articuloModel')
var graph = require('fbgraph');

/*
 * GET users listing.
 */
var ArticuloModel = mongoose.model('ArticuloModel');


exports.index = function(req, res){
	if (req.session.auth != undefined){
		res.render('articulos/vender');
	}else{
    	res.redirect('/');
    }
};


exports.agregar = function(req, res){
	if (req.session.auth != undefined){
		var articulo = new ArticuloModel({ 
			titulo: req.body.titulo,
			descripcion: req.body.descripcion,
			precio: req.body.precio
		 });

		articulo.save(function (err) {
		  if (err){
		  	console.log(err);
			res.render('articulos/vender', { exito: "No se pudo guardar" });
			}
		  else{
		  	console.log(err);
		  	res.render('articulos/vender', { exito: "Guardado" });
		  	}

		});
		
	}else{
    	res.redirect('/');
    }
};



/* Agregar articulo a vender funciona xD
		var articulo = new ArticuloModel({ 
			titulo: 'Zildjian',
			descripcion: 'hola mundo',
			precio: 62.7
		 });
		articulo.save(function (err) {
		  if (err) // ...
		  console.log('meow');
		});
		**/