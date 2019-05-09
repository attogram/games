<?php
declare(strict_types = 1);

// Games that are retired from the active Games List
// Preserved here for possible later use

$retiredGames = [
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
