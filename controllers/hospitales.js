const { request, response } = require("express");

const Hospital = require('../models/hospital');

const getHospitales = async (req = request, res = response)=>{

    const hospitales = await Hospital.find()
        .populate('usuario', 'nombre img');

    res.json({
        ok: true,
        hospitales
    });
}

const crearHospitales = async (req = request, res = response)=>{

    const uid = req.uid;

    const hospital = new Hospital({
        ...req.body,
        usuario: uid
    });
    
    try {
      
        const hospitalDB = await hospital.save();

        res.json({
            ok: true,
            hospital: hospitalDB
        });
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }


}

const actualizarHospital =(req = request, res = response)=>{

    res.json({
        ok: true,
        msg: 'actualizarHospital'
    });
}
const borrarHospital =(req = request, res = response)=>{

    res.json({
        ok: true,
        msg: 'borrarHospital'
    });
}




module.exports ={
    getHospitales,
    crearHospitales,
    actualizarHospital,
    borrarHospital
}