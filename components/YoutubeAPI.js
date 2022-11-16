var fetch = require("node-fetch");

class YoutubeAPI {
  constructor() {
    this.apiKEY = "AIzaSyAeivme_yi0vF8jR0pkvwcFRBJXP1vhsII";
    this.resultsPerPage = 4;
  }

  async getSongs(title) {
    const url = `https://www.googleapis.com/youtube/v3/search?key=${this.apiKEY}&type=video&part=snippet&q=${title}&maxResults=${this.resultsPerPage}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);

    return data;
  }
}

module.exports = YoutubeAPI;
