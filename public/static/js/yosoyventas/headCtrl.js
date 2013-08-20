var app = angular.module("headApp",[]);


app.directive("enter", function(){
	return function(scope, element){
		var nombre = element.text();
		element.bind("mouseenter", function(){
			element.html("Cerrar Sesion " + nombre)
		})
	}	
});

app.directive("leave", function(){
	return function(scope, element){
		var nombre = element.text()
		element.bind("mouseleave", function(){
			element.html(nombre)
		})
	}	
});