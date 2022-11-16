var express = require("express");
var router = express.Router();
var YoutubeAPI = require("../components/YoutubeAPI.js");

/* GET home page. */
router.post("/search", async function (req, res, next) {
  let youtubeAPI = new YoutubeAPI();
  let object = await youtubeAPI.getSongs(req.body.song);
  let songs = await object.items;
  req.cookies.songs = songs;
  res.send(JSON.stringify(songs));
});

router.post("/selected", function (req, res, next) {
  let songs = req.cookies.songs;
  res.send(JSON.stringify(songs));
});

module.exports = router;
