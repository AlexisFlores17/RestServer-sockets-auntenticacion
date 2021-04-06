const { Router } = require('express');
const { check } = require('express-validator');
const { 
    usuariosGet,
    usuariosPut, 
    usuariosPost, 
    usuariosPatch, 
    usuariosDelete 
} = require('../controllers/usuarios');
const { esRoleValido , emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

const {
    ValidarCampos,
    validarJWT,
    esAdminRole,
    tieneRole
} = require('../middlewares');

const router = Router();



router.get('/', usuariosGet);

router.put('/:id',[
    check('id','No es in ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRoleValido),
    ValidarCampos
],usuariosPut);

router.post('/',[
    check('nombre', 'El nombre es obligatorio ').not().isEmpty(),
    check('password', 'El password debe ser de más de 6 letras ').isLength({ min: 6}),
    check('correo', 'El correo no es valido ').isEmail(),
    check('correo').custom(emailExiste),
    check('rol').custom(esRoleValido),
    ValidarCampos,
] ,usuariosPost);

router.patch('/', usuariosPatch);

router.delete('/:id',[
    validarJWT,
    esAdminRole,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id','No es in ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    ValidarCampos,
], usuariosDelete);


module.exports= router;