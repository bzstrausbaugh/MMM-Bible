function updateVerse(payload) {
  document.getElementById('verse-reference').innerText = payload.citation;
  document.getElementById('verse').innerText = payload.verse;
}

Module.register('MMM-Bible', {
  start: function () {
    Log.log('Starting module: ' + this.name);

    this.day = dayjs();
    this.nextDay = this.day.add(1, 'day').startOf('day').add(1, 'hours'); // One am tomorrow
    // Trigger the first request
    this.getTodaysBibleVerse(this);
  },

  getTodaysBibleVerse: function (_this) {
    // Make the initial request to the helper then set up the timer to perform the updates
    _this.sendSocketNotification('GET_TODAYS_BIBLE_VERSE', {});

    setTimeout(_this.getTodaysBibleVerse, _this.nextDay.diff(this.day), _this);
  },

  getScripts: function () {
    return ['dayjs.js'];
  },

  getStyles: function () {
    return ['MMM-Bible.css'];
  },

  getDom: function () {
    const wrapper = document.createElement('div');
    wrapper.id = 'verse-wrapper';
    wrapper.innerHTML = `<div id="verse-reference"></div><div id="verse"></div>`;
    return wrapper;
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === 'GOT_TODAYS_BIBLE_VERSE') {
      if (payload) {
        updateVerse(payload);
      }
    }
  },
});
