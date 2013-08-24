var fs = require('fs');
var mongoose = require('mongoose');
var articulo = require('../models/articuloModel')
var graph = require('fbgraph');
var mkdirp = require('mkdirp');

/*
 * GET users listing.
 */
var ArticuloModel = mongoose.model('ArticuloModel');


exports.index = function(req, res){
	if (req.session.auth != undefined){
		res.render('articulos/vender', { title: 'Yo Soy Ventas' });
	}else{
    	res.redirect('/');
    }
};



exports.subirImagen = function(req, res){

	// Obtenemos la ruta estatica donde nodejs almacenara la imagen /imagenes/id_user/ventas/id_venta/nombreimagen.xxx
	var ruta_relativa = "/imagenes/"+req.session.auth.facebook.user.username+"/ventas/";
	// Obtenemos la ruta absoluta
	var ruta_absoluta = require('path').dirname(module.parent.filename) + "/public/static" + ruta_relativa;
	//Obtenemos la ruta definitiva donde se guargara la imagen
    var path = ruta_absoluta + req.files.imagen.name;
    var vieja_ruta = req.files.imagen.path;
	//Obtenemos al padre de esta ruta articulos.js
	console.log(ruta_relativa);
	console.log(ruta_absoluta);
    console.log(path);
    fs.exists(path, function(exists){
    	if (exists){
    		   moverImagen(res, path, ruta_relativa, req.files.imagen.name, vieja_ruta)
    	} else{
    		mkdirp(ruta_absoluta, function(err){
    			console.log(err);
    			moverImagen(res, path, ruta_relativa, req.files.imagen.name, vieja_ruta)
    		});

    	}
    });

};



// Funcion solo para mover la imagen subida de lugar
function moverImagen(res, path, ruta_relativa, nombre, vieja_ruta){
	// Movemos del archivo temporal a la carpeta /public/static/imagenes/id_user/ventas/id_venta/nombreimagen.xxx
	fs.rename(
		vieja_ruta, path,
		function(error) {
			// Si existe un error mandamos el json error con el mensaje
			if(error) {
				res.send({
					error: 'No se pudo subir tu imagen por esta razon: ' + error
				});
			    return;
			}
			// Enviamos la ruta statica de la imagen xD
			res.send({
				path: ruta_relativa + nombre
			});
		}
	);
}



exports.agregar = function(req, res){
	if (req.session.auth != undefined){
		console.log(req.body.tipo_moneda);
		var articulo = undefined;
		if (req.body.imagenes != ''){
			var imgs = JSON.parse(req.body.imagenes);
			var articulo = new ArticuloModel({
				_creador: req.session.auth.userId, 
				titulo: req.body.titulo,
				descripcion: req.body.descripcionField,
				descripcion_corta: req.body.descripcion_corta,
				precio: req.body.precio,
				tipo_moneda: req.body.tipo_moneda,
				imagenes: imgs.imagenes
			 });
		}else{
			var img = [{imagen : "/img/Photo.png"}]
			var articulo = new ArticuloModel({ 
				_creador: req.session.auth.userId, 
				titulo: req.body.titulo,
				descripcion: req.body.descripcionField,
				descripcion_corta: req.body.descripcion_corta,
				precio: req.body.precio,
				tipo_moneda: req.body.tipo_moneda,
				imagenes: img
			 });
		}
		console.log(articulo);
		articulo.save(function (err) {
		  if (err){
		  	console.log("1 : " + err);
			//res.render('articulos/vender', { exito: "No se pudo guardar" });
			res.send({
				error: "No se pudo guardar"
			});
			}
		  else{
		  	console.log("2 : " + err);
		  	//res.render('articulos/vender', { exito: "Guardado" });
		  		var titulo_sin_espacios = req.body.titulo.replace(/ /g,"_")
		  		console.log(req.body.descripcion_corta);
		  		var crea_link = "http://198.199.120.36:3000/"+ articulo._id+"/"+titulo_sin_espacios;
		  		console.log(crea_link);
				var wallPost = {
				  message: req.body.descripcion_corta,
				  link: crea_link
				};
				graph.post("276062135815874/feed", wallPost, function(err, res) {
				  // returns the post id
				  console.log("estoy aqui");
				  console.log(res.error); // { id: xxxxx}
				});
		  	res.send({
				mensaje: "Se ha guardado exitosamente: " + req.body.titulo
			});
		  	}

		});
		
	}else{
    	res.redirect('/');
    }
};



exports.mostrarArticulo = function(req, res){
	if (req.session.auth != undefined){
		ArticuloModel.findById(req.params.id_articulo, function (err, articulo){
			console.log("ya estamos dentro del articulo :D " + articulo.titulo);
			res.render('articulos/mostrarArticulo', { title: 'Yo Soy Ventas', articulo: articulo });
		});
	}
	else{
		res.redirect('/principal')
	}
};

/* Ya publico al grupo

exports.index = function(req, res){
	if (req.session.auth != undefined){
	var wallPost = {
	  message: "Proximamente YoSoyVentas.com"
	};
	graph.post("276062135815874/feed", wallPost, function(err, res) {
	  // returns the post id
	  console.log(res.error.message); // { id: xxxxx}
	});

	res.render('principal');
	}else{
    	res.redirect('/')
    }
};

**/