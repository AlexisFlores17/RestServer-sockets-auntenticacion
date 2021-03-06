const { response } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify} = require('../helpers/google-verify');

const login = async(req, res = response ) =>{

    const { correo, password} = req.body;

    try {

        //verificar si el email existe

        const usuario = await Usuario.findOne({ correo });

        if ( !usuario ) {

            return res.status(400).json({
                msg: 'Usuario y/o contraseña incorrecta'
            })
            
        }



        //verificar si el usuario esta activo

        if ( !usuario.estado ) {

            return res.status(400).json({
                msg: 'Usuario y/o contraseña incorrecta'
            })
            
        }

        //Verificar contraseña

        const validPassword = bcryptjs.compareSync(password, usuario.password);

        if ( !validPassword) {
            
            return res.status(400).json({
                msg: 'Usuario y/o contraseña incorrecta'
            })
        }

        //Verificar JWT

        const token= await generarJWT(usuario.id);
        
        res.json({
            ok:'Login ok',
            usuario,
            token
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }

}

const googleSingin = async( req, res=response ) =>{

    const { id_token } = req.body;
    try {
    
        const { correo, nombre, img } = await googleVerify( id_token);

        let usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            const data = {
                nombre,
                correo,
                password:'password',
                img,
                google:true
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        if (!usuario.estado) {
            return res.status(401).json({
                msg:'Hable con el administrador, Usuario bloqueado'
            });
        }

        const token= await generarJWT(usuario.id);
        
        res.json({
            usuario,
            token
        })
        
    } catch (error) {
        
        res.status(400).json({
            msg:'Token de Google no es valido'
        })
    }

}

const renovarToken = async( req, res= response)=>{

    const { usuario } = req;

    const token = await generarJWT( usuario.id);
    res.json({
        usuario,
        token
    });
}


module.exports ={
    login,
    googleSingin,
    renovarToken
}