<?php
// Attogram Framework - Games Module - About v0.0.2

namespace Attogram;

$this->pageHeader('About the Games Site');


echo '<h1><a class="hlite" href="/">',$this->siteName,' <small>',GAMES_SITE_VERSION,'</small></a></h1>

<div class="container" style="background-color:#030303;color:white;">

<h3>About</h3>

<p>The Games Site is a collection of
<a class="hlite" href="https://opensource.org/">open source</a> web-based games,
gathered together into an
<a class="hlite" href="https://github.com/attogram/attogram">Attogram Framework</a> module.</p>

<ul>
<li><a class="hlite" href="https://github.com/attogram/games">Games Site GitHub Repository</a></li>
<li><a class="hlite" href="https://github.com/attogram/games/blob/master/README.md">Games Site README</a></li>
<li><a class="hlite" href="https://github.com/attogram/games/blob/master/LICENSE.md">Games Site LICENSE</a></li>
<li><a class="hlite" href="https://github.com/attogram/games/tree/master/licenses">Individual Game Licenses</a></li>
<li><a class="hlite" href="https://github.com/attogram/games/blob/master/TODO.md">Game Site TODO</a></li>

</ul>

</div>';

$this->pageFooter();
