const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSingin } = require('../controllers/auth');
const { ValidarCampos } = require('../middlewares/validar-campos');

const router = Router();



router.post('/login',[
    check('correo','el correo es obligatorio').isEmail(),
    check('password','La contraseña es obligatoria').not().isEmpty(),
    ValidarCampos,
],login);

router.post('/google',[
    check('id_token','El id_token es necesario').not().isEmpty(),
    ValidarCampos,
],googleSingin);




module.exports= router;