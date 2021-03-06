const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const router = express.Router();
const axios = require('axios');

const MESSAGE_MICROSERVICE_URL = process.env.MESSAGE_MICROSERVICE_URL ? process.env.MESSAGE_MICROSERVICE_URL + '/messages' : 'http://localhost:3335/messages';

router.get('/history/:topicId', async (req, res, next) => {
  try {
    const results = await axios.get(`${MESSAGE_MICROSERVICE_URL}/history/${req.params.topicId}`);
    return res.json(results.data);
  } catch (e) {
    res.sendStatus(400);
  }
});

module.exports = router;
