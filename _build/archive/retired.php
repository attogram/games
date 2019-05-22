<?php
declare(strict_types = 1);

/**
 * Retired Games
 *
 * Game Repos that honourably served on the Games List
 */
$retiredGames = [
    'phaser-cat' => [
        'name'    => 'Phaser Cat',
        'tag'     => 'fighting feline',
        'license' => 'MIT',
        'git'     => 'https://github.com/DaxChen/phaser-cat.git',
        'require' => ['yarn'],
        'build'   => ['yarn install', 'yarn run deploy'],
        'mobile'  => false,
        'desktop' => true,
    ],
    '8queens' => [
        'name'    => '8 Queens',
        'tag'     => 'chess puzzle',
        'license' => 'MIT',
        'git'     => 'https://github.com/attogram/8queens.git',
        'require' => ['composer'],
        'build'   => ['composer install'],
        'mobile'  => false,
        'desktop' => true,
    ],
    'pacman' => [
        'name'    => 'pacman',
        'tag'     => 'eat the dots',
        'license' => 'MIT',
        'git'     => 'https://github.com/mumuy/pacman.git',
        'mobile'  => false,
        'desktop' => true,
    ],
    'polybranch' => [
        'name'    => 'PolyBranch',
        'tag'     => 'fly thru trees',
        'license' => 'UNKNOWN', // @TODO - needs open source LICENSE declaration
        'git'     => 'https://github.com/gbatha/PolyBranch.git',
        'index'   => 'polybranchweb/',
        'mobile'  => false,
        'desktop' => true,
    ],
];
