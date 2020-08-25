// ==UserScript==
// @name           Youtube Multi
// @version        0.4
// @description    Adds additional Youtube subtitles
// @include        https://www.youtube.com/watch?v=*
// @grant          none
// ==/UserScript==

(function() {
    const myLangs = 'en,ko,kk,ja'; // list all languages you want to be shown, languages codes are in ISO 639-1

    if(location.href.startsWith('https://www.youtube.com/watch?v=')){

    const langHead = 'youtube-multi-lang';

    const bookmarkletFunction=function (langHead,...langs){
      
      const videoPlayer=document.querySelector('#movie_player');
      const playerClasses=videoPlayer.classList;
  
      if(window.youtubeMultiLangCaptionsIntervalCode){
        clearInterval(window.youtubeMultiLangCaptionsIntervalCode);
        window.youtubeMultiLangCaptionsIntervalCode='';
  
        playerClasses.remove(langHead);
        return;
      }
  
      const classes=langs.map((l, i) =>'.'+langHead+i);
      const sortClasses=langs.map((l, i) =>classes.slice(i+1).join(','));
  
      sortClasses[0]='.caption-visual-line';
      sortClasses[langs.length-1]=':not(*)';
  
      function div(classes, parent, insertBefore) {
        var el=parent.querySelector(classes);
        if(el)return el;
        el=document.createElement('div');
        el.classList.add(...classes.split('.').filter(c=>c));
        parent.insertBefore(el, insertBefore);
        return el;
      }

      const subs=window.youtubeMultiLangCaptions=window.youtubeMultiLangCaptions||new Map();

      const captionTracks=videoPlayer.getPlayerResponse().captions?.playerCaptionsTracklistRenderer?.captionTracks??[];
      
      (subs.size?Promise.resolve():
      Promise.all(captionTracks.flatMap(({baseUrl, vssId}) =>
        langs.map((lang, langIndex) => {
                        if(vssId == lang || vssId.startsWith(lang + '-')){
                        const newSub = [];
                        subs.set(langIndex, newSub);
                        return fetch(baseUrl).then(r=>r.text()).then(t=>
                          new DOMParser().parseFromString(t.replace(/&amp;/g, '&'), 'text/xml').querySelectorAll('text').forEach(l => {
                            const start = l.getAttribute('start') - 0;
                            if (newSub.length) {
                              const prevSub = newSub[newSub.length - 1];
                              if (prevSub.start == prevSub.end)
                                prevSub.end = start;
                            }
                            if (l.innerHTML.trim().length)
                              newSub.push({ start, end: l.getAttribute('dur') - 0 + start, html: l.innerHTML, index: newSub.length });
                          }))}}))))
      .then(()=>{if(subs.size<2)throw Error('Not enough language captions')})
      .then(()=>window.youtubeMultiLangCaptionsIntervalCode=setInterval(()=>{
          subs.forEach((sub, langIndex) => {
              const langClass = '.'+langHead+langIndex;
  
              const caps = div('.caption-window.ytp-caption-window-bottom.'+langHead, videoPlayer);
  
              const curTime = document.querySelector('video').getCurrentTime();
              const lines = div('.captions-text', caps);
  
              const oldLines = new Set([...lines.querySelectorAll(langClass)].map(l=>l.dataset.line-0));
  
              sub.forEach(({start,end,html,index}) => {
                        if(start<=curTime && curTime<end)
                        if (!oldLines.delete(index)) {
                            const newLine = div(`.caption-visual-line${langClass}${langClass}-line${index}`, lines, caps.querySelector(sortClasses[langIndex]));
                            newLine.dataset.line = index;
                            div('.ytp-caption-segment', newLine).innerHTML = html;
                            }});
              if (oldLines.size) lines.querySelectorAll([...oldLines].map(l=>`${langClass}-line${l}`).join(',')).forEach(n=>n.remove());
           })},100))
       .then(()=>playerClasses.add(langHead),()=>playerClasses.add(langHead+'-error'))};

    const bookmarkletAddress=`javascript:(${bookmarkletFunction.toString()})('${langHead}',${myLangs.split(',').map(t=>`".${t.toLowerCase()}"`)}),void(0)`;

    function addElement(t,p){
      var r=(p||document.body).appendChild(document.createElement(t));
      var i=1;
      while(arguments[++i])("|innerHTML|innerText|onclick|style|".indexOf("|"+arguments[i]+"|")!=-1)?r[arguments[i]]=arguments[++i]:r.setAttribute(arguments[i],arguments[++i]);
      return r;}
    
    setTimeout(()=>{
      const controls = document.querySelector('.ytp-left-controls');
      addElement('a', controls, 'innerText', 'Multi Lang', 'class', langHead+'-toggle', 'title', 'Shows multiple Youtube subtitles at once', 'href', bookmarkletAddress);
      
      addElement('style', 0, 'innerHTML', `
.caption-window.${langHead} {display: none !important; }
#movie_player.${langHead} .caption-window {display: none !important; }
#movie_player.${langHead} .caption-window.${langHead} {display: block !important }

#movie_player.${langHead} .${langHead}-toggle::after { content: ' ON'; }
#movie_player .${langHead}-toggle::after { content: ' OFF'; }

#movie_player.${langHead}-error .${langHead}-toggle { display: none }

.caption-window.${langHead} { bottom: 2%; left: 25%; right: 25%; text-align: center; font-size: 21.3333px; color: rgb(255, 255, 255); font-family: "YouTube Noto", Roboto, "Arial Unicode Ms", Arial, Helvetica, Verdana, "PT Sans Caption", sans-serif; }
.caption-window.${langHead} .captions-text {display: inline-block; background: rgba(8, 8, 8, 0.75); fill: rgb(255, 255, 255); }
`);
    },700)}
})()
