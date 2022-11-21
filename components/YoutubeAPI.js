var fetch = require("node-fetch");

class YoutubeAPI {
  constructor() {
    this.apiKEY = "AIzaSyAeivme_yi0vF8jR0pkvwcFRBJXP1vhsII";
    this.resultsPerPage = 25;
    this.filters = `type=video&part=snippet&maxResults=${this.resultsPerPage}&safeSearch=strict&videoLicense=creativeCommon`;
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
