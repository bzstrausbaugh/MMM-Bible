var NodeHelper = require('node_helper');
var undici = require('undici');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

module.exports = NodeHelper.create({
  start: function () {
    console.log('MMM-Bible helper, started...');
  },

  getDailyVerse: function () {
    var _this = this;
    undici
      .request(`https://www.biblegateway.com`, {
        method: 'GET',
      })
      .then((verseResponse) =>
        verseResponse.statusCode < 300 ? verseResponse.body : ''
      )
      .then((verseBody) => verseBody.text())
      .then((pageContent) => {
        const dom = new JSDOM(pageContent);
        const document = dom.window.document;
        const citation =
          document.getElementsByClassName('citation')[0].textContent;
        const verse = document.getElementById('verse-text').textContent;
        _this.sendSocketNotification('GOT_TODAYS_BIBLE_VERSE', {
          citation: citation,
          verse: verse,
        });
      })
      .catch((error) => console.error('Error', error));
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === 'GET_TODAYS_BIBLE_VERSE') {
      this.getDailyVerse();
    }
  },
});
