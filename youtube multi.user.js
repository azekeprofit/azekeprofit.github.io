// ==UserScript==
// @name           Youtube Multi
// @version        0.3
// @description    Adds additional Youtube subtitles
// @include        https://www.youtube.com/watch?v=*
// @grant          none
// ==/UserScript==

(function() {
    const myLangs = 'en,ko,kk,ja'; // list all languages you want to be shown, languages codes are in ISO 639-1

if(location.href.startsWith('https://www.youtube.com/watch?v=')){

    const langHead = 'youtube-multi-lang';

    setTimeout(()=>{
    const controls = document.querySelector('.ytp-left-controls');
    const bookmarklet = `function(langHead,...langs){

    const videoPlayer=document.querySelector('#movie_player');

    if(window.youtubeMultiLangCaptionsIntervalCode){
      clearInterval(window.youtubeMultiLangCaptionsIntervalCode);
      window.youtubeMultiLangCaptionsIntervalCode='';

      videoPlayer.classList.remove(langHead);
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

    let subs=window.youtubeMultiLangCaptions=window.youtubeMultiLangCaptions||new Map();
    (window.youtubeMultiLangCaptions.length?Promise.resolve():

    Promise.all(videoPlayer.getPlayerResponse().captions.playerCaptionsTracklistRenderer.captionTracks.flatMap(c =>
            langs.map((lang, i) => {
                            const {baseUrl,vssId}=c;
                            if(vssId == lang || vssId.startsWith(lang + '-')){
                            const newSub = [];
                            subs.set(i, newSub);
                            return fetch(baseUrl).then(r => r.text()).then(x => {
                                const {times,lines,ends} = newSub;
                                new DOMParser().parseFromString(x.replace(/&amp;/g, '&'), 'text/xml').querySelectorAll('text').forEach(l => {
                                    const start=l.getAttribute('start') -0;
                                    if(newSub.length>0) {
                                      const prevSub=newSub[newSub.length-1];
                                      if(prevSub.start==prevSub.end)
                                        prevSub.end=start; }
                                        if(l.innerHTML.trim().length)
                                        newSub.push({start, end: l.getAttribute('dur') -0+start, html: l.innerHTML, index: newSub.length});
                                })})}})))

).then(() =>window.youtubeMultiLangCaptionsIntervalCode=setInterval(()=>{
        subs.forEach((sub, i) => {
            const langClass = langHead+i;

            let caps = div('.caption-window.ytp-caption-window-bottom.'+langHead, videoPlayer);

            const curTime = document.querySelector('video').getCurrentTime();
            const lines = div('.captions-text', caps);

            const oldLines = new Set([...lines.querySelectorAll('.'+langClass)].map(l=>l.dataset.lineIndex-0));

            sub.filter(({start,end})=>start<=curTime && curTime<=end).forEach(({html,index}) => {
                      if (!oldLines.delete(index)) {
                          const newLine = div('.caption-visual-line.'+langClass+'.'+langClass+'-line'+index, lines, caps.querySelector(sortClasses[i]));
                          newLine.dataset.lineIndex = index;
                          div('.ytp-caption-segment', newLine).innerHTML = html;
                          }});
            if (oldLines.size) lines.querySelectorAll([...oldLines].map(l=>'.' +langClass + '-line' +l).join(',')).forEach(n=>n.remove());
    }) }, 100)).then(() =>videoPlayer.classList.add(langHead))}`;

const bookmarkletAddress=`javascript:(${bookmarklet})('${langHead}',${myLangs.split(',').map(t=>'".'+t.toLowerCase()+'"')}),void(0)`;

function addElement(t,p){
var r=(p||document.body).appendChild(document.createElement(t));
var i=1;
while(arguments[++i])("|innerHTML|innerText|onclick|style|".indexOf("|"+arguments[i]+"|")!=-1)?r[arguments[i]]=arguments[++i]:r.setAttribute(arguments[i],arguments[++i]);
return r;}

addElement('a', controls, 'innerText', 'Multi Lang', 'class', langHead+'-toggle', 'title', 'Shows multiple Youtube subtitles at once', 'href', bookmarkletAddress);

addElement('style', 0, 'innerHTML', `
.caption-window.${langHead} { bottom: 2%; left: 30%; right: 30%; text-align: center; font-size: 21.3333px; color: rgb(255, 255, 255); font-family: "YouTube Noto", Roboto, "Arial Unicode Ms", Arial, Helvetica, Verdana, "PT Sans Caption", sans-serif; }
.caption-window.${langHead} .captions-text {display: inline-block; background: rgba(8, 8, 8, 0.75); fill: rgb(255, 255, 255); }
.caption-window.${langHead} {display: none !important; }
#movie_player.${langHead} .caption-window {display: none !important; }
#movie_player.${langHead} .caption-window.${langHead} {display: block !important }
#movie_player.${langHead} .${langHead}-toggle::after { content: ' ON'; }
#movie_player .${langHead}-toggle::after { content: ' OFF'; }`);

},700);
}})()
