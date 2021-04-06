const { Router } = require('express');
const { check } = require('express-validator');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');
const { esAdminRole } = require('../middlewares');
const { ValidarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

//Obtener todas las categorias
router.get('/', obtenerCategorias );

//Obtener una categoria por id

router.get('/:id',[
    check('id', 'No es in id de Mongo valido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    ValidarCampos,
],obtenerCategoria);

//Crear categoria

router.post('/',[
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    ValidarCampos
], crearCategoria );

//Actualizar un registro por id

router.put('/:id',[
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check('id').custom( existeCategoriaPorId ),
    ValidarCampos
],actualizarCategoria);

//Borrar categoria

router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es in id de Mongo valido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    ValidarCampos
],borrarCategoria);

module.exports= router;