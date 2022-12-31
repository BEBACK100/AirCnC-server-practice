const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

// middlewares
app.use(cors())
app.use(express.json())

// Database Connection


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vczq7iu.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log(uri);


async function run() {
  try {
    const homesCollection = client.db('AirCnC').collection('homes')
    const usersCollection = client.db('AirCnC').collection('users')
    const bookingsCollection = client.db('AirCnC').collection('bookings')

    // const user = {
    //   name: "Test-System",
    //   email: "test@gamil.com"
    // }
    // const result = await usersCollection.insertOne(user)
    // console.log(result)
    // save user email and generate jwt

    app.put('/user/:email', async (req, res) => {
      const email = req.params.email
      const user = req.body
      const filter = { email: email }
      const options = { upsert: true }
      const updateDoc = {
        $set: user
      }
      const result = await usersCollection.updateOne(filter, options, updateDoc)
      console.log(result)
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: 'id',
      })
      console.log(token)
      res.send({ result, token })
    })
    // app.put('/user/:email', async (req, res) => {
    //   const email = req.params.email
    //   const user = req.body
    //   const filter = { email: email }
    //   const options = { upsert: true }
    //   const updateDoc = {
    //     $set: user
    //   }
    //   const result = await usersCollection.updateOne(filter, options, updateDoc)
    //   console.log(result);
    //   const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    //     expiresIn: '1d',
    //   })
    //   console.log(token)
    //   res.send({ result, token })
    // })


    app.post('/bookings', async (req, res) => {
      const bookingData = req.body
      const result = await bookingsCollection.insertOne(bookingData)
      console.log(result)
      res.send(result)

    })

    console.log('Database Connected...')
  }
  finally {
  }
}

run().catch(err => console.error(err))

app.get('/', (req, res) => {
  res.send('Server is running...for airCnC')
})

app.listen(port, () => {
  console.log(`Server is running...on ${port}`)
})
