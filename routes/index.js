var mongoose = require('mongoose');

/*
 * GET home page.
 */

// Muestra la pantalla de los chavos brincando
exports.index = function(req, res){
	if (req.session.auth == undefined)
		res.render('index', { title: 'Yo Soy Ventas' });
	else
		res.redirect('/principal')
};