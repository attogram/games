<?php
/**
 * Games Website
 * Build Script
 */

const VERSION = '1.0.0';

print 'The Games Website ' . VERSION . "\n\n";

print "Loading Games list\n";
require_once 'games.php';
print 'Loaded ' . count($games) . " games\n";

$buildDirectory = __DIR__ . DIRECTORY_SEPARATOR;
$homeDirectory = realpath($buildDirectory . '..') . DIRECTORY_SEPARATOR;
$logoDirectory = $homeDirectory . 'logos' . DIRECTORY_SEPARATOR;

print "Build directory: $buildDirectory\n";
print "Home directory: $homeDirectory\n";
print "Logo directory: $logoDirectory\n\n";

print "Building index.html header\n\n";
$page = file_get_contents($buildDirectory . 'header.html');

clearstatcache();

foreach ($games as $index => $game) {
    $gameDirectory = $homeDirectory . $index;
    print 'Checking submodule: ' . $game['name'] . ": $gameDirectory\n";
    if (!is_dir($gameDirectory)) {
        print 'Installing submodule: ' . $game['name'] . ": $gameDirectory\n";
        system('git submodule add ' . $game['git'] . ' ' . $index);
    }
    print 'Updating submodule: ' . $game['name'] . ": $gameDirectory\n";
    system('git submodule update --init --recursive');

    print "Building index.html menu: " . $game['name'] . "\n\n";
    $page .= '<div class="game"><a href="' . $index . '/"><img src="'
        . (
            is_readable($logoDirectory . $index . '.png')
                ? 'logos/' . $index . '.png'
                : 'logos/game.png'
        )
        . '" width="100" height="100" alt="' . $game['name'] . '"></a><br /><a href="'
        . $index . '/">' . $game['name'] . '<br /><small>' . $game['tag'] . '</small></a></div>';
}

print "Building index.html footer\n\n";
$page .= file_get_contents($buildDirectory . 'footer.html');

print "Writing {$homeDirectory}index.html\n\n";
$indexWrote = file_put_contents($homeDirectory . 'index.html', $page);
if (!$indexWrote) {
    print "ERROR writing {$homeDirectory}index.html\n";
}
print "Wrote $indexWrote characters\n\n";

print "DONE!\n\n";
