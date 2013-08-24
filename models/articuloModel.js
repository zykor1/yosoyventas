var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Schema
 */
var ArticuloSchema = Schema({
	_creador: { type: Schema.Types.ObjectId, ref: 'UserModel' },
    titulo: String,
    descripcion: String,
    descripcion_corta: String,
    precio: Number,
    tipo_moneda: String,
    permitir_cambio: Boolean,
    precio_negociable: Boolean,
    fecha_creacion: { type: Date, default: Date.now },
    imagenes: {},
    comentarios: [{type: Schema.Types.ObjectId, ref: 'ArticuloComentarioModel'}],
    calificacion: [{type: Schema.Types.ObjectId, ref: 'UserModel', calificacion: Boolean}]
});


var ArticuloComentarioSchema = Schema({
	_creador: { type: Schema.Types.ObjectId, ref: 'UserModel' },
	_articulo: { type: Schema.Types.ObjectId, ref: 'ArticuloModel' },
    titulo: String,
    comentario: String,
    precio: Number,
    fecha_creacion: { type: Date, default: Date.now },
    calificacion: [{type: Schema.Types.ObjectId, ref: 'UserModel', calificacion: Boolean}]
});

module.exports = mongoose.model('ArticuloModel', ArticuloSchema);
module.exports = mongoose.model('ArticuloComentarioModel', ArticuloComentarioSchema);