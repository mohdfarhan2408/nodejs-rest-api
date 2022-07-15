const express = require('express')
const router = express.Router() //we want to use the router of the express
const Subscriber = require('../models/subscriber')

// Getting all
router.get('/', async (req, res) => {
    try {
      const subscribers = await Subscriber.find()
      res.json(subscribers)
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  })
  
  // Getting One
  router.get('/:id', getSubscriber, (req, res) => {
    res.json(res.subscriber); //subscriber = user with the ids
  })


// Creating one
router.post('/', async (req, res) => {
    const subscriber = new Subscriber({ //new obj
      name: req.body.name,
      subscribedToChannel: req.body.subscribedToChannel
    })

    try {
      const newSubscriber = await subscriber.save() //save to db
      res.status(201).json(newSubscriber)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  })


// Updating One
router.patch('/:id', getSubscriber, async (req, res) => {
    if (req.body.name != null) { //check if there's a request to update from users,
      res.subscriber.name = req.body.name // if yes then set the res.subscriber.name similar to it's request.
    }
    if (req.body.subscribedToChannel != null) {
      res.subscriber.subscribedToChannel = req.body.subscribedToChannel
    }
    
    try {
      const updatedSubscriber = await res.subscriber.save() //save into db
      res.json(updatedSubscriber)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  })


// Deleting One
router.delete('/:id', getSubscriber, async (req, res) => {
    try {
      await res.subscriber.remove()
      res.json({ message: 'Deleted Subscriber' })
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  })
  

//middleware, get the sub by their id
async function getSubscriber(req, res, next) {
    let subscriber;
    try {
      subscriber = await Subscriber.findById(req.params.id) //findbyid is a mongoose syntax
      if (subscriber == null) {
        return res.status(404).json({ message: 'Cannot find subscriber' }) // reason use RETURN is because if  no subs, we want immediately leave the fx
      }
    } catch (err) {
      return res.status(500).json({ message: err.message })
    }
    
    // return all data for users that have an id.
    res.subscriber = subscriber // pass this to all /:id route.
    next()
  }
  
  module.exports = router