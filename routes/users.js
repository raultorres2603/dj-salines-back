const { json } = require("express");
var express = require("express");
var router = express.Router();
var config = require("../bin/config.json");
var mysql = require("mysql");
var connection = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
});

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/create", (req, res, next) => {
  connection.query(
    `SELECT idUser FROM users WHERE username = '${req.body.username}'`,
    (error, user, fields) => {
      if (error) {
        res.send(JSON.stringify({ error: 1 }));
      } else {
        if (user.length > 0) {
          connection.query(
            `SELECT idUser FROM users WHERE username = '${req.body.username}' AND password = '${req.body.password}'`,
            (err, idUser, fields) => {
              if (err) {
                res.send(JSON.stringify({ error: 2 }));
              } else {
                if (idUser.length > 0) {
                  req.sessionStore.set("user", idUser[0].idUser);
                  res.send(JSON.stringify({ idUser: idUser[0].idUser }));
                } else {
                  res.send(JSON.stringify({ error: 3 }));
                }
              }
            }
          );
        } else {
          connection.query(
            `INSERT INTO users(username, password) VALUES('${req.body.username}', '${req.body.password}')`,
            (err, insert, fields) => {
              if (err) {
                res.send(JSON.stringify({ error: 4 }));
              } else {
                req.sessionStore.set("user", insert.insertId);
                res.send(JSON.stringify({ idUser: insert.insertId }));
              }
            }
          );
        }
      }
    }
  );
});

module.exports = router;
