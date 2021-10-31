// ==UserScript==
// @name           Youtube Multi
// @version        0.8
// @description    Adds additional Youtube subtitles
// @match          https://www.youtube.com/*
// @grant          none
// @run-at         document-end
// ==/UserScript==

(function () {
  const langHead = 'youtube-multi-lang';

  function bookmarkletFunction(langHead, optionalTag, srtFilesObj) {

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

    const div = tag('div');
    const label = tag('label');
    const controls = document.querySelector('.ytp-left-controls');

    function getCurrentSubs() {
      const videoId = getVideoId();

      if (!youtubeCaps.has(videoId))
        youtubeCaps.set(videoId, new Map());

      return youtubeCaps.get(videoId);
    };

    class baseSubtitles {
      lines = [];
      segments = [];
      constructor(subId, checked, text, ...par) {
        const sub = getCurrentSubs();
        if (!sub.has(subId)) {
          this.checkbox = label(`.${langHead}-checkbox.${langHead}${subId}.${langHead}-watch${getVideoId()}`, controls);
          this.checkbox.innerHTML = `<input type=checkbox ${checked ? 'checked=checked' : ''}></input>${text}`;

          sub.set(subId, this);
          this.load(...par).then(() => this.partitionIntoSegments());
        }
      }

      showHideCheckbox(visibility) {
        this.checkbox.style = visibility ? '' : 'display:none';
      }

      isChecked() {
        return this.checkbox.querySelector('input').checked;
      }

      load() {
      }

      partitionIntoSegments() {
        const perChunk = Math.floor(Math.sqrt(this.lines.length));
        this.lines.forEach(({ start, end }, index) => {
          const chunkIndex = Math.floor(index / perChunk);
          const s = this.segments[chunkIndex];
          if (s) {
            s.start = Math.min(start, s.start);
            s.end = Math.max(end, s.end);
          }
          else this.segments[chunkIndex] = { start, end, chunkStart: index, chunkEnd: Math.min(index + perChunk, this.lines.length) };
        })
      }
    }

    class subtitles extends baseSubtitles {
      constructor(url, subId, moreThan1Subs) {
        const split = subId.split('.');
        const auto = split[0] == 'a';

        super(subId, !(auto && moreThan1Subs), split[1] + (auto ? ' (auto)' : ''), url);
      }

      load(url) {
        const lines = this.lines;
        return fetch(url).then(r => r.text()).then(t =>
          new DOMParser().parseFromString(t.replace(/&amp;/g, '&'), 'text/xml').querySelectorAll('text').forEach(l => {
            const start = l.getAttribute('start') - 0;
            if (lines.length) {
              const prevSub = lines[lines.length - 1];
              if (prevSub.start == prevSub.end)
                prevSub.end = start;
            }
            if (l.innerHTML.trim().length)
              lines.push({ start, end: l.getAttribute('dur') - 0 + start, html: l.innerHTML });
          }))
      }
    }

    class srtSubtitles extends baseSubtitles {
      constructor(fileName, srtLines) {
        const subId = '.' + srtFilesObj.name.replace(/[^0-9a-zA-Z-]/g, '');
        super(subId, true, fileName, srtLines);
      }

      load(srtLines) {
        const lines = /(\d+)\r?\n(\d\d):(\d\d):(\d\d)\,(\d\d\d) --> (\d\d):(\d\d):(\d\d)\,(\d\d\d)\r?\n/;

        const arr = srtLines.split(lines);
        const pop = () => arr.splice(0, 1)[0];
        pop();
        const popTime = () => (pop() * 60 * 60) + (pop() * 60) + (pop() - 0) + (pop() / 1000);

        while (true) {
          const index = pop();
          if (isNaN(index)) break;
          this.lines.push({ start: popTime(), end: popTime(), html: pop() });
        }

        return Promise.resolve();
      }
    }

    const container = div('.ytp-caption-window-container', videoPlayer);
    const caps = div('.caption-window.ytp-caption-window-bottom.' + langHead, container);

    function activateCaptions() {
      if (!window.youtubeMultiLangCaptionsIntervalCode)
        window.youtubeMultiLangCaptionsIntervalCode = setInterval(() => {
          const lines = div('.captions-text', caps);

          getCurrentSubs().forEach((sub, subId) => {
            const langClass = '.' + langHead + subId;
            const lineContainer = div(langClass + '-line-container', lines);

            const oldLines = new Map([...lines.querySelectorAll(langClass)].map(l => [l.dataset.line - 0, l]));

            const curTime = videoPlayer.getCurrentTime();

            if (sub.isChecked())
              sub.segments.forEach(({ start, end, chunkStart, chunkEnd }) => {
                if (start <= curTime && curTime < end)
                  for (let index = chunkStart; index < chunkEnd; index++) {
                    const { start, end, html } = sub.lines[index];
                    if (start <= curTime && curTime <= end)
                      if (!oldLines.delete(index)) {
                        const newLine = div(`.caption-visual-line${langClass}${langClass}-line${index}`, lineContainer);
                        newLine.dataset.line = index;
                        div('.ytp-caption-segment', newLine).innerHTML = html;
                      }
                  }
              });

            for (const n of oldLines.values()) n.remove();
          })
        }, 100);

      playerClasses.add(langHead);
      multiLangButton.style.display = 'inline-block';
      multiLangButton.setAttribute('aria-pressed', 'true');
    }

    if (srtFilesObj) {
      var fileReader = new FileReader();
      fileReader.onload = e => new srtSubtitles(srtFilesObj.name, e.target.result);
      fileReader.readAsText(srtFilesObj, 'UTF-8');
      activateCaptions();
      return;
    }


    if (window.youtubeMultiLangCaptionsIntervalCode) {
      clearInterval(window.youtubeMultiLangCaptionsIntervalCode);
      window.youtubeMultiLangCaptionsIntervalCode = '';

      playerClasses.remove(langHead);
      multiLangButton.setAttribute('aria-pressed', 'false');
      return;
    }

    function stateChange(e) {
      if (e === -1) {
        caps.innerHTML = '';

        const captionTracks = videoPlayer.getPlayerResponse()?.captions?.playerCaptionsTracklistRenderer?.captionTracks || [];
        captionTracks.forEach(({ baseUrl, vssId }) => new subtitles(baseUrl, vssId, captionTracks.length > 1));
        youtubeCaps.forEach((allSubs, vId) => allSubs.forEach(sub => sub.showHideCheckbox(vId == getVideoId())));
        multiLangButton.style.display = getCurrentSubs().size > 0 ? 'inline-block' : 'none';
      }
    }

    if (!videoPlayer.stateChangeListener)
      videoPlayer.addEventListener('onStateChange', videoPlayer.stateChangeListener = stateChange);

    stateChange(-1);
    activateCaptions();
  }

  const bookmarkletAddress = `javascript:(${bookmarkletFunction.toString()})('${langHead}'),void(0)`;

  const style = bookmarkletFunction(0, 'style');

  let srtFileInput;

  setInterval(() => {
    const multiLangButton = document.querySelector('button.ytp-subtitles-button.ytp-button');

    if (multiLangButton) {
      let aButton = document.querySelector('a.ytp-subtitles-button.ytp-button');
      if (aButton) {
        if (aButton.style.display == 'none') aButton.style.display = multiLangButton.style.display;
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


    const menu = document.querySelector(".ytp-popup.ytp-settings-menu .ytp-panel .ytp-panel-menu");

    if (menu && !srtFileInput) {
      menu.insertAdjacentHTML("afterbegin", `
<div class="ytp-menuitem ${langHead}-srtFileInput" aria-haspopup="true" role="menuitem" tabindex="0">
    <div class="ytp-menuitem-icon"></div>
    <div class="ytp-menuitem-label">Load .srt</div>
<div class="ytp-menuitem-content"><div><span><input type="file" onchange="(${bookmarkletFunction.toString()})('${langHead}',0,this.files[0])"></span></div></div></div>
`);
      srtFileInput = true;
    }

  }, 700);
})()
