const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//============MiddleWare=================
app.use(cors());
app.use(express.json());

//============MiddleWare=================

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
    //=================== HotelBookingCollection==============
    const hotelBookingCollection = client
      .db("hotelBooking")
      .collection("hotelCollection");
    //=====================RoomsCollection====================
    const roomsCollection = client
      .db("hotelBooking")
      .collection("RoomsCollection");

    // =============Featured Rooms=============
    app.get("/featuresRoom", async (req, res) => {
      const room = await hotelBookingCollection.find().toArray();
      res.send(room);
    });
    // ====================Rooms========================
    app.get("/rooms", async (req, res) => {
      const rooms = await roomsCollection.find().toArray();
      res.send(rooms);
    });

    // ===================SubCategory Room================
    app.get("/roomsDetails/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await roomsCollection.findOne(query);
      res.send(result);
    });

    //============post method=================
    app.post("/bookNow", async (req, res) => {
      const roomBooking = req.body;
      console.log(roomBooking);
      const result = await roomsCollection.insertOne(roomBooking);
      res.send(result);
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
