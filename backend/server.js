// server/server.js
require("dotenv").config(); // Load environment variables from .env
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const setupDb = require("./src/config/db-helper");
const auth = require("./src/routes/auth.routes");
const authRoutes = require('./src/routes/auth.routes'); 

const { generateItinerary } = require("./openaiService");
const app = express();
app.use(cors());
app.use(express.json());

// USING RECPATCHA FOR MITIGATING DDOS ATTACK
const secretKey = process.env.RECAPTCHA_SECRET_KEY;

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "tripmatic",
});

app.use(express.json());
setupDb();

app.use(auth);
//app.use('/auth', authRoutes);

//console.log(auth.JWT_SECRET);
//console.log(auth.recaptcha.siteKey);

// Route to generate travel itineraries using OpenAI
app.post("/generate-itinerary", async (req, res) => {
  const { destination, startDate, endDate, travelerType, budget, activities } =
    req.body;

  console.log("Received request:", {
    destination,
    startDate,
    endDate,
    travelerType,
    budget,
    activities,
  });

  try {
    // Use the openaiService function to generate the itinerary
    const itinerary = await generateItinerary(
      destination,
      startDate,
      endDate,
      travelerType,
      budget,
      activities
    );

    console.log("Generated Itinerary:", itinerary);
    return res.json({ itinerary });
  } catch (error) {
    console.error("Error generating itinerary:", error);
    return res.status(500).json({ error: "Failed to generate itinerary" });
  }
});

app.listen(8081, () => {
  console.log(`listening PORT 8081`);
});
