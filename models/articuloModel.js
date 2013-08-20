var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Schema
 */
var ArticuloSchema = Schema({
    titulo: String,
    descripcion: String,
    precio: Number,
    fecha_creacion: { type: Date, default: Date.now },
    imagenes: {}
});


module.exports = mongoose.model('ArticuloModel', ArticuloSchema);