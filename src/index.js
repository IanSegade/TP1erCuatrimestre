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




app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// SELECT 
//   events.*, 
//   users.id AS user_id, users.first_name, users.last_name, users.username, 
//   event_locations.id AS event_location_id, event_locations.name AS event_location_name,
//   event_locations.full_address,  -- <--- USÁ ESTE NOMBRE
//   event_locations.max_capacity, 
//   event_locations.latitude AS event_location_latitude, 
//   event_locations.longitude AS event_location_longitude
// FROM events
// JOIN users ON users.id = events.id_creator_user
// JOIN event_locations ON event_locations.id = events.id_event_location
// ORDER BY events.start_date DESC
// LIMIT 100
