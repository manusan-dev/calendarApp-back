/*
    Event Routes
    /api/events
*/

const { Router } = require('express');
const router = Router();
const { validateJWT } = require ('../middlewares/jwt-validator');
const { getEventos, createEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');
const { check } = require('express-validator');
const { validateField } = require('../middlewares/field-validator');
const { isDate } = require('../helpers/isDate');

// todas tienen que pasar por la validación del token
// Obtener eventos

router.use(validateJWT); // declaras inicialmente el middleware para que aplique de forma global




router.get('/', getEventos);

// crear un nuevo evento

router.post('/',
    [
        check('title', 'El título es obligatorio').notEmpty(),
        check('start', 'Fecha de inicio obligatoria').custom( isDate ),
        check('end', 'Fecha de finalización obligatoria').custom( isDate ),
        validateField
    ],
     createEvento);


// actualizar evento

router.put('/:id', actualizarEvento);


// borrar evento

router.delete('/:id', eliminarEvento);



module.exports = router;