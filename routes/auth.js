/**
 * Path /api/login
 */
const  {Router} = require('express');
const {check} = require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');
const { login, googleSignIn, renewToken } = require('../controllers/auth');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post('/',
    [
        check('email', 'correo es obligatorio').isEmail(),
        check('password', 'passowrd es obligatorio').not().isEmpty(),
        validarCampos
    ], 
    login);

router.post('/google', 
    [
       check('token', 'El token de google es necesario').not().isEmpty(),
       validarCampos
    ],googleSignIn);

router.get('/renew', 
    [
        validarJWT
    ],
    renewToken);

module.exports =router;