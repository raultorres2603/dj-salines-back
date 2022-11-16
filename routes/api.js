var express = require("express");
var router = express.Router();
var YoutubeAPI = require("../components/YoutubeAPI.js");

/* GET home page. */
router.post("/search", async function (req, res, next) {
  let youtubeAPI = new YoutubeAPI();
  let object = await youtubeAPI.getSongs(req.body.song);
  let songs = await object.items;
  res.send(JSON.stringify(songs));
});

module.exports = router;
