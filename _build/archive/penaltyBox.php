<?php
declare(strict_types = 1);

/**
 * The Penalty Box
 *
 * Game Repos that require updates before graduating to the Games List
 */
$penaltyBox = [
    'wolf3d' => [
        'name'    => 'Wolf3d',
        'tag'     => 'classic FPS',
        'license' => 'UNKNOWN', // @TODO - needs open source LICENSE declaration
        'git'     => 'https://github.com/jseidelin/wolf3d.git',
        'mobile'  => false,
        'desktop' => true,
    ],
    'loderunner_totalrecall' => [
        'name'    => 'Lode Runner',
        'tag'     => 'run, dig, old style',
        'license' => 'UNKNOWN', // @TODO - needs open source LICENSE declaration
        'git'     => 'https://github.com/SimonHung/LodeRunner_TotalRecall.git',
        'index'   => 'lodeRunner.html',
        'mobile'  => false,
        'desktop' => true,
    ],
    'klotski' => [
        'name'    => 'Klotski',
        'tag'     => 'free the block',
        'license' => 'UNKNOWN', // @TODO - needs open source LICENSE declaration
        'git'     => 'https://github.com/SimonHung/Klotski.git',
        'index'   => 'klotski.puzzle.html',
        'mobile'  => true,
        'desktop' => true,
    ],
];
