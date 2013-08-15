var mongoose = require('mongoose');
var	UserModel = require('../models/user');
/*
 * GET users listing.
 */

exports.index = function(req, res){
        console.log(req.user);  // FTW!
        res.render('mostrarUsuario');
  
};