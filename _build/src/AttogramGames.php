<?php
declare(strict_types = 1);

namespace Attogram\Games;

use Exception;

use function array_keys;
use function chdir;
use function count;
use function file_get_contents;
use function file_put_contents;
use function htmlentities;
use function in_array;
use function is_dir;
use function is_readable;
use function is_string;
use function realpath;
use function str_replace;
use function strlen;
use function system;

class AttogramGames
{
    const VERSION = '3.0.4';

    /** @var string */
    private $title;
    /** @var string */
    private $headline;
    /** @var bool */
    private $enableGitClone;
    /** @var bool */
    private $enableGitPull;
    /** @var bool */
    private $enableEmbed;
    /** @var string */
    private $buildDirectory;
    /** @var string */
    private $homeDirectory;
    /** @var string */
    private $logoDirectory;
    /** @var string */
    private $templatesDirectory;
    /** @var string */
    private $customDirectory;
    /** @var array */
    private $games;
    /* @var string */
    private $menu;
    /* @var string */
    private $css;
    /* @var string */
    private $header;
    /* @var string */
    private $footer;

    /**
     * AttogramGames constructor.
     * @throws Exception
     */
    public function __construct()
    {
        $this->title = 'Attogram Games Website';
        $this->verbose("\n{$this->title} Builder v" . self::VERSION);
        $this->initOptions();
        $this->initDirectories();
        $this->initGamesList();
        if ($this->enableGitClone) {
            $this->installGames();
        }
        if ($this->enableGitPull) {
            $this->updateGames();
        }
        $this->initTemplates();
        $this->buildMenu();
        $this->buildIndex();
    }

    private function initOptions()
    {
        global $argv;

        $this->enableGitClone = in_array('nogit', $argv) ? false : true;
        $this->verbose('GIT CLONE: ' . ($this->enableGitClone ? 'Enabled' : 'Disabled'));

        $this->enableGitPull = in_array('nogit', $argv) || in_array('nopull', $argv) ? false : true;
        $this->verbose('GIT PULL: ' . ($this->enableGitPull ? 'Enabled' : 'Disabled'));

        $this->enableEmbed = in_array('embed', $argv) ? true : false;
        $this->verbose('WRITE EMBED: ' . ($this->enableEmbed ? 'Enabled' : 'Disabled'));
    }

    /**
     * @throws Exception
     */
    private function initDirectories()
    {
        $this->buildDirectory = realpath(__DIR__ . DIRECTORY_SEPARATOR . '..') . DIRECTORY_SEPARATOR;
        $this->verbose('BUILD: ' . $this->buildDirectory);
        if (!is_dir($this->buildDirectory)) {
            throw new Exception('BUILD DIRECTORY NOT FOUND: ' . $this->buildDirectory);
        }

        $this->templatesDirectory = $this->buildDirectory . 'templates' . DIRECTORY_SEPARATOR;
        $this->verbose('TEMPLATES: ' . $this->templatesDirectory);

        $this->customDirectory = $this->buildDirectory . 'custom' . DIRECTORY_SEPARATOR;
        $this->verbose('CUSTOM: ' . $this->customDirectory);

        $this->homeDirectory = realpath($this->buildDirectory . '..') . DIRECTORY_SEPARATOR;
        $this->verbose('HOME: ' . $this->homeDirectory);
        if (!is_dir($this->homeDirectory)) {
            throw new Exception('HOME DIRECTORY NOT FOUND: ' . $this->homeDirectory);
        }

        $this->logoDirectory = $this->homeDirectory . '_logo' . DIRECTORY_SEPARATOR;
        $this->verbose('LOGO: ' . $this->logoDirectory);
    }

    /**
     * @throws Exception
     */
    private function initGamesList()
    {
        global $games, $title, $headline;

        $gamesFile = 'games.php';
        $gamesConfigFile = is_readable($this->customDirectory . $gamesFile)
            ? $this->customDirectory . $gamesFile
            : $this->buildDirectory . $gamesFile;
        $this->verbose('GAMES CONFIG: ' . $gamesConfigFile);
        if (!is_readable($gamesConfigFile)) {
            throw new Exception('GAMES CONFIG NOT FOUND: ' . $gamesConfigFile);
        }
        /** @noinspection PhpIncludeInspection */
        require_once $gamesConfigFile;

        $this->games = (!empty($games) && is_array($games))
            ? $games
            : [];
        $this->title = (!empty($title) && is_string($title))
            ? $title
            : $this->title;
        $this->headline = (!empty($headline) && is_string($headline))
            ? $headline
            : $this->title;
        $this->verbose('GAMES COUNT: ' . count($this->games));
        $this->verbose('PAGE TITLE: ' . $this->title);
        $this->verbose('PAGE HEADLINE: ' . htmlentities($this->headline));
    }

