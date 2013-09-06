var jsonAux = undefined;
// Esta es un prototype que permite verificar si hay un valor dentro del array ejemplo
// array.indexOfPropertyValue('_id', id_imagen)
(function(){
  if (!Array.prototype.indexOfPropertyValue){
    Array.prototype.indexOfPropertyValue = function(prop,value){
      for (var index = 0; index < this.length; index++){
        if (prop in this[index]){
          if (this[index][prop] == value){
            return index;
          }
        }
      }
      return -1;
    }
  }
 })();

// Sirve para manejar el json en tiempo de ejecucion e intentar mantener ordenado los datos de las imagenes
function manageAux(ruta_imagen, filename){
	var id_imagen = 0;
	console.log(jsonAux);
	if (jsonAux==undefined){
		jsonAux = { imagenes : [ { imagen : ruta_imagen, _id : id_imagen }]};
	}
	else{
		while(jsonAux.imagenes.indexOfPropertyValue('_id', id_imagen) != -1 ){
		    id_imagen++;
		}	
		jsonAux.imagenes.push({ imagen : ruta_imagen, _id : id_imagen });	    	
	}
	$('#status').text('La imagen '+filename+' fue agregada correctamente, has click aqui para agregar otra').removeClass("alert alert-info alert-danger").addClass("alert alert-success" );
	//$('#imagenes').append('<div class="media col-lg-2 '+ id_imagen +'"><img id="uploadedImage" class="media-object img-thumbnail" src='+ ruta_imagen +'><a href="#" class="btn btn-danger btn-xs" onClick="eliminaImagen(\''+id_imagen+'\', \'NO\', \''+ruta_imagen+'\')">eliminar</a></div>');
	$('#imagenes').append('<div class="media col-lg-2 '+ id_imagen +'"><img id="uploadedImage" class="media-object img-thumbnail" src='+ ruta_imagen +'><a data-toggle="modal" data-placement="bottom" rel="tooltip" title="Elimina esta imagen" href="#modalEliminaImagen" onClick="cambiaOnclick(\''+id_imagen+'\',\'NO\', \''+ruta_imagen+'\')" class="btn btn-danger btn-xs" >eliminar imagen</a></div>');
	$('#userPhotoInput').val('');	
	
}

//bind click
$('#status').click(function(event) {
  $('#userPhotoInput').click();
});




$(document).ready(function()
{



	$('#status').text('Elige una imagen :)').removeClass("alert alert-success").addClass("alert alert-info" );
	

	$('input[type=file]').change(function()
	{ 
			var filename = $('input[type=file]').val().split('\\').pop();
			var extension = filename.split('.').pop();
			extension = extension.toUpperCase();
			var tamaño = this.files[0].size/1048576;
				if (extension == 'PNG' || extension == 'GIF' || extension == 'JPG' || extension == 'JPEG'){
					if (tamaño > 2){
				 		$('#status').text('El tamaño de la imagen es mayor  2 megas, por favor sube imagenes mas menos pesadas').removeClass("alert alert-info").addClass("alert alert-danger" );
					}else{
						// select the form and submit
			    		$('#uploadForm').submit(); 
					}
				}else{
					 $('#status').text('Elige una imagen (png, gif, jpg) haciendo clic aqui.').removeClass("alert alert-info").addClass("alert alert-danger" );
				}



	});
	$('#uploadForm').submit(function() 
	{
		var filename = $('input[type=file]').val().split('\\').pop();
	    $('#status').text('Subiendo la imagen: '+filename+' espera por favor').removeClass("alert alert-success alert-danger").addClass("alert alert-info" );
		$(this).ajaxSubmit(
		{                                                                                                   
			    error: function(xhr) 
				{
				        $('#status').text('Elige una imagen haciendo clic aqui').removeClass("alert alert-info alert-success").addClass("alert alert-danger" );
				},
				success: function(response) 
				{
				 	if(response.error) 
				 	{
					    mensaje('Algo malo paso xD' + response.error);
					    return;
					}
				    manageAux(response.path, filename);
				}
		});
		    
		// Have to stop the form from submitting and causing                                                                                                       
		// a page refresh - don't forget this                                                                                                                      
		return false;
	});

	$('#informacionForm').submit(function(){
		$(this).ajaxSubmit({                                                                                                   
			error: function(xhr){
				$('#alerta').html('error: ' + xhr).removeClass("alert alert-success alert-warning").addClass("alert alert-danger" );
			},
			success: function(response){
				if(response.tipo == "error"){
					$('#alerta').html(response.mensaje).removeClass("alert alert-success alert-warning").addClass("alert alert-danger" );
					return;
				}
				else if(response.tipo == "success"){
					$("#tituloModalMensaje").text("¡Todo salio bien!");
					$("#bodyModalMensaje").html('<p>'+ response.mensaje+'<p/>');
					if (response.from == "add"){
						$("#footerModalMensaje").html('<button type="button" data-dismiss="modal" class="btn btn-success" onClick="recargaVender()">Aceptar</button>')
					}
					else if (response.from == "edit"){
						$("#footerModalMensaje").html('<button type="button" data-dismiss="modal" class="btn btn-success" onClick="cerrarModalMensaje()">Aceptar</button>')
					}
					$("#modalMensaje").modal('show');
				}
				else if (response.tipo == "warning"){
					$("#tituloModalMensaje").text("¡Hay un pequeño problema!");
					$("#bodyModalMensaje").html('<p>'+ response.mensaje+'<p/>');
					if (response.from == "add"){
						$("#footerModalMensaje").html('<button type="button" data-dismiss="modal" class="btn btn-warning" onClick="recargaVender()">Aceptar</button>')
					}
					else if (response.from == "edit"){
						$("#footerModalMensaje").html('<button type="button" data-dismiss="modal" class="btn btn-warning" onClick="cerrarModalMensaje()">Aceptar</button>')
					}
					$("#modalMensaje").modal('show');
				}					    
			}
		});
	    	// Have to stop the form from submitting and causing                                                                                                       
	    	// a page refresh - don't forget this                                                                                                                      
		return false;
	});


});

