// ==UserScript==
// @name           Youtube Multi
// @version        0.5
// @description    Adds additional Youtube subtitles
// @match          https://www.youtube.com/*
// @grant          none
// @run-at         document-end
// ==/UserScript==

(function () {
  const langHead = 'youtube-multi-lang';

  function bookmarkletFunction(langHead, optionalTag) {

    function tag(name) {
      return function (classes, parent, insertBefore) {
        let el = parent.querySelector(classes);
        if (!el) {
          el = document.createElement(name);
          el.classList.add(...classes.split('.').filter(c => c));
          parent.insertBefore(el, insertBefore);
        }
        return el;
      }
    }

    if (optionalTag) return tag(optionalTag);

    const videoPlayer = document.querySelector('#movie_player');
    const playerClasses = videoPlayer.classList;

    function getVideoId() {
      return videoPlayer.getVideoData()['video_id'];
    }

    const multiLangButton = document.querySelector('a.ytp-subtitles-button.ytp-button');

    if (!window.youtubeMultiLangCaptions) window.youtubeMultiLangCaptions = new Map();
    const youtubeCaps = window.youtubeMultiLangCaptions;

    if (window.youtubeMultiLangCaptionsIntervalCode) {
      clearInterval(window.youtubeMultiLangCaptionsIntervalCode);
      window.youtubeMultiLangCaptionsIntervalCode = '';

      playerClasses.remove(langHead);
      multiLangButton.setAttribute('aria-pressed', 'false');
      return;
    }

    const div = tag('div');
    const label = tag('label');

    const caps = div('.caption-window.ytp-caption-window-bottom.' + langHead, videoPlayer);

    const controls = document.querySelector('.ytp-left-controls');

    class subtitles {
      loaded = false;
      lines = [];
      constructor(url, lang, moreThan1Subs) {
        this.url = url;
        this.lang = lang;

        this.checkbox = label(`.${langHead}-checkbox.${langHead}${lang}.${langHead}-watch${getVideoId()}`, controls);
        const split = lang.split('.');
        const auto = split[0] == 'a';
        this.checkbox.innerHTML = `<input type=checkbox ${auto && moreThan1Subs ? '' : 'checked=checked'}></input>${split[1]}${auto ? ' (auto)' : ''}`;
      }

      showHideCheckbox(visibility) {
        this.checkbox.style = visibility ? '' : 'display:none';
      }

      isChecked() {
        return this.checkbox.querySelector('input').checked;
      }

      loadIfNeeded() {
        if (this.loaded) return;
        this.loaded = true;
        const lines = this.lines;
        fetch(this.url).then(r => r.text()).then(t =>
          new DOMParser().parseFromString(t.replace(/&amp;/g, '&'), 'text/xml').querySelectorAll('text').forEach(l => {
            const start = l.getAttribute('start') - 0;
            if (lines.length) {
              const prevSub = lines[lines.length - 1];
              if (prevSub.start == prevSub.end)
                prevSub.end = start;
            }
            if (l.innerHTML.trim().length)
              lines.push({ start, end: l.getAttribute('dur') - 0 + start, html: l.innerHTML, index: lines.length });
          }))
      }
    }

    function fillSubAndCheckboxes() {
      const videoId = getVideoId();

      if (youtubeCaps.has(videoId)) return;

      const subs = new Map();
      youtubeCaps.set(videoId, subs);

      const captionTracks = videoPlayer.getPlayerResponse()?.captions?.playerCaptionsTracklistRenderer?.captionTracks || [];

      captionTracks.forEach(({ baseUrl, vssId }) => {
        if (!subs.has(vssId))
          subs.set(vssId, new subtitles(baseUrl, vssId, captionTracks.length > 1));
      });
    }

    if (!videoPlayer.stateChangeListenerAdded) {
      videoPlayer.stateChangeListenerAdded = true;
      videoPlayer.addEventListener('onStateChange', function (e) {
        if (e == -1) {
          fillSubAndCheckboxes();

          caps.innerHTML = '';

          const videoId = getVideoId();
          youtubeCaps.forEach((allSubs, vId) => allSubs.forEach(sub => sub.showHideCheckbox(vId == videoId)));
        }
      });
    }

    fillSubAndCheckboxes();
    window.youtubeMultiLangCaptionsIntervalCode = setInterval(() => {

      const subs = youtubeCaps.get(getVideoId());

      const lines = div('.captions-text', caps);

      if (subs) subs.forEach((sub, langIndex) => {
        const langClass = '.' + langHead + langIndex;
        const lineContainer = div(langClass + "-line-container", lines);

        const oldLines = new Set([...lines.querySelectorAll(langClass)].map(l => l.dataset.line - 0));

        const curTime = videoPlayer.getCurrentTime();

        if (sub.isChecked()) {
          sub.loadIfNeeded();
          sub.lines.forEach(({ start, end, html, index }) => {
            if (start <= curTime && curTime < end)
              if (!oldLines.delete(index)) {
                const newLine = div(`.caption-visual-line${langClass}${langClass}-line${index}`, lineContainer);
                newLine.dataset.line = index;
                div('.ytp-caption-segment', newLine).innerHTML = html;
              }
          })
        }

        if (oldLines.size) lines.querySelectorAll([...oldLines].map(l => `${langClass}-line${l}`).join(',')).forEach(n => n.remove());
      })
    }, 100);

    playerClasses.add(langHead);
    multiLangButton.setAttribute('aria-pressed', 'true');
  }

  const bookmarkletAddress = `javascript:(${bookmarkletFunction.toString()})('${langHead}'),void(0)`;

  const style = bookmarkletFunction(0, 'style');

  setInterval(() => {
    const multiLangButton = document.querySelector('button.ytp-subtitles-button.ytp-button');

    if (multiLangButton) {
      let aButton = document.querySelector('a.ytp-subtitles-button.ytp-button');
      if (aButton) {
        aButton.style.display = multiLangButton.style.display;
      } else {
        aButton = multiLangButton.cloneNode(true);
        multiLangButton.classList.add(langHead);
        aButton.setAttribute('href', bookmarkletAddress);
        multiLangButton.insertAdjacentHTML('beforebegin', aButton.outerHTML.replace('<button ', '<a '));

        style(langHead + '-style', document.body).innerHTML = `
.caption-window.${langHead} {display: none !important; }
#movie_player.${langHead} .caption-window {display: none !important; }
#movie_player.${langHead} .caption-window.${langHead} {display: block !important }

button.ytp-subtitles-button.${langHead} { display:none }

#movie_player.${langHead} label.${langHead}-checkbox { display:block; }
#movie_player label.${langHead}-checkbox { display:none; }

#movie_player.${langHead}-error .${langHead}-toggle { display: none }

.caption-window.${langHead} { bottom: 2%; left: 25%; right: 25%; text-align: center; font-size: 21.3333px; color: rgba(255, 255, 255,0.5); font-family: "YouTube Noto", Roboto, "Arial Unicode Ms", Arial, Helvetica, Verdana, "PT Sans Caption", sans-serif; }
.caption-window.${langHead} .captions-text {display: inline-block; background: rgba(8, 8, 8, 0.75); fill: rgb(255, 255, 255); }
`;
      }
    }
  }, 700);
})()