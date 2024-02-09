const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6hyeg.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();
    const donationCollection = client.db("Donation").collection("donations");

    // All Donations
    app.get("/donations", async (req, res) => {
      const query = {};
      const donations = await donationCollection.find(query).toArray();
      res.send(donations);
    });

    // A Single donations
    app.get("/donations/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const donation = await donationCollection.findOne(query);
      res.send(donation);
    });
    // Post a donations
    app.post("/donation", async (req, res) => {
      const donations = req.body;
      const result = await donationCollection.insertOne(donations);
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Cam-sec server successfully running");
});

app.listen(port, () => {
  console.log("Server running on", port);
});
