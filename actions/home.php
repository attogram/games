<?php
// Attogram Framework - Games Module - Home v0.0.1

namespace Attogram;

$this->pageHeader('Games');

echo '<div class="container" style="background-color:#030303;">';

echo '
<style>
.hprow {
  padding:0;
  margin:0;
}
.hpcol {
  padding:30px;
  margin:0px;
  background-color:black;
  text-align: center;
}
</style>

<div class="row hprow">

 <div class="col-sm-4 hpcol" style="background-color:black;">
  <a href="pond/"><img src="web/pond/assets/logo-small.png" width="180" alt="The Pond"></a>
  <br /><br /><a href="pond/"><small>A narrow fellow in the Pond</small></a>
 </div>

 <div class="col-sm-4 hpcol" style="background-color:black;">
  <a href="hextris/"><img src="web/hextris/images/logo_android.png" width="120" alt="Hextris"></a>
  <br /><a href="hextris/"><small>Hextris</small></a>
 </div>

 <div class="col-sm-4 hpcol">coming soon...</div>
</div>
<div class="row hprow">
 <div class="col-sm-4 hpcol">coming soon...</div>
 <div class="col-sm-4 hpcol">coming soon...</div>
 <div class="col-sm-4 hpcol">coming soon...</div>
</div>
';

echo '</div>';

$this->pageFooter();
