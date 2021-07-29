require('dotenv').config();
const express = require('express');
const mongodb = require('mongodb');

const router = express.Router();
const uri = process.env.MONGO_URI;
var MongoClient = mongodb.MongoClient;

// Get Posts
router.get('/', async (req, res) => {
  await loadPostsCollection(function (dbCollection) {
    dbCollection.find({}).toArray(function (err, result) {
      res.send(result);
    });
  });
});

// Add Post
router.post('/', async (req, res) => {
  await loadPostsCollection(function (dbCollection) {
    dbCollection.insertOne({
      text: req.body.text,
      createdAt: new Date()
    });
  });
  res.status(201).send();
});

// Edit Post
router.put('/:id', async (req, res) => {
  await loadPostsCollection(function (dbCollection) {
    try {
      dbCollection.updateOne(
        { _id: new mongodb.ObjectId(req.params.id) },
        {
          $set: {
            "text": req.body.text
          }
        }
      );
      res.status(200).send();
    } catch (err) {
      res.status(400).send();
    }
  });
});

// Delete Post
router.delete('/:id', async (req, res) => {
  await loadPostsCollection(function (dbCollection) {
    dbCollection.deleteOne({ _id: new mongodb.ObjectId(req.params.id) });
    res.status(200).send();
  });
});

async function loadPostsCollection(
  successCallback) {
  mongodb.MongoClient.connect(uri, function (err, dbInstance) {
    const dbObject = dbInstance.db('vue-express');
    const dbCollection = dbObject.collection('posts');
    console.log("[MongoDB connection] SUCCESS");
    successCallback(dbCollection);
  });
}

module.exports = router;