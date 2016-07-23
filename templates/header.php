<?php
// Attogram Framework - Games Site Module - Page Header v0.0.2

namespace Attogram;

echo '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">',
    '<meta http-equiv="X-UA-Compatible" content="IE=edge">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    '<link rel="stylesheet" href="'.$this->path.'/web/bootstrap/css/bootstrap.min.css">',
    '<link rel="stylesheet" href="'.$this->path.'/web/attogram.css">',
    '<link rel="stylesheet" href="'.$this->path.'/web/games.css">',
    //'<!--[if lt IE 9]>',
    //'<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>',
    //'<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>',
    //'<![endif]-->',
    '<title>'.$this->siteName.'</title>',
    //'<script src="'.$this->path.'/web/jquery.min.js"></script>',
    //'<script src="'.$this->path.'/web/bootstrap/js/bootstrap.min.js"></script>',
    '</head><body>',
    '<noscript><div class="alert alert-danger">Please enable Javascript</div></noscript>',
    '<h1>'.$this->siteName.'</h1>';
