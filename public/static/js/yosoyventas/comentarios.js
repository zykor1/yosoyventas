

// Guardamos el comentario una vez recibido
	function enviaComentario(){
		$('#addComentariosForm').submit();
	}

// Este es cuando el usuario manda un nuevo comentario
$(document).ready(function()
{
 
	$('#addComentariosForm').submit(function(){
		$('#addComentariosForm').ajaxSubmit({                                                                                                   
			error: function(xhr){
				$('#alertaAddComentario').removeClass("alert alert-success alert-warning").addClass("alert alert-danger" );
				$('#mensajeAlertaAddComentario').text("Hubo un error al intentar guardar tu comentario: " + xhr);
			},
			success: function(response){
				if(response.tipo == "error"){
					$('#alertaAddComentario').removeClass("alert alert-success alert-warning hide").addClass("alert alert-danger" );
					$('#mensajeAlertaAddComentario').text(response.mensaje);
					return;
				}
				else if(response.tipo == "success"){
					$('#alertaAddComentario').removeClass("alert alert-danger alert-warning hide").addClass("alert alert-success" );
					$('#mensajeAlertaAddComentario').text(response.mensaje);
					console.log(response.comentario);
					agregaComentario(response.comentario, response.user_name, response.user_id);
					cerrarModalComentarioArticulo();
					$('#alertaAddComentario').removeClass("alert alert-danger alert-warning").addClass("alert alert-success hide" );
					$('#textAreacomentario').val('');
					$('#id_comentarioField').val('');
					$('#tituloModalComentar').text('Comentar Articulo');
					$( "#botonModalComentarArticulo" ).attr( "onClick", 'enviaComentario()' );
				}					    
			}
		});
	    	// Have to stop the form from submitting and causing                                                                                                       
	    	// a page refresh - don't forget this                                                                                                                      
		return false;
	});


});



// Manda a mostrar el comentario
function agregaComentario(comentario, user_name, user_id){
	var l2 = '';
	var l1 = '';
	var l8 = '';


// Validamos si el usuario acaba de agregar el comentario o estamos leyendo todos
if (user_name != undefined){
	nombre = user_name
	// Como el usuario conectado acaba de crear el comentario entonces el lo puede eliminar
	l2 = 	'<button class="pull-right btn btn-default btn-xs" onclick="mandaEliminarComentario(\''+comentario._id+'\')" rel="tooltip" data-toggle="tooltip" title="Elimina tu comentario">'+
				'<span class="text-danger glyphicon glyphicon-trash"></span></button>';
}
else{
	nombre = comentario._creador.name
	// Valido que el usario conectado haya creado el comentario xD
	if (user_id == comentario._creador._id){
		l2 = 	'<button class="pull-right btn btn-default btn-xs" onclick="mandaEliminarComentario(\''+comentario._id+'\')" rel="tooltip" data-toggle="tooltip" title="Elimina tu comentario">'+
					'<span class="text-danger glyphicon glyphicon-trash"></span></button>';
	}	
}
// Comprobamos que el que creo el articulo es que esta comentando o sea que el vendedor comente su articulo xD
if (comentario._articulo._creador == comentario._creador._id){
	l1 = '<div id="'+comentario._id+'" class="panel panel-default comentarioVendedor"><div class="panel-body">'+
				'<div class="col-lg-2">'+
					'<p class="text-primary">';
}else{
	l1 = '<div id="'+comentario._id+'" class="panel panel-default"><div class="panel-body">'+
			'<div class="col-lg-2">'+
				'<p class="text-primary">';
}
var positivos = 0;
var negativos = 0;
var yaCalifico = false;
$.each(comentario.calificacion, function(index, calificacion){
	if (calificacion.calificacion == true)
		positivos++;
	else
		negativos++;
	if (calificacion.usuario == user_id)
		yaCalifico = true

});


if (yaCalifico == true){
		l8 =	'<button id="'+comentario._id+'btn-negativos" class="pull-right btn btn-default btn-xs"  disabled rel="tooltip" data-toggle="tooltip" title="Vota negativo">'+
					'<span id="'+comentario._id+'negativos" class="text-danger glyphicon glyphicon-minus">'+negativos+'</span></button>'+
				'<button id="'+comentario._id+'btn-positivos" class="pull-right btn btn-default btn-xs" disabled rel="tooltip" data-toggle="tooltip" title="Vota positivo">'+
					'<span id="'+comentario._id+'positivos" class="text-success glyphicon glyphicon-ok">'+positivos+'</span></button>';
}else{
		l8 =	'<button id="'+comentario._id+'btn-negativos" class="pull-right btn btn-default btn-xs" onclick="calificaComentario(\''+comentario._id+'\', false)" rel="tooltip" data-toggle="tooltip" title="Vota negativo">'+
					'<span id="'+comentario._id+'negativos" class="text-danger glyphicon glyphicon-minus">'+negativos+'</span></button>'+
				'<button id="'+comentario._id+'btn-positivos" class="pull-right btn btn-default btn-xs" onclick="calificaComentario(\''+comentario._id+'\', true)" rel="tooltip" data-toggle="tooltip" title="Vota positivo">'+
					'<span id="'+comentario._id+'positivos" class="text-success glyphicon glyphicon-ok">'+positivos+'</span></button>';
}


fecha = new Date(comentario.fecha_creacion);
	l1 = l1
	l2 = l2
var l3 =			'<strong>'+nombre+':</strong><br>';
var l4 =			'<small class="text-muted">'+fecha.toLocaleString()+'</small>';
var l5 =		'</p>';
var l6 =	'</div>';
var l7 =	'<div class="col-lg-10">';
	l8 = l8
var l9 = 		'<button class="pull-right btn btn-default btn-xs" onclick="respondeComentario(\''+comentario._id+'\')" rel="tooltip" data-toggle="tooltip" title="Responde a este comentario">'+
					'<span class="text-primary glyphicon glyphicon-comment"></span></button>';
var l10 =		'<small id="wordwrap">'+comentario.comentario+' </small>';
var l11 =	'</div>';
var l12 = '</div></div><div id="'+comentario._id+'respuestas" class="col-lg-offset-1"></div>';

var comentarioHTML = l1+l2+l3+l4+l5+l6+l7+l8+l9+l10+l11+l12;
if (comentario.respuesta != undefined){
	if ( $('#'+comentario.respuesta+'respuestas').length ) {
		$('#'+comentario.respuesta+'respuestas').append(comentarioHTML);
	}else{
		$('#mostrarComentarios').prepend(comentarioHTML);
	}
}else{
	$('#mostrarComentarios').prepend(comentarioHTML);
}


}



