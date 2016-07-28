<?php
// Attogram Framework - Games Module - Home v0.0.7

namespace Attogram;

$this->pageHeader('Games Site');

echo '<h1><a href="about/" class="hlite">',$this->siteName,' <small>',GAMES_SITE_VERSION,'</small></a></h1>

<div class="container-fluid" style="background-color:#030303;">

<div class="row hprow">

 <div class="col-sm-3 col-xs-6 hpcol" style="background-color:black;">
  <a href="pond/"><img src="web/pond/logo.png" class="ihlite" width="100" height="100" alt="The Pond"></a>
  <br /><a href="pond/" class="hlite">The Pond
  <br /><small>A narrow fellow in the Pond</small></a>
 </div>

 <div class="col-sm-3 col-xs-6 hpcol" style="background-color:black;">
  <a href="hextris/"><img src="web/hextris/logo.png" class="ihlite" width="100" height="100" alt="Hextris"></a>
  <br /><a href="hextris/" class="hlite">Hextris
  <br /><small>Hexagonal tetris</small></a>
 </div>

 <div class="clearfix visible-xs-block"></div>

 <div class="col-sm-3 col-xs-6 hpcol" style="background-color:black;">
  <a href="particle-clicker/"><img src="web/particle-clicker/logo.png" class="ihlite" width="100" height="100" alt="Particle Clicker"></a>
  <br /><a href="particle-clicker/" class="hlite">Particle Clicker
  <br /><small>Particle detector simulator</small></a>
 </div>

 <div class="col-sm-3 col-xs-6 hpcol" style="background-color:black;">
  <a href="hexgl/"><img src="web/hexgl/logo.png" class="ihlite" width="100" height="100" alt="HexGL"></a>
  <br /><a href="hexgl/" class="hlite">HexGL
  <br /><small>racing</small></a>
 </div>

</div>
<div class="row hprow">

 <div class="col-sm-3 col-xs-6 hpcol" style="background-color:black;">
  <a href="dental-defender/"><img src="web/dental-defender/logo.png" class="ihlite" width="100" width="100" alt="Candy Jam"></a>
  <br /><a href="dental-defender/" class="hlite">Dental Defender
  <br /><small>Saga of the Candy Horde</small></a>
 </div>

 <div class="col-sm-3 col-xs-6 hpcol" style="background-color:black;">
  <a href="polybranch/"><img src="web/polybranch/logo.png" class="ihlite" width="100" height="100" alt="PolyBranch"></a>
  <br /><a href="polybranch/" class="hlite">PolyBranch
  <br /><small>Fly through the branches</small></a>
 </div>

 <div class="clearfix visible-xs-block"></div>

 <div class="col-sm-3 col-xs-6 hpcol" style="background-color:black;">
  <a href="8queens/"><img src="web/8queens/logo.png" class="ihlite" width="100" height="100" alt="8 Queens"></a>
  <br /><a href="8queens/" class="hlite">8 Queens
  <br /><small>Chess Puzzle</small></a>
 </div>

 <div class="col-sm-3 col-xs-6 hpcol"></div>
</div>

';

echo '</div>';

$this->pageFooter();
