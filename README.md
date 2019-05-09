# Attogram Games website builder

Your own games website, filled with open source goodness!

[![Games Website](https://raw.githubusercontent.com/attogram/attogram-docs/master/games/games.png)](https://github.com/attogram/games)

The Attogram Games website builder is an easy way to setup a complete games website.

Every game included is open source and free to play!

Live Demo: **<https://fosiper.com/games/>**

## The Games

The Attogram Games website builder automates the installation
of the following games:

* 2048 Lite - <https://github.com/attogram/2048-lite>
* 3d.city - <https://github.com/lo-th/3d.city>
* Chess - <https://github.com/attogram/chess>
* Classic Pool Game - <https://github.com/henshmi/Classic-Pool-Game>
* Clumsy Bird - <https://github.com/ellisonleao/clumsy-bird>
* Dead Valley - <https://github.com/dmcinnes/dead-valley>
* Eight Queens - <https://github.com/attogram/EightQueens>
* Fire 'n Ice - <https://github.com/eugenioenko/fire-n-ice>
* HexGL Lite - <https://github.com/attogram/HexGL-lite>
* Hextris Lite - <https://github.com/attogram/hextris-lite>
* HTML5 Asteroids - <https://github.com/dmcinnes/HTML5-Asteroids>
* HTML5 Hearts - <https://github.com/yyjhao/html5-hearts>
* Hyperspace Garbage Collection - <https://github.com/razh/game-off-2013>
* Klotski - <https://github.com/SimonHung/Klotski>
* Life - <https://github.com/copy/life>
* Lode Runner Total Recall - <https://github.com/SimonHung/LodeRunner_TotalRecall>
* Mah-jongg - <https://github.com/tiansh/tjmj>
* Missile Game - <https://github.com/bwhmather/missile-game>
* pacman-lite - <https://github.com/attogram/pacman-lite>
* Paint Run 2 - <https://github.com/ahl389/paint-run2>
* Particle Clicker - <https://github.com/particle-clicker/particle-clicker>
* Phaser Cat - <https://github.com/DaxChen/phaser-cat> _(requires yarn)_
* The Pond - <https://github.com/Zolmeister/pond>
* Raging Gardens - <https://github.com/alunix/RagingGardensFB>
* Snakisms - <https://github.com/attogram/SNAKISMS-lite>
* Tap Tap Tap - <https://github.com/MahdiF/taptaptap>
* Tower - <https://github.com/iamkun/tower_game>
* Twisty Polyhedra - <https://github.com/aditya-r-m/twisty-polyhedra>
* Underrun - <https://github.com/phoboslab/underrun>
* Wolf3d - <https://github.com/jseidelin/wolf3d>

and some web musical instruments:

* Chordomatic - <https://github.com/kiprobinson/chordomatic>
* Javascript Piano - <https://github.com/mrcoles/javascript-piano>
* Virtual Piano - <https://github.com/otanim/virtual-piano>

## Installation

* You'll need `git` and `php` to install the Games Website
* You'll optionally need `composer` and `yarn` to install a few of the games
* Install the Games Website into a web accessible directory:
  * `git clone https://github.com/attogram/games.git games`
* Run the build script:
  * `cd games/_build`
  * `php build.php install`
* Open the new `index.html` and enjoy playing the games!

## How to customize

* Optional customization is easy with the `_build/custom/` directory
* Customize games list: copy `_build/games.php` to `_build/custom/games.php` and edit
* Customize page header: copy `_build/templates/header.php` to `_build/custom/header.php` and edit
* Customize page footer: copy `_build/templates/footer.php` to `_build/custom/footer.php` and edit
* Customize CSS: copy `_build/templates/css.css` to `_build/custom/css.css` and edit
* Rebuild with `php build.php install`

## License

* The Attogram Games website builder is an open source project licensed under the MIT License.
* The Attogram Games website builder automates the inclusion of many open source games,
  each with its own license.
* See each individual game directory for more information.

## More Info

<https://github.com/attogram/games>
