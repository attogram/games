<?php
/**
 * Games Website
 * Build Script
 */
require_once 'games.php';

const VERSION = '1.0.0';

print 'The Games Website ' . VERSION . "\n";

$buildDirectory = __DIR__ . DIRECTORY_SEPARATOR;
$homeDirectory = realpath($buildDirectory . '..') . DIRECTORY_SEPARATOR;
$logoDirectory = $homeDirectory . 'logos' . DIRECTORY_SEPARATOR;

print "Build directory: $buildDirectory\n";
print "Home directory: $homeDirectory\n";
print "Logo directory: $logoDirectory\n";

print "Building /index.html - add header\n";
$page = file_get_contents($buildDirectory . 'header.html');

foreach ($games as $index => $game) {

    print 'Installing: ' . $game['name'] . " into /$index\n";
    
    // Install the game into its own directory, via git clone
    system('git clone ' . $game['git'] . ' ' . $index);

    print "Building index.html - add to menu: " . $game['name'] . "\n";
    $page .= '<div class="game"><a href="' . $index . '/"><img src="'
        . (
            is_readable($logoDirectory . $index . '.png')
                ? 'logos/' . $index . '.png'
                : 'logos/game.png'
        )
        . '" width="100" height="100" alt="' . $game['name'] . '"></a><br /><a href="'
        . $index . '/">' . $game['name'] . '<br /><small>' . $game['tag'] . '</small></a></div>';
}

print "Building index.html - add footer\n";
$page .= file_get_contents($buildDirectory . 'footer.html');

print "Writing $homeDirectory/index.html\n";
$indexWrote = file_put_contents($homeDirectory . 'index.html', $page);
if (!$indexWrote) {
    print "ERROR writing /index.html\n";
}
print "Wrote $indexWrote characters\n";

print "DONE!\n";
