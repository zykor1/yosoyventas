// Llamada ajax para mandar a eliminar la imagen
var numPagina = 1;
function paginar(id_imagen, id_articulo, ruta_imagen){
	$.get(
	    "/principal",
	    {pagina: numPagina},
	    function(data){ 
	    	console.log(data);
	    	if (data.tipo == "success"){
				numPagina++;
	    	}
	    },
	    "json"
		);
}