var mongoose = require('mongoose')

/*
 * GET home page.
 */

exports.index = function(req, res){
	if (req.session.auth == undefined)
		res.render('index', { title: 'Yo Soy Ventas' });
	else
		res.redirect('/users')
};