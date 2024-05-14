const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();
const port = process.env.PORT || 5000;

//============MiddleWare=================
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

//============MiddleWare=================
const logger = async (req, res, next) => {
  console.log("logger is running");
  next();
};

const verifyToken = async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).send({ message: "unauthorized access" });
  }
  jwt.verify(token, process.env.SECURE_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "unauthorized access" });
    }
    req.user = decoded;
    next();
  });
};
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
    //================== New Booking Collection=================
    const myHotelBooking = client
      .db("hotelBooking")
      .collection("bookingCollection");

    //=====================jwt json-Webtoken====================
    app.post("/jwt", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.SECURE_TOKEN, {
        expiresIn: "365d",
      });
      res
        .cookie("token", token, {
          httpOnly: true,
          sameSite: "strict",
          secure: false,
        })
        .send({ success: true });
    });
    //==========================LogOut===================
    app.post("/logout", async (req, res) => {
      const user = req.body;
      res.clearCookie("token", { maxAge: 0 }).send({ success: true });
    });

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
      const result = await myHotelBooking.insertOne(roomBooking);
      res.send(result);
    });
    //==================after post then get operation================
    app.get("/booking", async (req, res) => {
      const cursor = myHotelBooking.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    //=============================Email==================
    // logger, verifyToken,
    app.get("/booking_email/:email", async (req, res) => {
      const email = req.params.email;
      const query = { UserEmail: email };
      const result = await myHotelBooking.find(query).toArray();
      res.send(result);
    });

    //=================Update Review==================
    app.patch("/reviewUpdate/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const update = req.body;
      const updateReview = {
        $set: {
          reviews: update.reviews,
        },
      };
      const result = await roomsCollection.updateOne(
        query,
        updateReview,
        options
      );
      res.send(result);
    });

    //======================= AvailableRooms Update ================================
    app.patch("/availableRooms/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const update = req.body;
      const updateReview = {
        $set: {
          availability: update.availability,
        },
      };
      const result = await roomsCollection.updateOne(
        query,
        updateReview,
        options
      );
      res.send(result);
    });
    //===================Delete Operation===================
    app.delete("/booking/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await myHotelBooking.deleteOne(query);
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
