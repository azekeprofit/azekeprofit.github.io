# Scripting

Having been a professional developer for two decades, outside of work i wrote various scripts and tools for my hobbies. Having an ability to make a program that can do things to a document/file or to a another webpage is increasingly useful and time-saving.

# Language learning

One of these scripts is [Youtube Multi](youtube%20multi.user.js?raw=true). It adds "Multi Lang" control on Youtube playback bar that toggles additional language captions. Open your video, enable captions and press on "Multi Lang":

![screenshot of Youtube Multi](youtube%20multi.jpg)

Note that default language list is English, Korean, Kazakh and Japanese, so if the video doesn't have any of the corresponding captions nothing will happen, see [below](#language-list) on how to change default list.

Here are some of the videos with mutliple subtitles i tested it on:

* [Past, present and future tenses of "Go" in Kazakh](https://www.youtube.com/watch?v=xRJKt67K4BA) -- has English, Kazakh, Korean (and an auto-generated Russian track but i ignore those)

* [도시로 간 처녀(1981) The Maiden Who Went to the City](https://www.youtube.com/watch?v=QHSN2HJiLIQ) -- one of the many old films on Korean Classic Films Archive channel, has English and Korean subtitles.

Script is installed by drag and dropping [the file](youtube%20multi.user.js?raw=true) into "Extensions" tab of Chrome (Ctrl-Shift-E).

## Language list

Language list by default is English, Korean, Kazakh and Japanese. You can open the script with Notepad and change the list as per your needs. For example, to make the list only the English and Japanese, set myLangs constant inside the script to 'en,ja'

Language codes in the list are from [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes).

# A confluence of gaming and programming

However i never expected these scripting skills to be applied to gaming. I've always worked on software for large companies and my toolset is mostly in the area of how to build serious-looking user-interface to be used by thousands of people every day on work.

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
* [Svelte App](https://svelte.dev/repl/1e5fea2ae76146f7a444bf551c0aee15)
