<?php
// Attogram Framework - Games Module - Home v0.0.2

namespace Attogram;

$this->pageHeader('Games');

echo '<div class="container-fluid" style="background-color:#030303;">
<div class="row hprow">

 <div class="col-sm-3 hpcol" style="background-color:black;">
  <a href="pond/"><img src="web/pond/logo.png" width="178" height="100" alt="The Pond"></a>
  <br /><br /><a href="pond/">A narrow fellow in the Pond</a>
 </div>

 <div class="col-sm-3 hpcol" style="background-color:black;">
  <a href="hextris/"><img src="web/hextris/logo.png" width="100" height="100" alt="Hextris"></a>
  <br /><br /><a href="hextris/">Hextris</a>
 </div>

 <div class="col-sm-3 hpcol" style="background-color:black;">
  <a href="particle-clicker/"><img src="web/particle-clicker/logo.png" width="125" height="114" alt="Particle Clicker"></a>
  <br /><br /><a href="particle-clicker/">Particle Clicker</a>
 </div>

 <div class="col-sm-3 hpcol" style="background-color:black;">
  <a href="candyjam/"><img src="web/candyjam/logo.png" width="150" width="119" alt="Candy Jam"></a>
  <br /><br /><a href="candyjam/">Dental Defender: Saga of the Candy Horde</a>
 </div>

</div>
<div class="row hprow">

 <div class="col-sm-3 hpcol" style="background-color:black;">
  <a href="polybranch/"><img src="web/polybranch/logo.png" width="100" height="100" alt="PolyBranch"></a>
  <br /><br /><a href="polybranch/">PolyBranch</a>
 </div>

 <div class="col-sm-3 hpcol">coming soon...</div>
 <div class="col-sm-3 hpcol">coming soon...</div>
 <div class="col-sm-3 hpcol">coming soon...</div>
</div>
';

echo '</div>';

$this->pageFooter();