// Precarga las imagenes en la vista
function cargaImagenes(imagenes, id_articulo){
	$.each(imagenes, function(index, value){
		$('#imagenes').append('<div class="media col-lg-2 '+value._id+'"><img id="uploadedImage" class="media-object img-thumbnail" src='+ value.imagen +'><a data-toggle="modal" data-placement="bottom" rel="tooltip" title="Elimina esta imagen" href="#modalEliminaImagen" onClick="cambiaOnclick(\''+value._id+'\', \''+ id_articulo +'\', \''+value.imagen+'\')" class="btn btn-danger btn-xs" >eliminar imagen</a></div>');
		llenaAux(value._id, value.imagen);
	});
}

function cambiaOnclick(id_imagen, id_articulo, ruta){
	$('#modalEliminaImagen').on('show.bs.modal', function () {
	 	$( "#botonModalEliminar" ).attr( "onClick", 'eliminaImagen(\''+id_imagen+'\', \''+ id_articulo +'\', \''+ruta+'\')' );
	})
}

//Cierra el modal Mensaje
function cerrarModalMensaje(){
	$("#modalMensaje").modal('hide');
}


//Rellena jsonAux
function llenaAux(id, ruta){
	if (jsonAux==undefined){
		jsonAux = { imagenes : [ { imagen : ruta, _id : id }]};
	}
	else{
		jsonAux.imagenes.push({ imagen : ruta, _id : id });
	}
}



// Llamada ajax para mandar a eliminar la imagen
function eliminaImagen(id_imagen, id_articulo, ruta_imagen){
	$("#modalEliminaImagen").modal('hide')
	$.get(
	    "/eliminaImagen",
	    {id_imagen: id_imagen ,id_articulo: id_articulo, ruta_imagen: ruta_imagen },
	    function(data){ 
	    	if (data.tipo == "success"){
	    		var index = jsonAux.imagenes.indexOfPropertyValue('_id', id_imagen);
	    		jsonAux.imagenes.splice(index,1);
	    		console.log(jsonAux.imagenes);
	    		$('.'+id_imagen).remove();
	    	}
	    },
	    "json"
		);
}

//Carga la interfaz de tiny y lo rellena si es que hay valores
function cargarTiny(aux){
	tinymce.init({
		selector: "textarea",
		plugins : 'advlist autolink link lists charmap media preview searchreplace hr table textcolor image',
		browser_spellcheck : true,
		toolbar: "bold italic underline strikethrough alignleft aligncenter alignright alignjustify formatselect fontselect fontsizeselect bullist numlist outdent indent blockquote undo redo removeformat subscript superscript forecolor | preview | link | charmap | media image | searchreplace | hr | table",
		menubar : false,
		fullpage_default_encoding: "UTF-8",
		tools: "inserttable",
		setup: function(editor){
        	editor.on('init', function(e){
            	tinymce.get('descripcion').setContent(aux);
        	});
    	}
	});
}

 

// Cuando se le da aceptar al exito de agregar articulo se dirige aqui
function recargaVender(){
	location.href="/misArticulos";
} 




// Ajax para enviar informacion a post a /vender
function enviaInformacion(valor){
	if ($("#informacionForm").valid() == false){
		$('label.error').addClass("label label-warning")
	}
	else{
	    $('#imagenesField').val(JSON.stringify(jsonAux));
	    if (tinymce.get('descripcion').getContent() == ''){
	    	$('#alerta').text("Tienes que agregar una descripcion" ).removeClass("alert alert-success").addClass("alert alert-danger" );
	    }
	    else{
	        $('#descripcionField').val(tinymce.get('descripcion').getContent());
			if (valor == 'editar'){
				console.log(valor);
				$('#btnGuardar').attr("disabled", true);
				setTimeout("$('#btnGuardar').attr('disabled', false)", 4000);
			}else{
				$('#btnGuardar').attr("disabled", true);
			}
			$('#informacionForm').submit();
		}
	}

}