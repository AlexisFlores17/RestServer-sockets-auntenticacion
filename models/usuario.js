const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    nombre:{
        type:String,
        required:[true,"El nombre es requerido"]
    },
    correo:{
        type:String,
        required:[true,"El correo es requerido"]
    },
    password:{
        type:String,
        required:[true,"La contraseña es requerida"]
    },
    img:{
        type:String
    },
    rol:{
        type:String,
        default:'USER_ROLE',
        required:true,
    },
    estado:{
        type:Boolean,
        default:true
    },
    google:{
        type:Boolean,
        default:false
    }
});


UsuarioSchema.methods.toJSON = function () {
    const {__v ,  password ,_id, ...usuario } = this.toObject();
    usuario.id = _id;
    return usuario;
}



module.exports = model('Usuario', UsuarioSchema );