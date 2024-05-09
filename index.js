const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

//============MiddleWare=================
app.use(cors());
app.use(express.json());

//============MiddleWare=================

app.get("/", (req, res) => {
  res.send("Hotel Booking is running on website");
});

app.listen(port, () => {
  console.log(`Hotel Booking web-site is running on Port:${port}`);
});
