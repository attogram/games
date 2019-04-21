<?php
// Attogram Games Website
// Build Script

const VERSION = '1.0.6';

print 'The Games Website ' . VERSION . "\n\n";

print "Loading Games list\n";
require_once 'games.php';
print 'Loaded ' . count($games) . " games\n";

$buildDirectory = __DIR__ . DIRECTORY_SEPARATOR;
$homeDirectory = realpath($buildDirectory . '..') . DIRECTORY_SEPARATOR;
$logoDirectory = $homeDirectory . '_logo' . DIRECTORY_SEPARATOR;

print "Build directory: $buildDirectory\n";
print "Home directory: $homeDirectory\n";
print "Logo directory: $logoDirectory\n\n";

print "Building index.html header\n\n";
$page = file_get_contents($buildDirectory . 'header.html');
$htmlTitle = $title ?? 'Attogram Games Website';
$page = str_replace('{{TITLE}}', $htmlTitle, $page);
$H1headline = $headline ?? 'Attogram Games Website';
$page = str_replace('{{HEADLINE}}', $H1headline, $page);

clearstatcache();

foreach ($games as $index => $game) {
    $gameDirectory = $homeDirectory . $index;
    print 'Checking submodule: ' . $game['name'] . ": $gameDirectory\n";
    if (!is_dir($gameDirectory)) {
        print 'Installing submodule: ' . $game['name'] . ": $gameDirectory\n";
        system('git submodule add ' . $game['git'] . ' ' . $index);
    }

    print "Building index.html menu: " . $game['name'] . "\n\n";

    $link = $index . '/';
    if (!empty($game['index'])) {
        $link .= $game['index'];
    }

    $mobile = $desktop = '';
    if (!empty($game['mobile'])) {
        $mobile = '📱';
    }
    if (!empty($game['desktop'])) {
        $desktop = '⌨'; // ⌨ 🖥️
    }
    $page .= '<a href="' . $link . '"><div class="game"><img src="_logo/'
        . (is_readable($logoDirectory . $index . '.png')
            ? $index . '.png'
            : 'game.png'
        )
        . '" width="100" height="100" alt="' . $game['name'] . '"><br />' . $game['name']
        . '<br /><small>' . $game['tag'] . '</small>'
        . '<br /><div class="platform">' . $desktop . ' ' . $mobile . '</div>'
        . '</div></a>';
}

print "Updating submodules\n\n";
system('git submodule update --init --recursive');

print "Building index.html footer\n\n";
$page .= file_get_contents($buildDirectory . 'footer.html');
$page = str_replace('{{VERSION}}', 'v' . VERSION, $page);

print "Writing {$homeDirectory}index.html\n\n";
$indexWrote = file_put_contents($homeDirectory . 'index.html', $page);
if (!$indexWrote) {
    print "ERROR writing {$homeDirectory}index.html\n";
}
print "Wrote $indexWrote characters\n\n";

print "DONE!\n\n";
