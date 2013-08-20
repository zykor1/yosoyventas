var mongoose = require('mongoose');
var graph = require('fbgraph');

/*
 * GET users listing.
 */



exports.index = function(req, res){
	if (req.session.auth != undefined){
		res.render('principal');
	}else{
    	res.redirect('/')
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