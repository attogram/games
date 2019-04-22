<?php
// Attogram Games Website
// Build Script

const VERSION = '1.2.2';

$title = 'Attogram Games Website';
print  "$title " . VERSION . " - Build Script\n";

$enableGit = true;
$enableComposer = true;

require_once 'games.php';
print 'Loading ' . count($games) . " games\n";

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

$page = file_get_contents($buildDirectory . 'header.html');
$htmlTitle = $title ?? $title;
$page = str_replace('{{TITLE}}', $htmlTitle, $page);
$H1headline = $headline ?? $title;
$page = str_replace('{{HEADLINE}}', $H1headline, $page);

clearstatcache();

foreach ($games as $index => $game) {
    $gameDirectory = $homeDirectory . $index;

    print 'Game: ' . $game['name'] . ": $gameDirectory\n";

    if (!is_dir($gameDirectory)) {
        chdir($homeDirectory);
        syscall('git clone ' . $game['git'] . ' ' . $index);
    }

    if (!@chdir($gameDirectory)) {
        print "\nERROR: can not change directory to: $gameDirectory\n\n";
        continue;
    }

    syscall('git pull');

    if (!empty($game['composer']) && $game['composer'] && $enableComposer) {
        syscall('composer install');
    }

    $link = $index . '/';
    if (!empty($game['index'])) {
        $link .= $game['index'];
    }
    $mobile = $desktop = '';
    if (!empty($game['mobile'])) {
        $mobile = '📱';
    }
    if (!empty($game['desktop'])) {
        $desktop = '⌨';
    }
    $logo = is_readable($logoDirectory . $index . '.png')
        ? $index . '.png'
        : 'game.png';
    $page .= '<a href="' . $link . '"><div class="game"><img src="_logo/' . $logo
        . '" width="100" height="100" alt="' . $game['name'] . '"><br />' . $game['name']
        . '<br /><small>' . $game['tag'] . '</small>'
        . '<br /><div class="platform">' . $desktop . ' ' . $mobile . '</div>'
        . '</div></a>';
}

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
    print "SYSTEM: $command\n";
    system($command);
}
