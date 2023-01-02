const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const reviewCollection = client.db("arkFoodies").collection("reviews");
        
        //post reviews
        app.post("/review", async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            console.log(result);
            res.send(result);
            
        })

        //update review
        app.patch("/review/:id", async (req, res) => {
            const id = req.params.id;
            
            const reviewText = req.body.reviewText;
            const rating  = req.body.rating;
            console.log({ id, reviewText, rating });
            const filter = {
                _id : ObjectId(id)
            }
            const updateReview = {
                $set: {
                    reviewText: reviewText,
                    rating: rating
               }
            }
            const options = { upsert: true };

            const result = await reviewCollection.updateOne(filter,updateReview,options);
            res.send(result);
        })

        //get reviews by recipe id
        app.get("/review/:id", async (req, res) => {
            const id = req.params.id;
            const query = {
                recipeID: id
            };
            const cursor = reviewCollection.find(query);
            const result = await cursor.toArray();
           res.send(result);
        })

       
       

        //get reviews for specific user
        app.get("/reviews", async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    reviewerEmail: req.query.email
                };
            }
            const cursor = reviewCollection.find(query);
            const result = await cursor.toArray();
            console.log(result);
            res.send(result);
        })
        
        //delete review
        app.delete("/reviews/:id", async (req, res) => {
            const id = req.params.id;
            const filter = {
                _id: ObjectId(id)
            }
            const result = await reviewCollection.deleteOne(filter);
            res.send(result);
            console.log(result)
        })

        //load on homepage
        app.get('/recipeslimit', async (req, res) => {
            const query = {};
            const cursor = recipeCollection.find(query);
            const recipes = await cursor.limit(3).toArray();
            res.send(recipes);
        })

        //load on recipes page
        app.get("/recipes", async (req, res) => {
            const query = {};
            const cursor = recipeCollection.find(query);
            const recipes = await cursor.toArray();
            res.send(recipes);
        })

        //load specific recipe
        app.get("/recipe/:id", async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: ObjectId(id)
            };
            const recipe = await recipeCollection.findOne(query);
            res.send({recipe});
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