
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , principal = require('./routes/principal')
  , articulos = require('./routes/articulos')
  , comentarios = require('./routes/comentarios')
  , http = require('http')
  , fs = require('fs')
  , path = require('path');
var mongoose = require('mongoose');
var everyauth = require('everyauth');
var graph = require('fbgraph');

everyauth.debug = true

/** Connect to database and load models **/
mongoose.connect('mongodb://127.0.0.1/prueba');
var models_path = __dirname + '/models';
fs.readdirSync(models_path).forEach(function (file) {
    require(models_path+'/'+file)
});
var UserModel = mongoose.model('UserModel');

/**
 * Social login integration using Facebook
 */
everyauth.everymodule
    .findUserById( function (userId,callback) {
        UserModel.findOne({_id: userId},function(err, user) {
            callback(user, err);
        });
});

everyauth.facebook
    .appId('555848331151668')
    .appSecret('a4d19d6bba6811ae753c0800a788ba6b')
    .scope('email,user_location,user_photos,publish_actions,user_about_me,user_groups,friends_groups')
    .handleAuthCallbackError( function (req, res) {
        res.send('Error occured');
    })
    .findOrCreateUser( function (session, accessToken, accessTokExtra, fbUserMetadata) {

        var promise = this.Promise();
        UserModel.findOne({facebook_id: fbUserMetadata.id},function(err, user) {
            if (err) return promise.fulfill([err]);

            if(user) {

                // user found, life is good
                promise.fulfill(user);

            } else {

                // create new user
                var User = new UserModel({
                    name: fbUserMetadata.name,
                    access_token: accessToken,
                    firstname: fbUserMetadata.first_name,
                    lastname: fbUserMetadata.last_name,
                    email: fbUserMetadata.email,
                    username: fbUserMetadata.username,
                    gender: fbUserMetadata.gender,
                    facebook_id: fbUserMetadata.id,
                    facebook: fbUserMetadata
                });

                User.save(function(err,user) {
                    if (err) return promise.fulfill([err]);
                    promise.fulfill(user);
                });

            }


        });

        return promise;
    })
    .redirectPath('/principal');






var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/public/templates');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser({ keepExtensions: true}));
app.use(express.limit('5mb'));
app.use(express.cookieParser('secret'));
app.use(express.session({ secret: 'viewor' }));
app.use(everyauth.middleware(app));
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public/static')));
app.use(everyauth.middleware(app));
app.use(app.router);




// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


app.get('/', routes.index);
app.get('/principal', principal.index);
// Articulos a la venta
app.get('/vender', articulos.formularioAgregar);
app.post('/vender', articulos.agregar);
app.post('/vender/subirImagen', articulos.subirImagen);
app.get('/eliminaImagen', articulos.eliminaImagen);
app.get('/eliminaArticulo', articulos.eliminaArticulo);
app.get('/posteaFace', articulos.posteaFace);
app.get('/mostrar/:id_articulo/:titulo', articulos.mostrarArticulo);
app.get('/edita/:id_articulo/:titulo', articulos.editarArticulo);
app.post('/edita/guardaCambios', articulos.guardaCambiosArticulo);
app.get('/misArticulos', articulos.misArticulos);
// Comentarios
app.post('/addComentario', comentarios.addComentario);
app.get('/leeComentarios/:id_articulo', comentarios.leeComentarios);
app.get('/eliminaComentario', comentarios.eliminaComentario);
app.get('/calificaComentario', comentarios.calificaComentario);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

