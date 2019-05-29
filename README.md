# Attogram Games website builder

Your own games website, filled with open source goodness!

[![Games Website](https://raw.githubusercontent.com/attogram/attogram-docs/master/games/games.png)](https://github.com/attogram/games)

The Attogram Games website builder is an easy way to setup
a complete games website.  Every game included is open source
and free to play!

* Live Demo: **<https://fosiper.com/games/>**

* Main Repository: **<https://github.com/attogram/games>**

## The Games

The Attogram Games website builder automates the installation
of the following web games:

* 2048 - <https://github.com/attogram/2048-lite>
* 3d.city - <https://github.com/lo-th/3d.city>
* Chess - <https://github.com/attogram/chess>
* Classic Pool Game - <https://github.com/henshmi/Classic-Pool-Game>
* Clumsy Bird - <https://github.com/ellisonleao/clumsy-bird>
* Dead Valley - <https://github.com/dmcinnes/dead-valley>
* Eight Queens - <https://github.com/attogram/EightQueens> _<sup>(branch: gh-pages)</sup>_
* Fire 'n Ice - <https://github.com/eugenioenko/fire-n-ice>
* HexGL - <https://github.com/attogram/HexGL-lite>
* Hextris - <https://github.com/attogram/hextris-lite>
* HTML5 Asteroids - <https://github.com/dmcinnes/HTML5-Asteroids>
* HTML5 Hearts - <https://github.com/yyjhao/html5-hearts>
* The House - <https://github.com/arturkot/the-house-game>
* Hyperspace Garbage Collection - <https://github.com/razh/game-off-2013>
* Mah-jongg - <https://github.com/tiansh/tjmj>
* Missile Game - <https://github.com/bwhmather/missile-game>
* NS-Shaft - <https://github.com/iPel/NS-SHAFT>
* pacman - <https://github.com/attogram/pacman-lite>
* Paint Run 2 - <https://github.com/ahl389/paint-run2> _<sup>(branch: gh-pages)</sup>_
* Particle Clicker - <https://github.com/particle-clicker/particle-clicker>
* The Pond - <https://github.com/attogram/pond-lite>
* Raging Gardens - <https://github.com/alunix/RagingGardensFB>
* Snakisms - <https://github.com/pippinbarr/SNAKISMS> _<sup>(branch: clean)</sup>_
* Tap Tap Tap - <https://github.com/MahdiF/taptaptap>
* Tower - <https://github.com/iamkun/tower_game>
* Twisty Polyhedra - <https://github.com/aditya-r-m/twisty-polyhedra>
* Underrun - <https://github.com/phoboslab/underrun>

and some web playgrounds:

* Colorful Life - <https://github.com/attogram/colorful-life-lite>
* Life - <https://github.com/copy/life>

and some web musical instruments:

* Chordomatic - <https://github.com/kiprobinson/chordomatic>
* Javascript Piano - <https://github.com/mrcoles/javascript-piano>
* Virtual Piano - <https://github.com/otanim/virtual-piano>

## Inclusion Critera

Eligibility requirements for game inclusion:

* The game must be explicitly licensed under a Open Source license.
* The game must be playable via a web browser.

## Installation

* You need `git` and `php` to install the Games Website
* Install the Games Website into a web accessible directory:
  * `git clone https://github.com/attogram/games.git games`
* Run the build script:
  * `cd games/_build`
  * `php build.php install`
* Open the new `index.html` and enjoy playing the games!

## How to customize

* Optional customization is easy with the `_build/custom/` directory
* Customize games list: copy `_build/games.php` to `_build/custom/games.php` and edit
* Customize title and headline: copy `_build/config.php` to `_build/custom/config.php` and edit
* Customize HTML page header: copy `_build/templates/header.php` to `_build/custom/header.php` and edit
* Customize HTML page footer: copy `_build/templates/footer.php` to `_build/custom/footer.php` and edit
* Customize CSS: copy `_build/templates/css.css` to `_build/custom/css.css` and edit
* Rebuild with `php build.php install`

## License

* The Attogram Games website builder is an open source project licensed under the MIT License.
* The Attogram Games website builder automates the inclusion of many open source games,
  each with its own license.
* See each individual game directory for more information.

## Clean Repo: Games

* Attogram Games supports the
 [Clean Repo: Games](https://github.com/attogram/clean-repo-games) project.
