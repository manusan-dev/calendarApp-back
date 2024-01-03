const { response } = require('express');
const Evento = require('../models/Evento');

const getEventos = async (req, res = response) => {

    const eventos = await Evento.find().populate('creator', 'name');


    res.json({
        ok: true,
        eventos: eventos,
    });
};

////////////////////////////////////////////////////////////////////////////////


const createEvento = async (req, res = response) => {

    const evento = new Evento(req.body);

    try {

        const { uid } = req;

        evento.creator = uid;

        const eventoGuardado = await evento.save();

        res.json({
            ok: true,
            evento: eventoGuardado,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el Administrador',
        });
    };
};

////////////////////////////////////////////////////////////////////////////////


const actualizarEvento = async (req, res = response) => {


    const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await Evento.findById(eventoId);

        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe evento con ese ID',
            });
        };

        if(evento.creator.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de editar este evento'
            });
        };
        
        const nuevoEvento = {
            ...req.body,
            user: uid
        };

        const eventoActualizado = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, {new: true} );


         res.json({
            ok: true,
            evento: eventoActualizado
        })


   


    } catch (error) {
        console.log(error);
         res.status(500).json({
            ok: false,
            msg: 'Hable con el Administrador'
        });
    };
};



////////////////////////////////////////////////////////////////////////////////




const eliminarEvento = async (req, res = response) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await Evento.findById(eventoId);

        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe evento con ese ID',
            });
        };

        if(evento.creator.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg: 'No puede eliminar este evento'
            });
        };

        const eventoEliminado = await Evento.findByIdAndDelete(eventoId);

         res.json({
            ok: true,
            evento: eventoEliminado,
        })

    } catch (error) {
        console.log(error);
         res.status(500).json({
            ok: false,
            msg: 'Hable con el Administrador'
        });
    };
};

module.exports = {
    getEventos,
    createEvento,
    actualizarEvento,
    eliminarEvento
}