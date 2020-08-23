// ==UserScript==
// @name           Youtube Multi
// @version        0.1
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
   if(window.youtubeMultiLangCaptionsIntervalCode){
clearInterval(window.youtubeMultiLangCaptionsIntervalCode);
window.youtubeMultiLangCaptionsIntervalCode='';

document.querySelectorAll('.caption-window.ytp-caption-window-bottom.multi-ed .captions-text .caption-visual-line.last-legit-line+*').forEach(n=>n.remove());
document.querySelector('.caption-window.ytp-caption-window-bottom.multi-ed').classList.remove('multi-ed');
return;
}
    let subs=window.youtubeMultiLangCaptions=window.youtubeMultiLangCaptions||[];
    (window.youtubeMultiLangCaptions.length?Promise.resolve():

Promise.all(document.getElementById('movie_player').getPlayerResponse().captions.playerCaptionsTracklistRenderer.captionTracks.flatMap(c =>
            langs.map((lang, i) => {
                            const {baseUrl,vssId}=c;
                            if(vssId == lang || vssId.startsWith(lang + '-')){
                            const newSub = subs[i] = {times: [],lines: []};
                            return fetch(baseUrl).then(r => r.text()).then(x => {
                                const {times,lines} = newSub;
                                new DOMParser().parseFromString(x.replace(/&amp;/g, '&'), 'text/xml').querySelectorAll('text').forEach(l => {
                                    times.push(l.getAttribute('start'));
                                    lines.push(l.innerHTML)
                                })})}})))
    
).then(()=>window.youtubeMultiLangCaptionsIntervalCode=setInterval(()=>{
        var caps = document.querySelector('.caption-window.ytp-caption-window-bottom:not(.multi-ed)');
        if (!caps) return;
        caps.classList.add('multi-ed');
        const curTime = document.querySelector('video').getCurrentTime();

        for(const sub of subs)if(sub){
        let lineIndex = -2; let time;
        while(time=sub.times[++lineIndex+1])
            if (time > curTime) break;

        if (!sub.times[lineIndex]) return;

        const lines = caps.querySelector('.captions-text');
        lines.lastElementChild.classList.add('last-legit-line');
        const line = lines.querySelector('.caption-visual-line');

        for(const sub of subs)
        if (sub&&!sub.lines[lineIndex].startsWith(line.innerText))
            lines.appendChild(line.cloneNode(true)).querySelector('.ytp-caption-segment').innerHTML = sub.lines[lineIndex];
        break;}
    },100));}`;


const bookmarkletAddress=`javascript:(${bookmarklet})(${myLangs.split(',').map(t=>'".'+t.toLowerCase()+'"')}),void(0)`;

function addElement(t,p){
var r=(p||document.body).appendChild(document.createElement(t));
var i=1;
while(arguments[++i])("|innerHTML|innerText|onclick|style|".indexOf("|"+arguments[i]+"|")!=-1)?r[arguments[i]]=arguments[++i]:r.setAttribute(arguments[i],arguments[++i]);
return r;}

addElement('a',controls,'innerText','Multi Lang','title','Shows multiple Youtube subtitles at once','href',bookmarkletAddress);
},700);
}})()
