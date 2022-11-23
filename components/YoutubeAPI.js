var fetch = require("node-fetch");
var mysql = require("mysql");
var config = require("../bin/config.json");
class YoutubeAPI {
  constructor() {
    this.apiKEY = "AIzaSyAeivme_yi0vF8jR0pkvwcFRBJXP1vhsII";
    this.resultsPerPage = 25;
    // videoLicense=creativeCommon para que no salgan canciones con copy
    this.filters = `type=video&part=snippet&maxResults=${this.resultsPerPage}&safeSearch=strict&videoLicense=youtube`;
    this.connection = mysql.createConnection({
      host: config.host,
      user: config.user,
      password: config.password,
      database: config.database,
    });
    this.horas = [
      "15:00",
      "16:00",
      "17:00",
      "18:00",
      "18:20",
      "19:20",
      "20:20",
      "21:20",
    ];
  }

  async getSongs(title) {
    const url = `https://www.googleapis.com/youtube/v3/search?key=${this.apiKEY}&q=${title}&${this.filters}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);

    return data;
  }

  sendSong(videoId, user) {
    let finded = 0;
    let today;
    this.connection.query(
      `SELECT COUNT(idSong) as contador FROM songs WHERE idSong = '${videoId}'`,
      (err, count, fields) => {
        if (err) {
          console.log(err);
        } else {
          // Si la canción existe en la BD
          if (count[0].contador > 0) {
            // Hacemos update de la fecha de la canción a una que esté libre
            for (let i = 0; i <= 5; i++) {
              let today = new Date().setDate(new Date() + i);
              this.horas.forEach((hora) => {
                this.connection.query(
                  `SELECT COUNT(idSong) as contador FROM songs WHERE (date-repro = '${
                    today.toISOString().split("T")[0]
                  }' AND hour-repro = '${hora}')`,
                  (err, dispo, fields) => {
                    if (err) {
                      return { updated: "error" };
                    } else {
                      // Si no hay ningúna canción a ese dia y hora, actualizamos la canción a ese dia y hora.
                      if (dispo[0].contador == 0) {
                        this.connection.query(
                          `UPDATE songs SET date-repro = '${
                            today.toISOString().split("T")[0]
                          }', hour-repro = '${hora}' WHERE idSong = '${videoId}'`,
                          (err, updated, fields) => {
                            if (err) {
                              return { updated: "error" };
                            } else {
                              finded = {
                                value: 1,
                                dateRepro: today.toISOString().split("T")[0],
                                hourRepro: hora,
                              };
                            }
                          }
                        );
                      }
                    }
                  }
                );
              });
            }
          } else {
            for (let i = 0; i <= 5; i++) {
              let today = new Date().setDate(new Date() + i);
              this.horas.forEach((hora) => {
                this.connection.query(
                  `SELECT COUNT(idSong) as contador FROM songs WHERE (date-repro = '${
                    today.toISOString().split("T")[0]
                  }' AND hour-repro = '${hora}')`,
                  (err, dispo, fields) => {
                    if (err) {
                      return { updated: "error" };
                    } else {
                      // Si no hay ningúna canción a ese dia y hora, actualizamos la canción a ese dia y hora.
                      if (dispo[0].contador == 0) {
                        this.connection.query(
                          `INSERT INTO songs(idSong, user, date-repro, hour-repro) VALUES('${videoId}', '${user}', '${
                            today.toISOString().split("T")[0]
                          }', hour-repro = '${hora}')`,
                          (err, inserted, fields) => {
                            if (err) {
                              return { updated: "error" };
                            } else {
                              if (inserted.insertId) {
                                finded = {
                                  value: 1,
                                  dateRepro: today.toISOString().split("T")[0],
                                  hourRepro: hora,
                                };
                              }
                            }
                          }
                        );
                      }
                    }
                  }
                );
              });
            }
          }
          if (finded.value == 1) {
            return {
              updated: "ok",
              dateRepro: finded.dateRepro,
              hourRepro: finded.hourRepro,
            };
          } else {
            return {
              updated: "no-data",
            };
          }
        }
      }
    );
  }
}

module.exports = YoutubeAPI;
