const { Router } = require('express');
const { check } = require('express-validator');
const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');
const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators');
const { esAdminRole } = require('../middlewares');
const { ValidarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

//Obtener todas las productos
router.get('/', obtenerProductos );

//Obtener una producto por id

router.get('/:id',[
    check('id', 'No es in id de Mongo valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    ValidarCampos,
],obtenerProducto);

//Crear producto

router.post('/',[
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("categoria",'No es in id de mongo').isMongoId(),
    check('categoria').custom( existeCategoriaPorId),
    ValidarCampos
], crearProducto );

//Actualizar un registro por id

router.put('/:id',[
    validarJWT,
    check('id').custom( existeProductoPorId ),
    ValidarCampos
],actualizarProducto);

//Borrar producto

router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es in id de Mongo valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    ValidarCampos
],borrarProducto);

module.exports= router;