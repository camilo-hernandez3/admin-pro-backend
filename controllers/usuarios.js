const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { response, request } = require('express');
const { generarJWT } = require('../helpers/jwt');


const getUsuarios = async (req= request, res= response) => {

    const {desde = 0, limite = 5} = req.query;

    // const usuarios = await Usuario
    //     .find({}, 'nombre email role google')
    //     .skip(+desde)
    //     .limit(+limite);

    // const total = await Usuario.count();

    const [usuarios, total] = await Promise.all([
        Usuario
            .find({}, 'nombre email role google')
            .skip(+desde)
            .limit(+limite),
        Usuario.countDocuments()

    ]);


    res.json({
        ok: true,
        usuarios,
        total
    });
}

const crearUsuario = async (req, res = response) => {

    const { email, password, nombre } = req.body;


    try {

        const existeEmail = await Usuario.findOne({ email });

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'Correo ya existe'
            });
        }

        const usuario = new Usuario(req.body);

        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            usuario,
            token
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Algo salio mal... Revisar logs'
        });
    }
}

const actualizarUsuario = async (req = request, res = response) => {

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: `No existe un usuario por id ${uid}`
            });
        }
        // Actualizaciones
        const {password, google, email, ...campos} = req.body;

        if(usuarioDB.email  !== email ){
        
            const existeEmail = await Usuario.findOne({email: req.body.email});

            if(existeEmail){
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con es email'
                });
            }
        }

        campos.email = email;
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {new: true});

        res.json({
            ok: true,
            usuario: usuarioActualizado
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }


}

const borrarUsuario = async(req = request, res= response)=>{

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: `No existe un usuario por id ${uid}`
            });
        }

        await Usuario.findByIdAndDelete(uid);

        res.json({
            ok: true,
            msg: 'Usuario eliminado'
        });
       
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg:'Hable con el administrador'
        })
    }
   




}

module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}