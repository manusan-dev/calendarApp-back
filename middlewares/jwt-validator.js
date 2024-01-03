const { response } = require('express');
const jwt = require('jsonwebtoken');

const validateJWT = ( request, response = response, next ) => {

    const token = request.header('x-token');

    if( !token ){
        return response.status(401).json({
            ok: false,
            msg: 'No hay token en la petición',
        });
    };

    try {
      
        const {uid, name} = jwt.verify( token, process.env.SECRET_JWT_SEED );
        
        request.uid = uid;
        request.name = name;

    } catch (error) {
        return response.status(401).json({
            ok: false,
            msg: 'Token no válido',
        });
    };

    next();

};

module.exports = {
    validateJWT,
}