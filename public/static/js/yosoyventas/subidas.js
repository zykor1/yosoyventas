var aux = undefined; 
$(document).ready(function() {
 
    mensaje('Elige una imagen :)');


$('input[type=file]').change(function() { 
    // select the form and submit
    $('#uploadForm').submit(); 
});

 
var estatus = 0;



$('#uploadForm').submit(function() {
    mensaje('uploading the file ...');
    if (estatus === 0)
    {
    	console.log(" aun eres el primero xD ");
			$(this).ajaxSubmit({                                                                                                   
			    error: function(xhr) {
			        $('#status').text('Elige una imagen en el recuadro de abajo').removeClass("label label-info").addClass("label label-danger" );
			    },
			 
			    success: function(response) {
			 
			        if(response.error) {
			            mensaje('Algo malo paso xD' + response.error);
			            return;
			        }
			    aux = { imagenes : [ { imagen : response.path }]};
			    //aux.imagenes.push({imagen: "direcion"});
			    console.log(aux.imagenes[0].imagen);
				$('#status').text('Exito, La imagen fue subida:').removeClass("label label-info").addClass("label label-success" );
				$('#imagenes').append('<div class="media col-lg-2"><img id="uploadedImage" class="media-object img-thumbnail" src='+ aux.imagenes[estatus].imagen +'></div>');
				$('#userPhotoInput').val('');
				estatus++;
			    }
			});
    
    }
    else{
    	console.log(" ya no eres el primero culero xD ");
			$(this).ajaxSubmit({                                                                                                   
			    error: function(xhr) {
			        $('#status').text('Elige una imagen en el recuadro de abajo').removeClass("label label-info").addClass("label label-danger" );
			    },
			 
			    success: function(response) {
			 
			        if(response.error) {
			            mensaje('Algo malo paso xD' + response.error);
			            return;
			        }
			    aux.imagenes.push({ imagen : response.path });
			    console.log(aux.imagenes);
				$('#status').text('Exito, La imagen fue subida:').removeClass("label label-info").addClass("label label-success" );
				$('#imagenes').append('<div class="media col-lg-2"><img id="uploadedImage" class="media-object img-thumbnail" src='+ aux.imagenes[estatus].imagen +'></div>');
				$('#userPhotoInput').val('');
				estatus++;
			    }
			});
    }
	// Have to stop the form from submitting and causing                                                                                                       
	// a page refresh - don't forget this                                                                                                                      
	return false;
});

	function mensaje(message) {
		$('#status').text(message);
    }

	$('#informacionForm').submit(function() {
				$(this).ajaxSubmit({                                                                                                   
				    error: function(xhr) {
				        $('#alerta').text('error: ' + xhr).removeClass("alert alert-success").addClass("alert alert-danger" );
				    },
				    success: function(response) {
				        if(response.error) {
				        	$('#alerta').text(response.error).removeClass("alert alert-success").addClass("alert alert-danger" );
				            return;
				        }
				    $('#alerta').text(response.mensaje ).removeClass("alert alert-danger").addClass("alert alert-success" );
				    alert(response.mensaje);
				    window.location="/vender";
				    }
				});
	    
		// Have to stop the form from submitting and causing                                                                                                       
		// a page refresh - don't forget this                                                                                                                      
		return false;
	});


});

tinymce.init({ selector: "textarea",
plugins : 'advlist autolink link lists charmap media preview emoticons searchreplace hr table textcolor',
browser_spellcheck : true,
toolbar: "bold italic underline strikethrough alignleft aligncenter alignright alignjustify formatselect fontselect fontsizeselect bullist numlist outdent indent blockquote undo redo removeformat subscript superscript forecolor | preview | link | charmap | media | emoticons | searchreplace | hr | table",
menubar : false,
fullpage_default_encoding: "UTF-8",
tools: "inserttable"
});

//Cancelar agregar producto a vender
function cancelarProducto(){
	window.location="/";
}




// Empezando con el segundo formulario

function enviaInformacion(){

if ($("#informacionForm").valid() == false){
		$('label.error').addClass("label label-warning")
	}else{
	    $('#imagenesField').val(JSON.stringify(aux));
	    if (tinymce.get('descripcion').getContent() == ''){
	    	$('#alerta').text("Tienes que agregar una descripcion" ).removeClass("alert alert-success").addClass("alert alert-danger" );
	    }else{
	        $('#descripcionField').val(tinymce.get('descripcion').getContent());
			console.log($('#descripcionField').val());
			$('#informacionForm').submit();
		}
	}

}





