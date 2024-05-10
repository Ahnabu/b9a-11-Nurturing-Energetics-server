
const express = require('express');
const cors = require('cors')
require('dotenv').config();
const app = express()
const port = 5000
app.use(express())
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://a11-nurturing-energetics.web.app",
            "https://a11-nurturing-energetics.firebaseapp.com",
        ],
        credentials: true,
    })
);


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cn1yph8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    // Connect to the MongoDB cluster
   
    try {
        const restaurantDB = client.db('restaurantCollection').collection('allFoods')
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        app.get('/', (req, res) => {
            res.send('Hello World!')
        })
        app.get('/all',async (req, res) => {
            const result = await restaurantDB.find().toArray();
            res.send(result)
        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
   
    }
}
run().catch(console.dir);
