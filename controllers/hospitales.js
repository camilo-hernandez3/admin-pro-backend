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

const actualizarHospital =async (req = request, res = response)=>{
    
    const id = req.params.id;
    const uid = req.uid;

    try {

        const hospital = await Hospital.findById(id);
        
        if(!hospital){
            return res.status(404).json({
                ok: false,
                msg: 'Hospital no fue encontrado'
            });
        }

        // hospital.nombre = req.body.nombre;

        const cambiosHospital = {
           ...req.body,
           usuario: uid
        }

        const hospitalActualizado = await Hospital.findByIdAndUpdate(id, cambiosHospital, {new: true});
        
        
        res.json({
            ok: true,
            hospital: hospitalActualizado
        });

    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

const borrarHospital = async (req = request, res = response)=>{

    const id = req.params.id;

    try {

        const hospital = await Hospital.findById(id);
        
        if(!hospital){
            return res.status(404).json({
                ok: false,
                msg: 'Hospital no fue encontrado'
            });
        }

        await Hospital.findByIdAndDelete(id);
        
        res.json({
            ok: true,
            msg: 'Hospital Eliminado'
        });

    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

  
}




module.exports ={
    getHospitales,
    crearHospitales,
    actualizarHospital,
    borrarHospital
}