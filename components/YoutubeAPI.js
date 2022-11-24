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

  sendSong(videoId, user) {}
}

module.exports = YoutubeAPI;
