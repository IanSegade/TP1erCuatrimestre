import express from "express";
import cors from "cors";
// import config from "./config/db-config.js";
import pkg, {Pool} from "pg";
import multer from "multer";
import client from "./documents/database/client.js";
// import publicacionRoutes from './routes/publicacionRoutes.js';

const { Client } = pkg;
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/api/prueba", async (req, res) => {
  try {
    // Llamamos a la función prueba que devuelve JSON
    const { rows } = await client.query("SELECT * from pruebaa()");
    // rows[0].resultado es el JSON que devuelve la función
    res.json(rows.resultado);
  } catch (error) {
    console.error("Error ejecutando la función prueba", error);
    res.status(500).json({ error: "Error ejecutando la función prueba" });
  }
});



app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
