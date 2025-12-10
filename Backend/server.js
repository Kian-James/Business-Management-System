import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import axios from "axios";

// CONFIG ENV
dotenv.config();

// OBJECTS
const app = express();

// VIEWABLE API FOR RUNNING SERVER SIDE
app.get("/", (req, res) => {
  res.send("<h1>Business-Management-System</h1>");
});

// MIDDLEWARES
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.options("*", cors);
app.use(express.json());
app.use(morgan("dev"));

// Keeps Server Online
function reloadWebsite() {
  axios
    .get(process.env.URL)
    .then((response) => {
      console.log(
        `Reloaded at ${new Date().toISOString()}: Status Code ${
          response.status
        }`
      );
    })
    .catch((error) => {
      console.error(
        `Error reloading at ${new Date().toISOString()}:`,
        error.message
      );
    });
}

// RUN LISTEN
app.listen(PORT, () => {
  console.log(
    `Server is running on ${process.env.DEV_MODE} mode on port ${process.env.PORT}`
      .bgWhite.black
  );
  setInterval(reloadWebsite, Number(process.env.SERVER_INTERVAL));
});
