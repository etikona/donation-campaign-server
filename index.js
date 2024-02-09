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
    const userCollection = client.db("Donation").collection("users");

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

    // Update Donation
    app.patch("/donations/:id", async (req, res) => {
      const id = req.params.id;
      const status = req.body.status;
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          status: status,
        },
      };
      const result = await donationCollection.updateOne(query, updateDoc);
      res.send(result);

      // User Collection
      //   Get all user data from database
      app.get("/users", async (req, res) => {
        const query = {};
        const users = await userCollection.find(query).toArray();
        res.send(users);
      });
      //  Get user  by id
      app.get("/users/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const user = await userCollection.findOne(query);
        res.send(user);
      });

      //  Creating Admin hook
      app.get("/users/admin/:email", async (req, res) => {
        const email = req.params.email;
        const query = { email };
        const user = await userCollection.findOne(query);
        res.send({ isAdmin: user?.role === "admin" });
      });
      //  Store user data
      app.post("/users", async (req, res) => {
        const user = req.body;
        const result = await userCollection.insertOne(user);
        res.send(result);
      });
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
