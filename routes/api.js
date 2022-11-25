var express = require("express");
var router = express.Router();
var mysql = require("mysql");
var config = require("../bin/config.json");
var connection = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
});
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
        res.send(JSON.stringify({ song: song }));
      } else {
        res.send(JSON.stringify({ error: 1 }));
      }
    }
  });
});

router.post("/sended", function (req, res, next) {
  let videoId = req.body.videoId;
  connection.query(
    `SELECT idSong FROM songs WHERE idSong = '${videoId}'`,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        if (result[0]) {
          res.send(
            JSON.stringify({
              inserted: "Esta canción ya existe en nuestra BD.",
            })
          );
        } else {
          connection.query(
            `INSERT INTO songs(idSong) VALUES ('${videoId}')`,
            (err, result) => {
              if (err) {
                console.log(err);
              } else {
                res.send(
                  JSON.stringify({
                    inserted: "Se ha insertado correctamente.",
                  })
                );
              }
            }
          );
        }
      }
    }
  );
});

module.exports = router;
