const { response } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/Usuario");
const { generarJWT } = require('../helpers/jwt');

const createUser = async (request, response = response) => {

    const { name, email, password } = request.body;

    try {

        let usuario = await Usuario.findOne({ email });

        if (usuario) {
            return response.status(400).json({
                ok: false,
                msg: 'Ya existe un usuario con ese correo',
            });
        };
        usuario = new Usuario(request.body);


        // encriptar password con BCRYPT
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);


        await usuario.save();

        // Generar JWT

        const token = await generarJWT( usuario.id, usuario.name );


        response.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token: token
        });
    } catch (error) {
        console.log(error);
        response.status(500).json({
            ok: false,
            msg: 'Por favor, hable con el administrador',
        });
    }
};



/////////////////////////////////////////////////

const loginUser = async (request, response = response) => {

    const { email, password } = request.body;

    try {

        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return response.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese mail',
            });
        };

        // confirmar los passwords

        const validPassword = bcrypt.compareSync(password, usuario.password);

        if (!validPassword) {
            return response.status(400).json({
                ok: false,
                msg: 'Password inválido',
            });
        };


        // generar nuestro Json Web Token

        const token = await generarJWT( usuario.id, usuario.name );


        response.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token: token
        });


    } catch (error) {
        console.log(error);
        response.status(500).json({
            ok: false,
            msg: 'Por favor, hable con el administrador',
        });
    };

};

/////////////////////////////////////////////////////////

const revalidateToken = async (request, response = response) => {

    const { uid, name } = request;

    const token = await generarJWT( uid, name );

    response.json({
        ok: true,
        token
    });
}

module.exports = {
    createUser,
    loginUser,
    revalidateToken
}
