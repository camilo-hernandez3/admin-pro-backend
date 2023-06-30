const path = require('path');
const { request, response } = require("express");

const fs = require('fs');

const { v4:uuidv4 } = require('uuid');
const { actualizarImagen } = require("../helpers/actualizar-imagen");




const fileUpload = async (req = request, res = response) => {

    const tipo = req.params.tipo;
    const id = req.params.id;

    //* validar tipos
    const tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    if(!tiposValidos.includes(tipo)){
        return res.status(400).json({
            ok: false,
            msg:'No es médico, usuario u hospital'
        });
    }

    //* Validar que existe un archivo
    if(!req.files || Object.keys(req.files).length === 0){
        return res.status(400).json({
            ok:false,
            msg: 'No hay ningun archivo'
        });
    } 

    //* Procesar la imagen..
    const file = req.files.imagen;

    const nombreCortado = file.name.split('.');
    const extension = nombreCortado[nombreCortado.length-1];

    //* Validar extension
    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
    if(!extensionesValidas.includes(extension)){
        return res.status(400).json({
            ok: false,
            msg: 'No es una extensión permitida'
        });
    }
    

    //* Generar el nombre del archivo
    const nombreArchivo = `${uuidv4()}.${extension}`;

    //* Path para guardar la imagen
    const path = `./uploads/${tipo}/${nombreArchivo}`;

    //* Mover la imagen
    file.mv(path, async(err)=>{
        if(err){ 
            console.log(err);
            return res.status(500).json({ ok: false, msg: 'no se pudo cargar el archivo'});
        }

        //* Actualizar base de datos
        const estado = await actualizarImagen(tipo, id, nombreArchivo);
        return res.json({
            ok: true,
            msg: 'guardado correctamente',
            nombreArchivo
        })


    });
   

}

const retornaImagen =(req =request , res = response)=>{

    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);
    
    //imagen por defecto
    if(fs.existsSync(pathImg)){
        res.sendFile(pathImg);
    }else{
        const pathImg = path.join(__dirname, `../uploads/no-img.png`);
        res.sendFile(pathImg);
    }


}


module.exports = {
    fileUpload,
    retornaImagen
}