var express = require("express");
var router = express.Router();
var YoutubeAPI = require("../components/YoutubeAPI.js");

/* GET home page. */
router.post("/search", async function (req, res, next) {
  let youtubeAPI = new YoutubeAPI();
  let object = await youtubeAPI.getSongs(req.body.song);
  let songs = await object.items;
  req.sessionStore.set("songs", await songs, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.send(JSON.stringify(songs));
    }
  });
});

router.post("/selected", function (req, res, next) {
  let song = req.body.song;
  req.sessionStore.get("songs", (err, session) => {
    if (err) {
      console.log(err);
    } else {
      let finded = 0;
      session.forEach((songSession) => {
        let idSongSession = songSession.id.videoId;
        if (idSongSession == song) {
          finded = 1;
          return;
        }
      });
      if (finded == 1) {
      } else {
        res.send(JSON.stringify({ error: 1 }));
      }
    }
  });
});

module.exports = router;
