

const {Router} = require('express');
const { check } = require('express-validator');


const { usuariosGet, usuariosPost, usuariosPut, usuariosPatch, usuariosDelete } = require('../controllers/usuarios');

const { validarCampos } =  require('../middlewares/validar-campos');
const { esRoleValido, validarCorreoExiste, existeUsuarioPorId } = require('../helpers/db-validators');

const router = new Router();

router.get('/', usuariosGet );

router.put('/:id', [
    
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    check('rol').custom( esRoleValido ),

    validarCampos

] , usuariosPut);

router.post('/', [

    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe ser superior de 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no es válido!').isEmail(),
    check('correo').custom( validarCorreoExiste ),
    check('rol').custom( esRoleValido ),

    validarCampos,
    
] ,usuariosPost);

router.patch('/', usuariosPatch);

router.delete('/', usuariosDelete); 

module.exports = router;

