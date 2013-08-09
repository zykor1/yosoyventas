var mongoose = require('mongoose');
var	UserModel = require('../models/user');
/*
 * GET users listing.
 */

exports.index = function(req, res){
	UserModel.find(function(err,users){
        console.log(users);
        res.render('mostrarUsuario', { user: JSON.stringify(users) });
    });
  
};