const express = require('express');
require('dotenv').config();
const cors = require('cors');
const {dbConnection} = require('./database/config');


//Crear el servidor express
const app = express();

//configurar corss
app.use(cors());

// Base de datos
dbConnection();


app.get('/', (req, res)=>{

    return res.json({
        ok: true,
        msg:'Hola Mundo'
    })

});


app.listen(process.env.PORT, ()=>{
    console.log('servidor corriendo en puerto ' + process.env.PORT);
});
