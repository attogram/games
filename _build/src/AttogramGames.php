<?php
/**
 * Attogram Games
 * https://github.com/attogram/games
 */
declare(strict_types = 1);

namespace Attogram\Games;

use Exception;

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
    const VERSION = '4.0.3';

    /** @var string */
    private $title;
    /** @var string */
    private $headline;
    /** @var bool */
    private $enableInstall;
    /** @var bool */
    private $enableUpdate;
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
        global $argc;

        $this->title = 'Attogram Games Website';
        $this->verbose("\n{$this->title} Builder v" . self::VERSION);
        $this->verbose('');
        if ($argc === 1) {
            $this->verbose('Usage: php build.php [options]');
            $this->verbose('Options:');
            $this->verbose('    install  - Install games (git clone, build steps, write index.html)');
            $this->verbose('    update   - Update games (git pull, build steps, write index.html)');
            $this->verbose('    embed    - write embeddable menu file games.html');
            $this->verbose('    index    - write index.html');

            return;
        }
        $this->initOptions();
        $this->initDirectories();
        $this->initConfig();
        $this->initGamesList();
        if ($this->enableInstall) {
            $this->installGames();
        }
        if ($this->enableUpdate) {
            $this->updateGames();
        }
        $this->initTemplates();
        $this->buildMenu();
        $this->buildIndex();
    }

    private function initOptions()
    {
        global $argv;

        $this->enableInstall = in_array('install', $argv) ? true : false;
        $this->verbose('INSTALLS: ' . ($this->enableInstall ? 'Enabled' : 'Disabled'));
        $this->enableUpdate = in_array('update', $argv) ? true : false;
        $this->verbose('UPDATES: ' . ($this->enableUpdate ? 'Enabled' : 'Disabled'));
        $this->enableEmbed = in_array('embed', $argv) ? true : false;
        $this->verbose('WRITE EMBED: ' . ($this->enableEmbed ? 'Enabled' : 'Disabled'));
        $this->verbose('WRITE INDEX: Enabled'); // always write index.html
        $this->verbose('');
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
        $this->verbose('');
    }

    /**
     * @throws Exception
     */
    private function initConfig()
    {
        global $title, $headline;
        $configFile = 'config.php';

        $configuration = is_readable($this->customDirectory . $configFile)
            ? $this->customDirectory . $configFile
            : $this->buildDirectory . $configFile;
        $this->verbose('CONFIGURATION: ' . $configuration);
        if (!is_readable($configuration)) {
            throw new Exception('CONFIGURATION NOT FOUND: ' . $configuration);
        }
        /** @noinspection PhpIncludeInspection */
        require_once $configuration;

        $this->title = (!empty($title) && is_string($title))
            ? $title
            : $this->title;
        $this->headline = (!empty($headline) && is_string($headline))
            ? $headline
            : $this->title;
        $this->verbose('PAGE TITLE: ' . $this->title);
        $this->verbose('PAGE HEADLINE: ' . htmlentities($this->headline));
    }

    /**
     * @throws Exception
     */
    private function initGamesList()
    {
        global $games;

        $gamesFile = 'games.php';
        $gamesList = is_readable($this->customDirectory . $gamesFile)
            ? $this->customDirectory . $gamesFile
            : $this->buildDirectory . $gamesFile;
        $this->verbose('GAMES LIST: ' . $gamesList);
        if (!is_readable($gamesList)) {
            throw new Exception('GAMES LIST NOT FOUND: ' . $gamesList);
        }
        /** @noinspection PhpIncludeInspection */
        require_once $gamesList;

        $this->games = (!empty($games) && is_array($games))
            ? $games
            : [];
        $this->verbose('GAMES COUNT: ' . count($this->games));
        $this->verbose('');
    }

    private function installGames()
    {
        foreach ($this->games as $gameIndex => $game) {
            $gameDirectory = $this->homeDirectory . $gameIndex;
            if (is_dir($gameDirectory)) {
                $this->verbose("INSTALLED: $gameIndex: $gameDirectory");
                continue;
            }
            $this->verbose("INSTALLING: $gameIndex: $gameDirectory");
            chdir($this->homeDirectory);
            $this->syscall('git clone ' . $game['git'] . ' ' . $gameIndex);
            if (!empty($game['branch'])) {
                chdir($gameDirectory);
                $this->syscall('git checkout ' . $game['branch']);
            }
            $this->buildSteps($gameIndex, $game);
        }
    }

    /**
     * @param string $gameIndex
     * @param array $game
     */
    private function buildSteps(string $gameIndex, array $game)
    {
        $gameDirectory = $this->homeDirectory . $gameIndex;
        if (!chdir($gameDirectory)) {
            $this->verbose('ERROR: GAME DIRECTORY NOT FOUND: ' . $gameDirectory);

            return;
        }
        if (empty($game['build'])) {
            return;
        }
        foreach ($game['build'] as $step) {
            $this->syscall($step);
        }
    }

    private function updateGames()
    {
        foreach ($this->games as $gameIndex => $game) {
            $gameDirectory = $this->homeDirectory . $gameIndex;
            $this->verbose('UPDATING: ' . $gameIndex);
            if (!chdir($gameDirectory)) {
                $this->verbose('ERROR: GAME DIRECTORY NOT FOUND: ' . $gameDirectory);
                continue;
            }
            $this->syscall('git pull');
            $this->buildSteps($gameIndex, $game);
        }
    }

    /**
     * @throws Exception
     */
    private function initTemplates()
    {
        $this->css = $this->getTemplate('css.css');
        $this->header = $this->getTemplate('header.html');
        $this->header = $this->transposeTemplate($this->header);
        $this->footer = $this->getTemplate('footer.html');
        $this->footer = $this->transposeTemplate($this->footer);
    }

    /**
     * @param string $file
     * @return string
     */
    private function getTemplate(string $file): string
    {
        $custom = is_readable($this->customDirectory . $file)
            ? file_get_contents($this->customDirectory . $file)
            : file_get_contents($this->templatesDirectory . $file);

        return $custom ?? '';
    }

    /**
     * @param string $template
     * @return string
     * @throws Exception
     */
    private function transposeTemplate(string $template): string
    {
        $template = str_replace('{{CSS}}', $this->css, $template);
        $template = str_replace('{{TITLE}}', $this->title, $template);
        $template = str_replace('{{HEADLINE}}', $this->headline, $template);
        $template = str_replace('{{VERSION}}', 'v' . self::VERSION, $template);
        $template = str_replace('{{DATETIME_UTC}}', gmdate('Y-m-d H:i:s'), $template);

        return $template;
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
        $this->verbose("WRITING $filename");
        $wrote = file_put_contents($filename, $contents);
        $this->verbose("WROTE $wrote CHARACTERS");
        if (!$wrote) {
            $this->verbose("ERROR WRITING TO $filename");
            $this->verbose("DUMPING:\n\n$contents\n\n");
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
