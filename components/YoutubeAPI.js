var fetch = require("node-fetch");
class YoutubeAPI {
  constructor() {
    this.apiKEY = "AIzaSyAeivme_yi0vF8jR0pkvwcFRBJXP1vhsII";
    this.resultsPerPage = 5;
    // videoLicense=creativeCommon para que no salgan canciones con copy, videoLicense=youtube
    this.filters = `type=video&part=snippet&maxResults=${this.resultsPerPage}&videoLicense=youtube&videoCategoryId=10`;
  }

  async getSongs(title) {
    const url = `https://www.googleapis.com/youtube/v3/search?key=${this.apiKEY}&q=${title}&${this.filters}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);

    return data;
  }
}

module.exports = YoutubeAPI;
