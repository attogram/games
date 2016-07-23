<?php
// Attogram Framework - Games Module - About v0.0.1

namespace Attogram;

$this->pageHeader('About the Games Site');


echo '<h1><a href="/" class="hlite">',$this->siteName,' <small>',GAMES_SITE_VERSION,'</small></a></h1>

<div class="container" style="background-color:#030303;color:white;">

<h3>About</h3>

<p>The Games Site is a collection of open source games, gathered together into an
<a href="https://github.com/attogram/attogram">Attogram Framework</a> module.</p>

<ul>
<li><a href="https://github.com/attogram/games">Games Site GitHub Repository</a></li>
<li><a href="https://github.com/attogram/games/blob/master/README.md">Games Site README</a></li>
<li><a href="https://github.com/attogram/games/blob/master/LICENSE.md">Games Site LICENSE</a></li>
<li><a href="https://github.com/attogram/games/tree/master/licenses">Individual Game Licenses</a></li>
<li><a href="https://github.com/attogram/games/blob/master/TODO.md">Game Site TODO</a></li>

</ul>

</div>';

$this->pageFooter();
