const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5001;
require("dotenv").config();

//middle wares
app.use(cors());
app.use(express.json());

//mongodb database 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rtntsud.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const recipeCollection = client.db("arkFoodies").collection("recipes");

        app.get("/recipes", async (req, res) => {
            const query = {};
            const cursor = recipeCollection.find(query);
            const recipes = await cursor.toArray();
            console.log(recipes);
            res.send(recipes);
        })
    }
    finally {
        
    }
}
run().catch(err => console.log(err))



app.get('/', (req, res) => {
    res.send("ARK FOOD server running")
})

app.listen(port, () => {
    console.log("ARK FOOD server listening on port",port)
})