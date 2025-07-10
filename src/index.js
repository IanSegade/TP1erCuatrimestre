import express from "express";
import cors from "cors";
import pkg, {Pool} from "pg";
import client from "./configs/db-config.js";

const { Client } = pkg;
const app = express();
const PORT = 3000;
client.connect();
app.use(cors());
app.use(express.json());

app.get("/prueba", async (req, res) => {
  const response = await client.query('SELECT * from pruebaa()');
  res.send(response.rows);
});


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
