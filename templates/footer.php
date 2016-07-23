<?php
// Attogram Framework - Games Site Module - Page Footer v0.0.2

namespace Attogram;

$divider = '&nbsp;&nbsp; | &nbsp;&nbsp;';

echo '<footer class="footer"><div class="container-fluid"><p><small>',
    '<span style="white-space:nowrap"><a href="https://github.com/attogram/games">',
    $this->siteName,
    '</a></span>',
    $divider,
    '<span style="white-space:nowrap">🚀 Powered by <a target="github" href="',
    $this->projectRepository,
    '">Attogram <small>v',
    attogram::ATTOGRAM_VERSION,
    '</small></a></span>',
    $divider,
    '<span style="white-space: nowrap">🕑 ',
    gmdate('Y-m-d H:i:s'),
    ' UTC</span>',
    $divider,
    '<span style="white-space: nowrap">👤 ',
    $this->request->getClientIp(),
    '</span>',
    $divider,
    '<span style="white-space: nowrap">🏁 ',
    round((microtime(true) - $this->startTime), 6, PHP_ROUND_HALF_UP),
    ' seconds</span></small></p></div></footer></body></html>';