    private function installGames()
    {
        foreach ($this->games as $gameIndex => $game) {
            $gameDirectory = $this->homeDirectory . $gameIndex;
            if (is_dir($gameDirectory)) {
                continue;
            }
            $this->verbose("INSTALLING: $gameIndex: $gameDirectory");

            chdir($this->homeDirectory);
            $this->syscall('git clone ' . $game['git'] . ' ' . $gameIndex);

            if (!empty($game['build'])) {
                if (!chdir($gameDirectory)) {
                    $this->verbose('ERROR: GAME DIRECTORY NOT FOUND: ' . $gameDirectory);
                    continue;
                }
                foreach ($game['build'] as $build) {
                    $this->syscall($build);
                }
            }
        }
    }

    private function updateGames()
    {
        foreach (array_keys($this->games) as $gameIndex) {
            $gameDirectory = $this->homeDirectory . $gameIndex;
            $this->verbose('UPDATING: ' . $gameIndex);
            if (!chdir($gameDirectory)) {
                $this->verbose('ERROR: GAME DIRECTORY NOT FOUND: ' . $gameDirectory);
                continue;
            }
            $this->syscall('git pull');
        }
    }

    private function initTemplates()
    {
        $cssFile = 'css.css';
        $this->css = is_readable($this->customDirectory . $cssFile)
            ? file_get_contents($this->customDirectory . $cssFile)
            : file_get_contents($this->templatesDirectory . $cssFile);

        $headerFile = 'header.html';
        $this->header = is_readable($this->customDirectory . $headerFile)
            ? file_get_contents($this->customDirectory . $headerFile)
            : file_get_contents($this->templatesDirectory . $headerFile);
        $this->header = str_replace('{{CSS}}', "<style>{$this->css}</style>", $this->header);
        $this->header = str_replace('{{TITLE}}', $this->title, $this->header);
        $this->header = str_replace('{{HEADLINE}}', $this->headline, $this->header);

        $footerFile = 'footer.html';
        $this->footer = is_readable($this->customDirectory . $footerFile)
            ? file_get_contents($this->customDirectory . $footerFile)
            : file_get_contents($this->templatesDirectory . $footerFile);
        $this->footer = str_replace('{{VERSION}}', 'v' . self::VERSION, $this->footer);
    }

    private function buildMenu()
    {
        $this->menu = '<div class="list">';
        foreach ($this->games as $gameIndex => $game) {
            $this->menu .= $this->getGameMenu($gameIndex, $game);
        }
        $this->menu .= '</div>';
        $this->verbose('BUILT MENU: ' . strlen($this->menu) . ' characters');

        if ($this->enableEmbed) {
            $this->write(
                $this->homeDirectory . 'games.html',
                "<style>{$this->css}</style>{$this->menu}\n"
            );
        }
    }

    /**
     * @param string $gameIndex
     * @param array $game
     * @return string
     */
    private function getGameMenu(string $gameIndex, array $game): string
    {
        $link = empty($game['index'])
            ? $gameIndex . '/'
            : $gameIndex . '/' . $game['index'];
        $mobile = empty($game['mobile'])
            ? ''
            : '&#128241;'; // 📱
        $desktop = empty($game['desktop'])
            ? ''
            : '&#9000;'; // ⌨
        $logo = is_readable($this->logoDirectory . $gameIndex . '.png')
            ? $gameIndex . '.png'
            : 'game.png';

        return '<a href="' . $link . '"><div class="game"><img src="_logo/' . $logo
            . '" width="100" height="100" alt="' . $game['name'] . '"><br />' . $game['name']
            . '<br /><small>' . $game['tag'] . '</small>'
            . '<br /><div class="platform">' . $desktop . ' ' . $mobile . '</div>'
            . '</div></a>';
    }

    private function buildIndex()
    {
        $this->write(
            $this->homeDirectory . 'index.html',
            $this->header . $this->menu . $this->footer
        );
    }

    /**
     * @param string $command
     */
    private function syscall(string $command)
    {
        $this->verbose('SYSTEM: ' . $command);
        system($command);
    }

    /**
     * @param string $filename
     * @param string $contents
     */
    private function write(string $filename, string $contents)
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
     * @param string $message
     */
    private function verbose(string $message)
    {
        print $message . "\n";
    }
}
