
const express = require('express');
const cors = require('cors')
require('dotenv').config();
const jwt = require('jsonwebtoken');
const cookie = require('cookie-parser')
const app = express()
const port = 5000
app.use(express.json())
app.use(cookie())
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
// jwt middleware
const verify = (req, res, next) => {
    const token = req.cookies?.token;
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
            if (err) {
                res.status(403).json({ message: 'Invalid token' });
            } else {
                req.user = decodedToken;
                next();
            }
        });
    } else {
        res.status(401).json({ message: 'No token, authorization denied' });
    }
}

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
        app.get('/top',async (req, res) => {
            const result = await restaurantDB.find().toArray();
            res.send(result)
        })

        // jwt 
        app.post('/jwt', async (req, res) => {
            const email = req.body;
            const token = jwt.sign(email, process.env.SECRET_KEY, { expiresIn: '10d' })
            console.log(email);
            res
                .cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
                })
                .send({success : true})
        })

        app.post("/logout", async (req, res) => {
            const user = req.body;
            console.log("logging out", user);
            res
                .clearCookie("token", { ...cookieOptions, maxAge: 0 })
                .send({ success: true });
        });
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
   
    }
}
run().catch(console.dir);