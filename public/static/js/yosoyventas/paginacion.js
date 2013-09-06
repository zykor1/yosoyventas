// Retorna en porcentaje la posicion del scroll
function currentScrollPercentage()
{
    return ((document.documentElement.scrollTop + document.body.scrollTop) / (document.documentElement.scrollHeight - document.documentElement.clientHeight) * 100);
}


//Se verifica el porcentaje del scroll
$(document).ready(function() {
    $(window).scroll(function() {
      	if (currentScrollPercentage() > 97){
			paginar();
		}
    });
});




// Llamada ajax para traer la siguiente pagina

var numPagina = 0;
function paginar(){
	$.get(
	    "/principal",
	    {pagina: numPagina},
	    function(data){ 
	    	if (data.tipo == "success"){
				numPagina++;
				$('#escondido').html(data.nuevosArticulos);
				var info = $('#escondido').text();
				generaCuadros(info);
	    	}
	    },
	    "json"
		);
}


// Manda a generar los cuadros
function generaCuadros(info){
	console.log(info);
	var articulos = JSON.parse(info);
	$.each(articulos, function(index, articulo){
		if (articulo.imagenes != undefined && articulo.imagenes.length > 1){
			generaCuadroSlide(articulo);
		}else if(articulo.imagenes != undefined && articulo.imagenes.length == 1){
			generaCuadroConImagen(articulo);
		}else if(articulo.imagenes == undefined || articulo.imagenes.length == 0){
			generaCuadroSinImagen(articulo);
		}
	});
}

// Genera el cuadro que solo tiene una imagen
function generaCuadroConImagen(articulo){
var titulo_sin_espacios = articulo.titulo.replace(/ /g,"_");

var l1 = '<div class="col-lg-4">';
var l2 =	'<div id="cuadroPrincipal" class="thumbnail">';
var l3 =		'<img id="imagenCuadro" src="'+articulo.imagenes[0].imagen+'">';
var l4 =		'<div id="wordwrap" class="caption">';
var l5=			'<a rel="tooltip" data-toggle="tooltip" title="" href="/mostrar/'+articulo._id+'/'+titulo_sin_espacios+'" data-original-title="Ver mas">';
var l6 =				'<h3>'+articulo.titulo+'</h3>';
var l7 =			'</a>';
var l8 =			'<p>'+articulo.descripcion_corta+'</p>';
var l9 =		'</div>';
var l10 =	'</div>';
var l11 ='</div>';

$('#contenedorCuadros').append(l1 + l2 + l3 + l4 + l5 + l6 + l7 + l8 + l9 + l10 + l11);
}

// Genera el cuadro que no tiene  imagen
function generaCuadroSinImagen(articulo){
var titulo_sin_espacios = articulo.titulo.replace(/ /g,"_");

var l1 = '<div class="col-lg-4">';
var l2 =	'<div id="cuadroPrincipal" class="thumbnail">';
var l3 =		'<img id="imagenCuadro" src="/img/no_imagen.png">';
var l4 =		'<div id="wordwrap" class="caption">';
var l5=			'<a rel="tooltip" data-toggle="tooltip" title="" href="/mostrar/'+articulo._id+'/'+titulo_sin_espacios+'" data-original-title="Ver mas">';
var l6 =				'<h3>'+articulo.titulo+'</h3>';
var l7 =			'</a>';
var l8 =			'<p>'+articulo.descripcion_corta+'</p>';
var l9 =		'</div>';
var l10 =	'</div>';
var l11 ='</div>';

$('#contenedorCuadros').append(l1 + l2 + l3 + l4 + l5 + l6 + l7 + l8 + l9 + l10 + l11);
}

// Genera el cuadro que tiene sliders
function generaCuadroSlide(articulo){
var titulo_sin_espacios = articulo.titulo.replace(/ /g,"_");

var l1 = '<div class="col-lg-4">';
var l2 =	'<div id="cuadroPrincipal" class="thumbnail">';
var l3 =		'<div id="'+articulo._id+'" class="carousel slide">';
var l4 =			'<ol class="carousel-indicators">';
var l5 =				'';
var l6 =			'</ol>';
var l7 = 		'<div class="carousel-inner">'
var l8 =			'';
var l9 =        '</div>'
var l10 =			'<a data-slide="prev" href="#'+articulo._id+'" class="left carousel-control"><span class="icon-prev"></span></a>';
var l11 =			'<a data-slide="next" href="#'+articulo._id+'" class="right carousel-control"><span class="icon-next"></span></a>';
var l12=		'</div>';
var l13 =		'<div id="wordwrap" class="caption">';
var l14=			'<a rel="tooltip" data-toggle="tooltip" title="" href="/mostrar/'+articulo._id+'/'+titulo_sin_espacios+'" data-original-title="Ver mas">';
var l15 =				'<h3>'+articulo.titulo+'</h3>';
var l16 =			'</a>';
var l17 =			'<p>'+articulo.descripcion_corta+'</p>';
var l18 =		'</div>';
var l19 =	'</div>';
var l20 ='</div>';

	$.each(articulo.imagenes, function(index, value){
		if (index == 0){
			l5 += '<li data-target="#'+articulo._id+'" data-slide-to="'+index+'" class="active"></li>';
			l8 += '<div class="item thumbnail active"><img id="imagenCuadro" src="'+value.imagen+'"></div>';
		}else{
			l5 += '<li data-target="#'+articulo._id+'" data-slide-to="'+index+'" ></li>';
			l8 += '<div class="item thumbnail"><img id="imagenCuadro" src="'+value.imagen+'"></div>';
		}
	});
$('#contenedorCuadros').append(l1 + l2 + l3 + l4 + l5 + l6 + l7 + l8 + l9 + l10 + l11 + l12 + l13 + l14 + l15 + l16 + l17 + l18 + l19 + l20);
}

