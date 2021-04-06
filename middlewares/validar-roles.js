const { response } = require('express');

const esAdminRole = ( req, res= response, next )=>{


        if (!req.usuario) {
            return res.status(500).json({
                msg: "Se quiere validar el rol sin el toquen verificado"
            });
        }

        const { rol, nombre } = req.usuario;

        if ( rol !== 'ADMIN_ROLE') {
            return res.status(401).json({
                msg: ` ${nombre} necesita permisos de administrador`
            });
        }

        next();
}

const tieneRole = ( ...roles )=>{
    return (req, res= response, next)=>{
        
        if (!req.usuario) {
            return res.status(500).json({
                msg: "Se quiere validar el rol sin el toquen verificado"
            });
        }

        if ( !roles.includes( req.usuario.rol )) {
            return res.status(401).json({
                msg: "El servicio requiere permisos extras"
            });
        }
    
        

        next();
    }
}

module.exports ={
    esAdminRole,
    tieneRole
}