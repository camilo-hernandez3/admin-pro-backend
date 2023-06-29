const express = require('express');
require('dotenv').config();
const cors = require('cors');
const {dbConnection} = require('./database/config');


//Crear el servidor express
const app = express();

//configurar cors
app.use(cors());

//lectura y parseo del body
app.use(express.json());

// Base de datos
dbConnection();

//Rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/login', require('./routes/auth'));


app.listen(process.env.PORT, ()=>{
    console.log('servidor corriendo en puerto ' + process.env.PORT);
});
