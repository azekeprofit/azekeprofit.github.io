// ==UserScript==
// @name           Youtube Multi
// @version        0.3
// @description    Adds additional Youtube subtitles
// @include        https://www.youtube.com/watch?v=*
// @grant          none
// ==/UserScript==

(function() {
    const myLangs = 'en,ko,kk'; // list all languages you want to be shown, languages codes are in ISO 639-1

if(location.href.startsWith('https://www.youtube.com/watch?v=')){

    const langHead = 'youtube-multi-lang';

    setTimeout(()=>{
    const controls = document.querySelector('.ytp-left-controls');
    const bookmarklet = `function(langHead,...langs){

    if(window.youtubeMultiLangCaptionsIntervalCode){
      clearInterval(window.youtubeMultiLangCaptionsIntervalCode);
      window.youtubeMultiLangCaptionsIntervalCode='';
      document.querySelector('.caption-window.ytp-caption-window-bottom .captions-text').classList.remove(langHead);
      return;
    }

    const classes=langs.map((l, i) =>'.'+langHead+i);
    const sortClasses=langs.map((l, i) =>classes.slice(i+1).join(','));

    sortClasses[0]='.'+langHead;
    sortClasses[langs.length-1]=':not(*)';

    let subs=window.youtubeMultiLangCaptions=window.youtubeMultiLangCaptions||new Map();
    (window.youtubeMultiLangCaptions.length?Promise.resolve():

    Promise.all(document.getElementById('movie_player').getPlayerResponse().captions.playerCaptionsTracklistRenderer.captionTracks.flatMap(c =>
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
        const caps = document.querySelector('.caption-window.ytp-caption-window-bottom');
        if (!caps) return;
        const curTime = document.querySelector('video').getCurrentTime();

        const lines = caps.querySelector('.captions-text');
        lines.classList.add(langHead);
        const line = lines.querySelector('.caption-visual-line');

        subs.forEach((sub, i) => {
            const langClass = langHead+i;

            const oldLines = new Set([...lines.querySelectorAll('.'+langClass)].map(l=>l.dataset.lineIndex-0));

            sub.filter(({start,end})=>start<=curTime && curTime<=end).forEach(({html,index}) => {
                      if (!oldLines.delete(index)) {
                          const newLine = line.cloneNode(true);
                          newLine.dataset.lineIndex = index;
                          newLine.classList.add(langHead, langClass, langClass + '-line' +index);
                          newLine.querySelector('.ytp-caption-segment').innerHTML = html;
                          lines.insertBefore(newLine, lines.querySelector(sortClasses[i])) }});
            if (oldLines.size) lines.querySelectorAll([...oldLines].map(l=>'.' +langClass + '-line' +l).join(',')).forEach(n=>n.remove());
          })}, 100)); }`;

const bookmarkletAddress=`javascript:(${bookmarklet})('${langHead}',${myLangs.split(',').map(t=>'".'+t.toLowerCase()+'"')}),void(0)`;

function addElement(t,p){
var r=(p||document.body).appendChild(document.createElement(t));
var i=1;
while(arguments[++i])("|innerHTML|innerText|onclick|style|".indexOf("|"+arguments[i]+"|")!=-1)?r[arguments[i]]=arguments[++i]:r.setAttribute(arguments[i],arguments[++i]);
return r;}

addElement('a',controls,'innerText','Multi Lang','title','Shows multiple Youtube subtitles at once','href',bookmarkletAddress);

addElement('style',0,'innerHTML',`
.captions-text .caption-visual-line.${langHead} {display: none !important;}
.captions-text.${langHead} .caption-visual-line {display: none !important;}
.captions-text.${langHead} .caption-visual-line.${langHead} {display: block !important;}`);

},700);
}})()
