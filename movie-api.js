const PORT = 3000
const express = require('express')
const cors = require('cors')
require('dotenv').config()
const envDb = `${process.env.dbName}`
const envCollection = `${process.env.dbCollectionName}`

const app = express()

app.use(cors())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.dbUserName}:${process.env.dbUserPass}@${process.env.dbClusterName}.${process.env.dbMongoId}.mongodb.net/${process.env.dbName}?retryWrites=true&w=majority`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
})


let movieList = ['Those Avengers', 'All Dogs Go To Heaven', 'The Aristocats', 'The Brave Little Toaster', 'The Lord of the Rings', 'The Revenant', 'Cats & Dogs'];

app.route('/all')
  .get(async (req, res) => {
    let error = null;
    let result = [];

      try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Connect to database cfa classwork, specifically the collection basic-api-movies
        const collection = client.db(envDb).collection(envCollection);
    
        // Interaction to pull movies from database collection
    
        result = await collection.find({}).toArray();

        console.log(result.map((value) => {
          return value.title;
        }));
    
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
      } catch (e){
          console.dir(e);
          error = e;
        }
       finally {
        // Ensures that the client will close when you finish/error
        await client.close();
      }
    
      if (error === null){
        res.json(result.map((value) => {
          return value.title;
        }));
      } else{
        res.status(500).send("failure");
      }
  })
  .delete(async (req, res) => {
    let result = [];
    let error = null;
    try {
      await client.connect();
      const collection = client.db(envDb).collection(envCollection);
      result = await collection.deleteMany({});
      console.log(result);
    } catch (e) {
      console.dir(e);
      error = e;
    } finally{
      await client.close();
    }

    if (error === null){
      res.sendStatus(200);
    } else{
      res.status(500).send("failure");
    }
  })

app.get('/find', async (req, res) => {
  let result = [];
  let error = null;
  if (req.query.hasOwnProperty('contains')){

    try {
      await client.connect();
      const collection = client.db(envDb).collection(envCollection);
  
      // result = await collection.find({
      //   title: {
      //     $regex: req.query.contains,
      //     $options: 'i'
      //   }
      // }).toArray();
  
      result = await collection.find({
        title: {
          $regex: new RegExp(req.query.contains, 'i')
        }
      }).toArray();
      console.log(result);
    } catch (e) {
      console.dir(e);
      error = e;
    } finally{
      await client.close();
    }
  } else if (req.query.hasOwnProperty('startsWith')){
    try {
      await client.connect();
      const collection = client.db(envDb).collection(envCollection);
      result = await collection.find({
        title: {
          $regex: new RegExp(req.query.startsWith, 'i')
        }
      }).toArray();
    } catch (e) {
      console.dir(e);
      error = e;
    } finally{
      await client.close();
    }
  }

  if (error === null){
    res.json(result.map((value) => {
      return value.title;
    }))
  } else{
    res.status(500).send("failure");
  }
})

app.route('/insert')
  .post(async (req, res) =>{
    let error = null;
    let result = [];
    try {
      await client.connect();
      const collection = client.db(envDb).collection(envCollection);

      insertList = [
        { "title": "The Avengers" },
        { "title": "All Dogs Go To Heaven" },
        { "title": "The Aristocats" },
        { "title": "The Brave Little Toaster" },
        { "title": "The Lord of the Rings" },
        { "title": "The Revenant" },
        { "title": "Cats & Dogs" }
    ]
      result = await collection.insertMany(insertList);
      console.log(result);

    } catch (e) {
      console.dir(e);
      error = e;
    } finally{
      await client.close();
    }

    if (error === null){
        res.sendStatus(200);      
        } else{
      res.status(500).send("failure");
    }

  })

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
