
const express = require('express');
const { dbConnection } = require('./database/config'); // realiza la conexión con la DB que declaré en database
require('dotenv').config();
const cors = require('cors');

console.log(process.env)
// crear el servidor de express

const app = express();


// base de datos

dbConnection();


// CORS


app.use(cors()); 



// directorio público

app.use( express.static('public')); // funcion que se ejecuta al momento que alguien hace una peticion al servidor


// Lectura y parseo del body
app.use( express.json() );


// rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));


// escuchar peticiones
 
app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${ process.env.port }` );
});