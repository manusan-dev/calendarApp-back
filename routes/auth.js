
const { Router } = require('express');
const { createUser, loginUser, revalidateToken } = require('../controllers/auth');
const { check } = require('express-validator');
const { validateField } = require('../middlewares/field-validator');
const router = Router();
const { validateJWT } = require('../middlewares/jwt-validator');


router.post('/new',
    [ // middlewares
        check('name', "El nombre es obligatorio").not().isEmpty(),
        check('email', "El e-mail es obligatorio").isEmail(),
        check('password', "El password debe contener 6 caracteres").isLength(6),
        validateField

    ],
    createUser);

router.post('/',
    [
        check('email', "El e-mail es obligatorio").isEmail(),
        check('password', "El password debe contener 6 caracteres").isLength(6),
        validateField
    ],
    loginUser);
    



router.get('/renew', validateJWT, revalidateToken);


module.exports = router;