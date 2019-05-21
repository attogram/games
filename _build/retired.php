<?php
/**
 * Retired Games
 *
 * Games that used to be on the main list
 * preserved here for possible future use
 */

declare(strict_types = 1);

$retiredGames = [
    'phaser-cat' => [
        'name'    => 'Phaser Cat',
        'tag'     => 'fighting feline',
        'git'     => 'https://github.com/DaxChen/phaser-cat.git',
        'require' => ['yarn'],
        'build'   => ['yarn install', 'yarn run deploy'],
        'mobile'  => false,
        'desktop' => true,
    ],
    '8queens' => [
        'name'    => '8 Queens',
        'tag'     => 'chess puzzle',
        'git'     => 'https://github.com/attogram/8queens.git',
        'require' => ['composer'],
        'build'   => ['composer install'],
        'mobile'  => false,
        'desktop' => true,
    ],
    'pacman' => [
        'name' => 'pacman',
        'tag' => 'eat the dots',
        'git' => 'https://github.com/mumuy/pacman.git',
        'mobile' => false,
        'desktop' => true,
    ],
    'polybranch' => [
        'name'    => 'PolyBranch',
        'tag'     => 'fly thru trees',
        'git'     => 'https://github.com/gbatha/PolyBranch.git',
        'index'   => 'polybranchweb/',
        'mobile'  => false,
        'desktop' => true,
    ],
];
