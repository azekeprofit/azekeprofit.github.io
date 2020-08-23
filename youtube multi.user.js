// ==UserScript==
// @name           Youtube Multi
// @version        0.2
// @description    Adds additional Youtube subtitles alongside the one you chose, presuming video has them and that all lines are synced between versions
// @include        https://www.youtube.com/watch?v=*
// @grant          none
// ==/UserScript==

(function() {
const myLangs='en,kk,ko'; // list all languages you want to be shown, languages codes are in ISO 639-1

if(location.href.startsWith('https://www.youtube.com/watch?v=')){

setTimeout(()=>{
const controls=document.querySelector('.ytp-left-controls');

const bookmarklet=`function(...langs){
const langHead='youtube-multi-lang';

if(window.youtubeMultiLangCaptionsIntervalCode){
clearInterval(window.youtubeMultiLangCaptionsIntervalCode);
window.youtubeMultiLangCaptionsIntervalCode='';
document.querySelector('.caption-window.ytp-caption-window-bottom .captions-text').classList.remove(langHead);

return;
}
    let subs=window.youtubeMultiLangCaptions=window.youtubeMultiLangCaptions||[];
    (window.youtubeMultiLangCaptions.length?Promise.resolve():

Promise.all(document.getElementById('movie_player').getPlayerResponse().captions.playerCaptionsTracklistRenderer.captionTracks.flatMap(c =>
            langs.map((lang, i) => {
                            const {baseUrl,vssId}=c;
                            if(vssId == lang || vssId.startsWith(lang + '-')){
                            const newSub = subs[i] = {times:[],lines:[],durs:[]};
                            return fetch(baseUrl).then(r => r.text()).then(x => {
                                const {times,lines,durs} = newSub;
                                new DOMParser().parseFromString(x.replace(/&amp;/g, '&'), 'text/xml').querySelectorAll('text').forEach(l => {
                                    times.push(l.getAttribute('start'));
                                    durs.push(l.getAttribute('dur'));
                                    lines.push(l.innerHTML)
                                })})}})))
    
).then(()=>window.youtubeMultiLangCaptionsIntervalCode=setInterval(()=>{
        const caps = document.querySelector('.caption-window.ytp-caption-window-bottom');
        if (!caps) return;
        const curTime = document.querySelector('video').getCurrentTime();

        const lines = caps.querySelector('.captions-text');
        lines.classList.add(langHead);
        const line = lines.querySelector('.caption-visual-line');

        subs.forEach((sub,i)=>{if(sub){
          const langClass=langHead+i;
          if([...lines.querySelectorAll('.'+langClass+':last-of-type')].every(n=>sub.times[n.dataset.lineIndex-0+1]&&sub.times[n.dataset.lineIndex-0+1]<=curTime)){
          const oldLines=new Set([...lines.querySelectorAll('.'+langClass)].map(l=>l.dataset.lineIndex-0));
          const linesToDelete=new Set([...oldLines]);

          let lineIndex = -1; let time;
          while(time=sub.times[++lineIndex])
              if(time <= curTime && curTime <= time-0 + (sub.durs[lineIndex]-0)) {
                   linesToDelete.delete(lineIndex);
                   if(!oldLines.has(lineIndex)){
                   const newLine=line.cloneNode(true);
                   newLine.dataset.lineIndex=lineIndex;
                   newLine.classList.add(langHead,langClass,langClass+'-line'+lineIndex);
                   newLine.querySelector('.ytp-caption-segment').innerHTML = sub.lines[lineIndex];
                   lines.appendChild(newLine)}};
              if(linesToDelete.size)lines.querySelectorAll([...linesToDelete].map(l=>'.'+langClass+'-line'+l).join(',')).forEach(n=>n.remove());
         }}})},100));}`;


const bookmarkletAddress=`javascript:(${bookmarklet})(${myLangs.split(',').map(t=>'".'+t.toLowerCase()+'"')}),void(0)`;

function addElement(t,p){
var r=(p||document.body).appendChild(document.createElement(t));
var i=1;
while(arguments[++i])("|innerHTML|innerText|onclick|style|".indexOf("|"+arguments[i]+"|")!=-1)?r[arguments[i]]=arguments[++i]:r.setAttribute(arguments[i],arguments[++i]);
return r;}

addElement('a',controls,'innerText','Multi Lang','title','Shows multiple Youtube subtitles at once','href',bookmarkletAddress);

addElement('style',0,'innerHTML',`
.captions-text .caption-visual-line.youtube-multi-lang {display: none !important;}
.captions-text.youtube-multi-lang .caption-visual-line {display: none !important;}
.captions-text.youtube-multi-lang .caption-visual-line.youtube-multi-lang {display: block !important;}`);

},700);
}})()
