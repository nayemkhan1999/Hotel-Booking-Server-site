const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//============MiddleWare=================
app.use(cors());
app.use(express.json());

//============MiddleWare=================

//User: hotelBooking
//Pass: aPieM0K7B3oTMV7k

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.l4sutcp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    const hotelBookingCollection = client
      .db("hotelBooking")
      .collection("hotelCollection");

    // =============Featured Rooms=============
    app.get("/featuresRoom", async (req, res) => {
      const room = await hotelBookingCollection.find().toArray();
      res.send(room);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hotel Booking is running on website");
});

app.listen(port, () => {
  console.log(`Hotel Booking web-site is running on Port:${port}`);
});
