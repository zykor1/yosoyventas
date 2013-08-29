// #id, titulo del mensaje, texto del mensaje, json con botones
// formato del json
// [{ texto_boton: 'Aceptar', clase_bootstrap: 'success', onclick: 'function("variables")',boton_cerrar: true }]
function generaModals(id_modal, titulo, mensaje, botones){
listaBotones = JSON.parse(botones);
var l1 = '<div id="'+id_modal+'" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" class="modal fade">'
var l2 =	'<div class="modal-dialog">'
var l3 =		'<div class="modal-content">'
var l4 =			'<div class="modal-header">'
var l5 =				'<button type="button" data-dismiss="modal" aria-hidden="true" class="close">×</button>'
var l6 =				'<h4>'+titulo+'</h4>'
var l7 =			'</div>'
var l8 =			'<div class="modal-body">'
var l9 =				'<p>'+mensaje+'</p>'
var l10 =			'</div>'
var l11 =			'<div class="modal-footer">'
var l12 =				''
var l13 =			'</div>'
var l14 =		'</div>'
var l15 =	'</div>'
var l16 = '</div>'

	$.each(listaBotones, function(index, value){
		var onclick = '';
		var data_dismiss = '';
			if (listaBotones[0].onclick == undefined){
				onclick = 'onClick='+ botones[0].onclick;
			}
			if (listaBotones[0].boton_cerrar == true){
				data_dismiss = 'data-dismiss="modal"';
			}
		l12 += '<button type="button" '+onclick+' '+data_dismiss+' class="btn btn-'+listaBotones[0].clase_bootstrap+'">'+listaBotones[0].texto_boton+'</button>';
	});
	return l1+l2+l3+l4+l5+l6+l7+l8+l9+l10+l11+l12+l13+l14+l15+l16;
}




function mandaEliminar(id_articulo, from){
	$('#modalEliminaArticulo').on('show.bs.modal', function () {
	 	$("#botonModalEliminar").attr( "onClick", 'eliminaArticulo(\''+ id_articulo +'\',\''+from+'\')');
	})
}



// Llamada ajax para mandar a eliminar la imagen
function eliminaArticulo(id_articulo, from){
	$("#modalEliminaArticulo").modal('hide')
	$.get(
	    "/eliminaArticulo",
	    {id_articulo: id_articulo},
	    function(data){ 
	    	if (data.tipo == "success"){
	    		if(from=="mostrarArticulo"){
	    			window.location="/misArticulos";
	    		}else{
	    			$('#'+id_articulo+'articulo').remove();
	    			console.log($('#contenedorArticulos').html());
	    			if ($('#contenedorArticulos').html() == ''){
	    				var contenedorArticulos = '<div class="text-center"><img id="imagenCuadro" src="/img/User.png"><h4>No tienes ningun articulo agrega uno :D</h4><a data-placement="bottom" rel="tooltip" data-toggle="tooltip" title="" href="/vender" class="btn btn-success btn-lg" data-original-title="Ir a vender"> <span class="glyphicon glyphicon-usd"></span>  Ir a vender</a></div>';
	    				$('#contenedorArticulos').html(contenedorArticulos);
	    			}
	    		}
	    	}
	    },
	    "json"
		);
}


// #id, titulo del mensaje, texto del mensaje, json con botones
// formato del json
// [{ texto_boton: 'Aceptar', clase_bootstrap: 'success', onclick: 'function("variables")',boton_cerrar: true }]
function publicaFace(id_articulo){
	console.log("estas intentando publicar algo xD");
	$.get(
	    "/posteaFace",
	    {id_articulo: id_articulo},
	    function(data){ 
	    	if (data.tipo == "success"){
	    		var json = [{
					texto_boton: 'aceptar',
					clase_bootstrap: 'success',
					boton_cerrar: true
				}];
				$("#modals").append(generaModals('mensajePosteo', "Publicando en Facebook", data.mensaje, JSON.stringify(json)));
				$("#mensajePosteo").modal('show');
		    	$('#botonPublicaFacebook').remove();
	    	}else if (data.tipo == "warning"){
	    		var json = [{
						texto_boton: 'aceptar',
						clase_bootstrap: 'warning',
						boton_cerrar: true
					}];
				$("#modals").append(generaModals('mensajePosteo', "Publicando en Facebook", data.mensaje, JSON.stringify(json)));
				$("#mensajePosteo").modal('show');	    		
	    	}else if (data.tipo == "error"){
	    		var json = [{
						texto_boton: 'aceptar',
						clase_bootstrap: 'danger',
						boton_cerrar: true
					}];
				$("#modals").append(generaModals('mensajePosteo', "Publicando en Facebook", data.mensaje, JSON.stringify(json) ));
				$("#mensajePosteo").modal('show');	    		
	    	}
	    },
	    "json"
		);
}