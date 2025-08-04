import express from "express";
import cors from "cors";
import pkg, {Pool} from "pg";
import client from "./configs/db-config.js";
import * as eventController from './controllers/events-controller.js';
import * as userController from './controllers/users-controller.js';
import * as middlewares from './middlewares/autenticacion.js';

const { Client } = pkg;
const app = express();
const PORT = 3000;
client.connect();
app.use(cors());
app.use(express.json());

app.get('/api/event', eventController.manejarListarEventosPaginados); //2

app.get('/api/events', eventController.manejarBuscarEventos); //3

app.get('/api/event/:id', eventController.manejarObtenerEventoConDetalle); //4

app.post('/api/user/login', userController.manejarLogin); //5

app.post('/api/event', middlewares.autenticacionMiddleware, eventController.manejarCrearEvento);

app.put('/api/event', middlewares.autenticacionMiddleware, eventController.manejarActualizarEvento);

app.delete('/api/event/:id', middlewares.autenticacionMiddleware, eventController.manejarEliminarEvento);




app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});