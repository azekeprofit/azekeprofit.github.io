// ==UserScript==
// @name           Vlive Multi
// @version        0.1
// @description    Adds additional Vlive subtitles
// @match          https://www.vlive.tv/*
// @grant          none
// @run-at         document-end
// ==/UserScript==

(function () {
  const langHead = 'vlive-multi-lang';

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

    if (!window.multiLangCaptions) window.multiLangCaptions = new Map();

    const div = tag('div');

    const videoPlayer = window.__WEB_PLAYER__;
    const panel = document.querySelector('.u_rmc_caption_ly');
    const player = document.querySelector('.u_rmcplayer');

    class subtitles {
      loaded = false;
      lines = [];
      constructor(url, index) {
        this.url = url;
        this.index = index;
        this.checkbox = panel.querySelector(`li button[data-click="selectSubtitleLang(${index})"]`);
        this.checkbox.addEventListener('click', e => e.currentTarget.classList.toggle('checked'));
      }

      isChecked() {
        return this.checkbox.classList.contains('checked');
      }

      loadIfNeeded() {
        if (!this.loaded) {
          this.loaded = true;
          fetch(this.url).then(r => r.text()).then(t => {

            const lines = /\n\n(\d+)\n(\d\d):(\d\d):(\d\d)\.(\d\d\d) --> (\d\d):(\d\d):(\d\d)\.(\d\d\d)\n/;

            var text = t.split('WEBVTT')[1];
            var arr = text.split(lines);
            var pop = () => arr.splice(0, 1)[0];
            pop();
            var popTime = () => (pop() * 60 * 60) + (pop() * 60) + (pop() - 0) + (pop() / 1000);

            while (true) {
              var index = pop();
              if (isNaN(index)) break;
              this.lines.push({ start: popTime(), end: popTime(), index, html: pop() });
            }
          })
        }
      }
    }

    const container = document.querySelector('.u_rmcplayer_video');
    container.classList.toggle(langHead);

    if (!window.multiLangCaptionsIntervalCode) {
      const subs = window.multiLangCaptions;

      const captionTracks = videoPlayer.getCurrentVideo().captions.list;

      captionTracks.forEach(({ source }, index) => subs.set(index, new subtitles(source, index)));

      const caps = div(`.${langHead}-container._subtitle_container`, container);

      window.multiLangCaptionsIntervalCode = setInterval(() => {
        caps.style.fontSize = `${player.offsetHeight / 30}px`;

        subs.forEach((sub, langIndex) => {
          const langClass = '.' + langHead + langIndex;
          const lineContainer = div(`${langClass}-line-container.${langHead}-lines-container`, caps);

          const oldLines = new Set([...caps.querySelectorAll(langClass)].map(l => l.dataset.line));
          const curTime = videoPlayer.getCurrentTime();
          if (sub.isChecked()) {
            sub.loadIfNeeded();
            sub.lines.forEach(({ start, end, html, index }) => {
              if (start <= curTime && curTime < end)
                if (!oldLines.delete(index)) {
                  const newLine = div(`.u_rmc_caption_txt.subt-font-2.subt-color-white${langClass}${langClass}-line${index}`, lineContainer);
                  newLine.dataset.line = index;
                  newLine.innerHTML = html;
                }
            })
          }
          if (oldLines.size) caps.querySelectorAll([...oldLines].map(l => `${langClass}-line${l}`).join(',')).forEach(n => n.remove());
        })
      }, 100);
    }
  }

  const bookmarkletAddress = `javascript:(${bookmarkletFunction.toString()})('${langHead}'),void(0)`;

  const style = bookmarkletFunction(0, 'style');

  style(`.${langHead}`, document.body).innerHTML = `
  .${langHead}-container {position: absolute;
  width: 100%;
  z-index: 130;
  text-align: center;
  visibility: hidden;
  font-size: 17.472px;
  cursor: auto;
  display: block;
  bottom:55px}

  .u_rmcplayer_video.${langHead} .${langHead}-lines-container {font-size:inherit}
  
  .u_rmcplayer_video.${langHead} ._subtitle_container{
    display:none !important;
  }

  
  .u_rmcplayer_video .${langHead}-container._subtitle_container{
    display:none !important;
  }

  .u_rmcplayer_video.${langHead} .${langHead}-container._subtitle_container{
    display:block !important;
  }

  .u_rmcplayer_video.${langHead} button.checked * {text-decoration:underline}

  .u_rmcplayer_video.${langHead} a.${langHead}::after {content:': ON'}
  .u_rmcplayer_video a.${langHead}::after {content:': OFF'}
  `;

  const getButton = () => document.querySelector(`a.${langHead}`);

  const setButton = setInterval(function () {

    const controls = document.querySelector('.u_rmc_controls_btn');
    if (!controls) return;

    if (!getButton()) {
      controls.insertAdjacentHTML('afterbegin', `<a class=${langHead} style='position:relative;color:white;float:left;display:block'>Multi</a>`);
      getButton().setAttribute('href', bookmarkletAddress);
    }
  }, 700)
})()