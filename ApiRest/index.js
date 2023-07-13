//importar dependencias
const database = require('./database/connection');
const express = require('express');
const cors = require('cors');
require('./database/associations')



// Roles de miembros disponibles, NO SE MODIFICAN
const roles = [
  { role_name: "Tesorero", role_description: "Administracion de transacciones" },
  { role_name: "Maestro", role_description: "Encargado de apartados de enseñanza", age: 38, role: 1 }
];


//mensaje bienvenida
console.log("Api Node para Iglesia")

//conexion a bbdd
//connection();

async () => {
  try {
    await database.authenticate();
    await database.sync();
  } catch (error) {
    throw new Error(error);
  }
}

//Crear servidor node
const app = express();
const port = 3000;

//Configurar cors
app.use(cors());


//Convertir los datos del body a objetos js
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

//Cargar conf rutas
const memberRouter = require("./routes/member");
const churchRouter = require("./routes/church");
const rolesRouter = require("./routes/role");
const meetingRouter = require("./routes/meeting");
const treasuryRouter = require("./routes/treasury");
const taskRouter = require("./routes/task");
const questionRouter = require("./routes/question");
const answerRouter = require("./routes/answer");
const specialTaskRouter = require("./routes/specialTask");
const typeTreasuryRouter = require("./routes/typeTreasury");


app.use("/api/member", memberRouter);
app.use("/api/church", churchRouter);
app.use("/api/role", rolesRouter);
app.use("/api/meeting", meetingRouter);
app.use("/api/treasury", treasuryRouter);
app.use("/api/task", taskRouter);
app.use("/api/question", questionRouter);
app.use("/api/answer", answerRouter);
app.use("/api/specialTask", specialTaskRouter);
app.use("/api/typeTreasury", typeTreasuryRouter);

//Poner servidor a escuchar peticiones http
app.listen(port, () => {

  console.log("Servidor corriendo en puerto:" + port);

  //conectarse a la base de datos
  //Force true: DROP TABLE
  database.sync({ force: false }).then(() => {
    console.log("Se ha conectado con la base de datos")
  }).then(() => {

    //roles.forEach(rol => Roles .create(rol));
  }).catch(error => {
    console.log('Se ha producido un error', error);
  })

})


