const jwt = require('jsonwebtoken');
const { response, request } = require('express');
const Usuario = require('../models/usuario');

const validarJWT = async( req= request, res= response, next)=>{

    const token= req.header('x-token');

    if ( !token) {
        
        return res.status(400).json({
            msg:'Token no valido'
        });
    }

    try {

        const {uid}= jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        usuario = await Usuario.findById(uid);

        if (!usuario) {
            return res.status(401).json({
                msg:'Token no valido'
            });
        }

        //verificar si el uid no esta deshanilitado

        if (!usuario.estado) {
            
            return res.status(401).json({
                msg:'Token no valido'
            });
        }

        req.usuario = usuario;

        next();
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            msg:'Token no valido'
        });
    }

    

}


module.exports ={
    validarJWT
}