// Mandamos a mostrar los comentarios
function mostrarComentarios(id_articulo){
	$.get(
	    "/leeComentarios/"+id_articulo,
	    function(data){ 
	    	if (data.tipo == "success"){
				$.each(data.comentarios, function(index, comentario){
					agregaComentario(comentario, undefined, data.user_id);
				});
	    	}else{
	    		console.log("error");
	    		console.log(data);
	    	}
	    },
	    "json"
	);
}


// Funcion que dispara la eliminacion de un comentario
function mandaEliminarComentario(id_comentario){
	// #id, titulo del mensaje, texto del mensaje, json con botones
	// formato del json
	// [{ texto_boton: 'Aceptar', clase_bootstrap: 'success', onclick: 'function("variables")',boton_cerrar: true }]
	var botones = [{ texto_boton : 'Cancelar', clase_bootstrap: 'default', boton_cerrar: true },
				   { texto_boton : 'Eliminar', clase_bootstrap: 'danger', onclick: 'eliminaComentario(\''+id_comentario+'\')', boton_cerrar: true }];
	$("#modals").append(generaModals(id_comentario+"modal", "Eliminar comentario", "¿Seguro que deseas eliminar tu comentario?", JSON.stringify(botones)));
	$("#"+id_comentario+"modal").modal('show');
}

// Mandamos a mostrar los comentarios
function eliminaComentario(id_comentario){
	$.get(
	    "/eliminaComentario",
	    {id_comentario: id_comentario},
	    function(data){ 
	    	if (data.tipo == "success"){
				$("#"+id_comentario).remove();

	    	}else{
	    		console.log("error");
	    		console.log(data);
	    	}
	    },
	    "json"
	);
}

// Califica comentario
function calificaComentario(id_comentario, calificacion){
		$.get(
	    "/calificaComentario",
	    {id_comentario: id_comentario, calificacion: calificacion},
	    function(data){ 
	    	if (data.tipo == "success"){
				if (data.calificacionValor == "0"){
					negativos = parseInt($("#"+id_comentario+"negativos").text()) + 1;
					$("#"+id_comentario+"negativos").text(negativos);
				}
				else{
					positivos = parseInt($("#"+id_comentario+"positivos").text()) + 1;
					console.log(positivos);
					$("#"+id_comentario+"positivos").text(positivos);
				}
				$("#"+id_comentario+"btn-positivos").attr("disabled", "disabled");;
				$("#"+id_comentario+"btn-negativos").attr("disabled", "disabled");;
	    	}else{
	    		console.log("error");
	    		console.log(data);
	    	}
	    },
	    "json"
	);
}

function respondeComentario(id_comentario){
	$('#id_comentarioField').val(id_comentario);
	$( "#botonModalComentarArticulo" ).attr( "onClick", 'enviaComentario(\''+id_comentario+'\')' );
	$('#tituloModalComentar').text('Responder comentario');
	$("#modalComentarArticulo").modal('show');
}




//Cierra el modal Mensaje
function cerrarModalComentarioArticulo(){
	$("#modalComentarArticulo").modal('hide');
}