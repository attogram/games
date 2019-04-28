<?php
// Attogram Games Website Builder - https://github.com/attogram/games

const VERSION = '2.0.1';

$buildTitle = 'Attogram Games Website';
print  "$buildTitle Builder v" . VERSION . "\n";

$enableGit  = true;  // Enable git clone, git pull
$writeEmbed = false; // write an embeddable HTML menu of games

$buildDirectory = __DIR__ . DIRECTORY_SEPARATOR;
print "BUILD DIRECTORY: $buildDirectory\n";
if (!is_dir($buildDirectory)) {
    exit("\nFATAL ERROR: Build Directory Not Found: $buildDirectory\n\n");
}

$gamesList = $buildDirectory . 'games.php';
if (!is_readable($gamesList)) {
    exit("\nFATAL ERROR: $gamesList NOT FOUND\n\n");
}
/** @noinspection PhpIncludeInspection */
require_once $gamesList;
print 'LOADING ' . count($games) . " GAMES\n";

$homeDirectory = realpath($buildDirectory . '..') . DIRECTORY_SEPARATOR;
print "HOME DIRECTORY: $homeDirectory\n";
if (!is_dir($homeDirectory)) {
    exit("\nFATAL ERROR: Home Directory Not Found: $homeDirectory\n\n");
}

$logoDirectory = $homeDirectory . '_logo' . DIRECTORY_SEPARATOR;
print "LOGO DIRECTORY: $logoDirectory\n";

$css = file_get_contents($buildDirectory . 'css.css');
$header = getHeader($buildDirectory, $title, $headline, $css, $buildTitle);
$footer = getFooter($buildDirectory);
$menu = '<div class="list">';
clearstatcache();

foreach ($games as $index => $game) {
    $gameDirectory = $homeDirectory . $index;
    print "GAME: {$game['name']} $gameDirectory {$game['git']}\n";
    if ($enableGit && !is_dir($gameDirectory)) {
        chdir($homeDirectory);
        syscall('git clone ' . $game['git'] . ' ' . $index);

        chdir($gameDirectory);
        if (!empty($game['build'])) {
            foreach ($game['build'] as $build) {
                syscall($build);
            }
        }
    }
    if (!chdir($gameDirectory)) {
        print "\nERROR: GAME DIRECTORY NOT FOUND: $gameDirectory\n\n";
        continue;
    }
    if ($enableGit) {
        syscall('git pull');
    }
    $menu .= getGameMenu($index, $game, $logoDirectory);
}

$menu .= '</div>';

write($homeDirectory . 'index.html', $header . $menu . $footer);

if ($writeEmbed) {
    write($homeDirectory . 'games.html', "<style>$css</style>$menu\n");
}

/**
 * @param string $command
 */
function syscall(string $command) {
    print "SYSTEM: $command\n";
    system($command);
}

/**
 * @param string $filename
 * @param string $contents
 */
function write(string $filename, string $contents)
{
    print "WRITING $filename\n";
    $wrote = file_put_contents($filename, $contents);
    print "WROTE $wrote CHARACTERS\n";
    if (!$wrote) {
        print "ERROR WRITING TO $filename\n";
        print "DUMPING:\n\n\n$contents\n\n\n";
    }
}

/**
 * @param string $index
 * @param array $game
 * @param string $logoDirectory
 * @return string
 */
function getGameMenu(string $index, array $game, string $logoDirectory)
{
    $menu = '';
    $link = $index . '/';
    if (!empty($game['index'])) {
        $link .= $game['index'];
    }
    $mobile = '';
    $desktop = '';
    if (!empty($game['mobile'])) {
        $mobile = '&#128241;'; // 📱
    }
    if (!empty($game['desktop'])) {
        $desktop = '&#9000;'; // ⌨
    }
    $logo = is_readable($logoDirectory . $index . '.png')
        ? $index . '.png'
        : 'game.png';
    $menu .= '<a href="' . $link . '"><div class="game"><img src="_logo/' . $logo
        . '" width="100" height="100" alt="' . $game['name'] . '"><br />' . $game['name']
        . '<br /><small>' . $game['tag'] . '</small>'
        . '<br /><div class="platform">' . $desktop . ' ' . $mobile . '</div>'
        . '</div></a>';

    return $menu;
}


/**
 * @param string $buildDirectory
 * @param string $title
 * @param string $headline
 * @param string $css
 * @param string $buildTitle
 * @return string
 */
function getHeader(
    string $buildDirectory,
    string $title,
    string $headline,
    string $css,
    string $buildTitle
) {
    $header = file_get_contents($buildDirectory . 'header.html');
    $htmlTitle = $title ?? $buildTitle;
    $H1headline = $headline ?? $htmlTitle;
    $header = str_replace('{{TITLE}}', $htmlTitle, $header);
    $header = str_replace('{{HEADLINE}}', $H1headline, $header);
    $header = str_replace('{{CSS}}', "<style>$css</style>", $header);

    return $header ?? '';
}

/**
 * @param string $buildDirectory
 * @return string
 */
function getFooter(string $buildDirectory)
{
    $footer = file_get_contents($buildDirectory . 'footer.html');
    $footer = str_replace('{{VERSION}}', 'v' . VERSION, $footer);

    return $footer ?? '';
}
