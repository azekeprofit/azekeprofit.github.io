[GitHub profile](https://github.com/azekeprofit)

# Scripting

Having been a professional developer for two decades, outside of work i wrote various scripts and tools for my hobbies. Having an ability to make a program that can do things to a document/file or to a another webpage is increasingly useful and time-saving.

# Language learning
## Showing several language subtitles on Youtube
[Youtube Multi](https://chromewebstore.google.com/detail/youtube-multi-captions/mlkecnkjoepkpihbgdbglelggneafihm) is a Chrome browser extension that replaces "CC/Subtitles" button on Youtube with my own that shows multiple language captions on at the same time (provided video has them):

![screenshot of Youtube Multi](youtube%20multi.jpg)

Here are some of the videos with multiple subtitles i tested it on:

* [Past, present and future tenses of "Go" in Kazakh](https://www.youtube.com/watch?v=xRJKt67K4BA) -- has English, Kazakh, Korean (and an auto-generated Russian track but script disables those unless it's the only subtitle available)

* [도시로 간 처녀(1981) The Maiden Who Went to the City](https://www.youtube.com/watch?v=QHSN2HJiLIQ) -- one of the many old films on Korean Classic Films Archive channel, has English and Korean subtitles.

Additionally, script can also add custom subtitles to video by picking "Load .srt" option in Settings menu.

Youtube Multi originally was a UserScript [file](https://azekeprofit.github.io/youtube%20multi.user.js?raw=true), but i've since rewrote it and published as Chrome Extension. Source code for the extension is published [on its own repo](https://github.com/azekeprofit/youtube-multi).


## UserScripts

 Other scripts remain as UserScripts, mostly meant for personal use. UserScripts can be installed by just drag-and-dropping downloaded ".user.js" files into "Extensions" panel of Chrome but people reported that Greasemonkey also works for Firefox. 

[More detailed instructions](https://stackapps.com/tags/script/info) on how to install these scripts on StackApps.

## Showing several language subtitles on VLIVE

[VLIVE Multi](vlive%20multi.user.js?raw=true) basically does the same as script for Youtube. It adds a button "Multi" near "Subtitles" button:

![screenshot of VLIVE Multi](vlive%20multi.jpg)

In the "Subtitles" click on languages you want to see -- they should become underlined.

Again, script is installed by drag and dropping [the file](vlive%20multi.user.js?raw=true) into "Extensions" tab of Chrome (Ctrl-Shift-E or "chrome:extensions" from address bar).

## "Enhanced" Papago

Depending on how many languages you have installed on your system constantly switching between them just to type in that one Korean word you want to look up on [Papago](https://papago.naver.com) can be frustrating. So i wrote a [script](papago.user.js?raw=true) that forces Papago input field to treat all keyboard input as if you're in Hangeul mode. For example, if you type "dkssud" it will turn into 안녕 as you type it. It converts both English and Russian keyboard presses so i don't have to think about which language i am currently in.

Additionally this script also changes "Backspace" behaviour i find counter-intuitive -- standard Windows Korean layout deletes the entire block if you press "Backspace". My script only deletes the last entered letter. You can disable this behaviour by unchecking one of the checkboxes on top of the field. The other checkbox disables the script -- you can uncheck it to input an English word inside your Korean phrase. Obviously, script only works if source language has been set as "Korean".

I also added a Hanja refernce bar of sorts -- it replaces Papago logo on top (sorry, Naver!). It shows the syllable your cursor is on and all Hanja characters that are spelled as this syllable. If you hover mouse over any of the characters -- it pulls https://koreanhanja.app to show information about the character:

![screenshot of Papaga with Hanja reference bar](papago%20hanjabar.jpg)

Again script is installed by drag and dropping [the file](papago.user.js?raw=true) into "Extensions" tab of Chrome.


# A confluence of gaming and programming

I didn't expect these scripting skills to be applied to gaming. I've always worked on software for large companies and my toolset is mostly in the area of how to build serious-looking user-interface to be used by thousands of people every day on work.

Yet, through various circumstances and deficiences (both mine and games') i encountered ways to combine these passions of mine into one. Such as:

# God Hand Moveset Switcher

Thanks to **ThereIsNoSpoon**'s [release of moveset switcher](https://www.youtube.com/watch?v=Gu9XTfZCGTM) we have addresses for where PS2 game stores assigned moves for each of the buttons. Using that, i cobbled up a quick and dirty PCSX2 cheat generator where you can customize movesets:

[God Hand Moveset Switcher Cheat File Generator](GodHandMovesetSwitcher.htm)

One no longer needs Cheat Engine running to make moveset switcher work -- just put cheat file made by this generator into "Cheat" folder of PCSX2 directory, enable cheats and start the game.

# The Witness end-game puzzle aid

Final puzzle challenge in [The Witness](https://en.wikipedia.org/wiki/The_Witness_(2016_video_game)) is brutal. Not only it throws a number of randomly generated puzzles at you -- you're on a timer too. [One specific type of puzzle was especially hard for me](https://twitter.com/azeke1984/status/1157186715271991296) so using my skills of javascript and basic knowledge of combinatorics i made a javascript fiddle to ~~solve them for me~~ help me in solving them:

[The Witness' Triangles puzzle solver](triangles.htm)

## Videogame "distractions" are good for professional growth!

Having written this first draft of the "triangles.htm" i've fallen into a rabbit hole of finding ways how to make this program work better while making it shorter. I was always interested and very appreciative of the frameworks like [React](https://reactjs.com/), [Preact](https://preactjs.com/), [Svelte](https://svelte.dev/) and i used this opportunity to learn this industry-leading tools and rewrote my program with:

* [Preact](preact%20triangles.htm)
* [Preactz and Hooks](preactz%20hooks%20triangles.htm)
* [React and Hooks](react%20hooks%20triangles.htm)
* [Svelte App](https://svelte.dev/repl/1e5fea2ae76146f7a444bf551c0aee15) -- REPL version more often than not gets ejected by "Infinite loop" safety, you can save the version locally and build it yourself or check out my compiled version [here](svelte%20triangles%20compiled.html)

## Recreating various puzzles

General interest in puzzles also applies to actual puzzles like the ones in [LOK puzzle book](https://www.blazgracar.com/lok). I tried to write my [own implementation in SolidJS](https://azekeprofit.github.io/lok-solidjs/) ([source code](https://github.com/azekeprofit/lok-solidjs)) but stopped halfway due to waning interest and author of the book developing fuly-fledged official videogame.

Another passion of mine are Korean variety shows that feature elaborate board and card games. While 2014's [The Genius](https://baechusquad.download/the_genius/) is still the best show of this kind, the producer has since made a number of other shows, including recent [Devil's Plan for Netflix](https://www.netflix.com/title/81653386). One of many puzzles games featured on the show was "Hexagon" -- a competitive math and memory game for two players:

[Here it is written in SolidJS, supports both single and two-player mode](https://azekeprofit.github.io/hexagon-solidjs/) ([the source](https://github.com/azekeprofit/hexagon-solidjs))

I also want to note that "Monorail" -- a game from "The Genius", was also an [object of research](https://chaosatthesky.wordpress.com/2014/12/08/the-genius-by-a-skymins-mind-7/) before and was even implemented as a game here:

[Monorail as seen on The Genius](https://github.com/thefalc/monorail-the-game)
