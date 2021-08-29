const express = require('express')
const app = express()
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser')
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

// From DotENV File
const port = process.env.PORT || 5555
const dbUsername = process.env.DB_USERNAME
const dbPassword = process.env.DB_PASSWORD
const dbName = process.env.DB_NAME
const dbColAllCalendar = process.env.DB_COL_ALL_CALENDAR
const dbColAllEvents = process.env.DB_COL_ALL_EVENTS

const dbUri = `mongodb+srv://${dbUsername}:${dbPassword}@cluster0.lq9rh.mongodb.net/${dbName}?retryWrites=true&w=majority`;

// Middle Ware
app.use(cors())
app.use(bodyParser.json())

const client = new MongoClient(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  // Get Error
  console.log('Connection error:', err);

  // Access to All Calendar Collection
  const allCalendarCollection = client.db(dbName).collection(dbColAllCalendar);
  const allEventsCollection = client.db(dbName).collection(dbColAllEvents);
  console.log(`Database Connected Successfully! The port is ${port}`);

  // Add Calendar API
  app.post('/addCalendar', (req, res) => {
    const newCalendar = req.body;
    allCalendarCollection.insertOne(newCalendar)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })

  // All Calendars List API
  app.get('/calendars', (req, res) => {
    allCalendarCollection.find({})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })

  // Add Events API
  app.post('/addEvents', (req, res) => {
    const newEvents = req.body;
    allEventsCollection.insertOne(newEvents)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })

  // Events by Calendar ID and Date
  app.get('/events', (req, res) => {
    const filter = { calendarId: req.query.calendar, eventDate: req.query.date }
    allEventsCollection.find(filter)
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  app.get('/', (req, res) => {
    res.send(`Example app listening at https://aqueous-oasis-85656.herokuapp.com:${port}`)
  })
});




app.listen(port)