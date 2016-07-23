<?php
// 8queens - AJAX status page v0.0.7

global $attacked;

if (!isset($_GET['b']) || !$_GET['b']) {
    print 'ERROR - no move made';
    $this->shutdown();
}

$board = @$_GET['b'];
$active_board = @json_decode($board, true);
if (!$active_board) {
    $active_board = array();
}

$queens_on_board = queens_on_board($active_board);
$queens_under_attack = queens_under_attack($active_board);
$moves = '?';

$att = '';
if (is_array($attacked) && $queens_on_board > 1) {
    $att = ': '  . implode(', ', $attacked);
}

$solution = '<span style="color:red;">NOT Solved yet</span>';
if ($queens_on_board == 8 && $queens_under_attack == 0) {
    $solution = '<span style="color:green;font-weight:bold;">Solution Found!  Congrats Human!!</span>';
}

print '<ul><li>'.$solution.'</li>'
    .'<li><b>'.$queens_on_board.'</b> Queens on board</li>'
    .'<li><b>'.$queens_under_attack.'</b> Queens under attack'.$att.'</ul>';

function queens_on_board($board)
{
    if (!is_array($board)) {
        return 'ERROR';
    }
    return sizeof($board);
}

function queens_under_attack($board)
{
    global $attacked; // for display outside of this function
    if (!is_array($board)) {
        return 'ERROR';
    }
    if (sizeof($board) <= 1) {
        return '0'; // 1 or 0 pieces? no worry
    }
    $boardx = $board; // 2nd compare array
    $attacked = array();
    while (list($position,) = each($board)) {
        if (in_array($position, $attacked)) {
            continue; // already found attack
        }
        reset($boardx);
        while (list($xposition,) = each($boardx)) {
            if (in_array($xposition, $attacked)) {
                continue; // already found attack
            }
            if ($xposition == $position) {
                continue; // ignore self
            }
            $col = $position[0];
            $row = $position[1];
            $xcol = $xposition[0];
            $xrow = $xposition[1];
            if ($col == $xcol || $row == $xrow) {  // check attacks on rows and columns
                $attacked[] = $position;
                $attacked[] = $xposition;
                $attacked = array_unique($attacked);
                continue;
            }
            if (abs(alpha2num($col) - alpha2num($xcol)) == abs($row - $xrow)) { // check diagonals
                $attacked[] = $position;
                $attacked[] = $xposition;
                $attacked = array_unique($attacked);
                continue;
            }
        }
    }
    return sizeof($attacked);
}


function alpha2num($alpha)
{
    switch ($alpha) {
        default:
            return 0;
        case 'a':
            return 1;
        case 'b':
            return 2;
        case 'c':
            return 3;
        case 'd':
            return 4;
        case 'e':
            return 5;
        case 'f':
            return 6;
        case 'g':
            return 7;
        case 'h':
            return 8;
    }
}
