<?php
// Attogram Games Website
// Build Script

const VERSION = '1.1.3';

print 'Attogram Games Website Build Script ' . VERSION . "\n";

//print "Loading Games list\n";
require_once 'games.php';
print 'Loaded ' . count($games) . " games\n";

$buildDirectory = __DIR__ . DIRECTORY_SEPARATOR;
print "Build directory: $buildDirectory\n";

$homeDirectory = realpath($buildDirectory . '..') . DIRECTORY_SEPARATOR;
print "Home directory: $homeDirectory\n";

if (!@chdir($homeDirectory)) {
    print "\nERROR: can not change directory to: $homeDirectory\n\n";

    return;
}

$logoDirectory = $homeDirectory . '_logo' . DIRECTORY_SEPARATOR;
print "Logo directory: $logoDirectory\n";

//print "Building index.html header\n\n";
$page = file_get_contents($buildDirectory . 'header.html');
$htmlTitle = $title ?? 'Attogram Games Website';
$page = str_replace('{{TITLE}}', $htmlTitle, $page);
$H1headline = $headline ?? 'Attogram Games Website';
$page = str_replace('{{HEADLINE}}', $H1headline, $page);

//print "Clearing stat cache\n\n";
clearstatcache();

syscall('git submodule update --init --recursive');

foreach ($games as $index => $game) {
    $gameDirectory = $homeDirectory . $index;

    print 'Game: ' . $game['name'] . ": $gameDirectory\n";

    if (!is_dir($gameDirectory)) {
        print "Installing game\n";
        syscall('git submodule add ' . $game['git'] . ' ' . $index);
        syscall('git submodule init');
    }

    if (!@chdir($gameDirectory)) {
        print "\nERROR: can not change directory to: $gameDirectory\n\n";
        continue;
    }

    if (!empty($game['composer']) && $game['composer']) {
        syscall('composer install');
    }

    //print "Building index.html menu: " . $game['name'] . "\n\n";
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

chdir($homeDirectory);
syscall('git submodule update --init --recursive');
//syscall('git submodule foreach git pull origin master');


//print "Building index.html footer\n\n";
$page .= file_get_contents($buildDirectory . 'footer.html');
$page = str_replace('{{VERSION}}', 'v' . VERSION, $page);

print "Writing {$homeDirectory}index.html\n";
$indexWrote = file_put_contents($homeDirectory . 'index.html', $page);
print "Wrote $indexWrote characters\n\n";

if (!$indexWrote) {
    print "ERROR writing to {$homeDirectory}index.html\n";
    print "DUMPING index.html\n\n\n";
    print $page . "\n\n\n";
}


/**
 * @param string $command
 */
function syscall(string $command) {
    print "Command: $command\n";
    system($command);
}
