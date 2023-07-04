const { request, response } = require("express");

const Medico = require('../models/medico');

const getMedicos =async (req = request, res = response)=>{

    const medicos = await Medico.find()
        .populate('usuario', 'nombre img')
        .populate('hospital', 'nombre img');

    return res.json({
        ok: true,
        medicos
    });
    
}

const crearMedico = async(req = request, res = response)=>{

   const uid = req.uid;

   const medico = new Medico({
     ...req.body,
     usuario: uid
   }); 

   try {

    const medicoDB = await medico.save();

    res.json({
        ok: true,
        medico: medicoDB
    })
    
   } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
   }
}

const actualizarMedico = async (req = request, res = response)=>{
        
    const id = req.params.id;
    const uid = req.uid;

    try {

        const medico = await Medico.findById(id);
        
        if(!medico){
            return res.status(404).json({
                ok: false,
                msg: 'medico no fue encontrado'
            });
        }

        

        const cambiosMedico = {
           ...req.body,
           usuario: uid
        }

        const medicoActualizado = await Medico.findByIdAndUpdate(id, cambiosMedico, {new: true});
        
        
        res.json({
            ok: true,
            medico: medicoActualizado
        });

    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const borrarMedico = async (req = request, res = response)=>{

    const id = req.params.id;

    try {

        const medico = await Medico.findById(id);
        
        if(!medico){
            return res.status(404).json({
                ok: false,
                msg: 'medico no fue encontrado'
            });
        }

        await Medico.findByIdAndDelete(id);
        
        res.json({
            ok: true,
            msg: 'Medico Eliminado'
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
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}