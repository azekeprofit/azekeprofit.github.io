# A confluence of gaming and programming

Having been a professional developer for two decades i create various scripts and tools for my hobbies outside of work. Having an ability to make a program that can do things to a document/file or to a another webpage is increasingly useful and time-saving.

However i never expected these skills to be applied to gaming. I've always worked on software for large companies and my toolset is mostly in the area of how to build serious-looking user-interface to be used by thousands of people every day on work.

Yet, through various circumstances and deficiences (both mine and game's) i encountered ways to combine these passions of mine into one. Such as:

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
