const PORT = 3000
const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://cfastudentuser:dbsecpw4CFA@cluster0.j3uu4xc.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


let movieList = ['Those Avengers', 'All Dogs Go To Heaven', 'The Aristocats', 'The Brave Little Toaster', 'The Lord of the Rings', 'The Revenant', 'Cats & Dogs'];

app.route('/all')
  .get(async (req, res) => {
    let error = null;
    let result = [];

      try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Connect to database cfa classwork, specifically the collection basic-api-movies
        const collection = client.db("cfa-classwork").collection("basic-api-movies");
    
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
  .delete((req, res) => {
    movieList = [];
    res.sendStatus(200)
  })

app.get('/find', (req, res) => {
  if (req.query.hasOwnProperty('contains')) {
    res.json(movieList.filter((title) => title.toLowerCase().indexOf(req.query.contains.toLowerCase()) > -1))
  }
  else if (req.query.hasOwnProperty('startsWith')) {
    res.json(movieList.filter((title) => title.toLowerCase().indexOf(req.query.startsWith.toLowerCase()) === 0))
  }
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
