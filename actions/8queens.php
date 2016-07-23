<?php
// 8queens - Home page v0.0.6

$this->pageHeader('Play 8 Queens - the classic chess puzzle')

?>
<link rel="stylesheet" href="<?php print $this->path; ?>/web/8queens/cjs030/css/chessboard-0.3.0.css" />
<script src="<?php print $this->path; ?>/web/8queens/cjs030/js/jquery-1.10.1.min.js"></script>
<script src="<?php print $this->path; ?>/web/8queens/cjs030/js/chessboard-0.3.0.js"></script>
<table border="0" cellpadding="0" cellspacing="0" style="margin: 0px auto;background-color:#f0f0f0;">
 <tr>
  <td valign="top" style="padding:10px 20px 0px 30px;">
    <div id="board1" style="width:350px"></div>
  </td>
  <td valign="top" style="padding:10px 0px 0px 0px;">
   <p><strong>Can you solve the 8 Queens puzzle?</strong></p>
   <div id="status" style="background-color:#efd;padding:2px;">
    <ul>
    <li><span style="color:red;">NOT Solved yet</span>
    <li><b>0</b> Queens on board
    <li><b>0</b> Queens under attack
    </ul>
   </div>
   <div class="body">
    How to play the 8 Queens Puzzle:
    <ul>
    <li>Drag 8 queens onto this chess board
    <li>No queen may be attacking another queen
    <li>Drag existing queens to change positions
    <li>Drop a queen off the board to remove it
    </ul>
    How fast can you find a solution?
    <br /><br />
    Give up? See a <strong><a href="./?solve">random solution</a></strong>!
    <p><small><a href="./">(restart game)</a></small></p>
   </div>
  </td>
 </tr>
</table>
<script>
var onChange = function(oldPos, newPos) {
  var b = JSON.stringify(newPos);
  jQuery.ajax({
    url: "../8queens-status",
    data: "b="+b,
    error: function(xhr) { alert("ERROR: status:" +xhr.status+' '+xhr.statusText); },
    success: function(result) { jQuery("#status").html(result); }
  });
};

var cfg = {
 draggable: true,
 dropOffBoard: 'trash',
 sparePieces: true,
<?php

if (isset($_GET['solve'])) {
    print ' position: '.solve8queens().",\n";
}

?>
 onChange: onChange,
};
var board1 = new ChessBoard('board1', cfg);

<?php

if (isset($_GET['solve'])) {
    print "jQuery('#status').html('<ul>"
        ."<li><span style=\"color:green;\"><b>RANDOM SOLUTION FOUND!</b></span></li>"
        ."<li>8 Queens on board</li>"
        ."<li>0 Queens under attack</li>"
        ."</ul>');";
}
?>
jQuery('.spare-pieces-top-4028b').remove(); // hide top black spare pieces
jQuery(".spare-pieces-7492f img[src$='wK.png']").remove(); // hide all white sparece pieces except queen...
jQuery(".spare-pieces-7492f img[src$='wR.png']").remove();
jQuery(".spare-pieces-7492f img[src$='wB.png']").remove();
jQuery(".spare-pieces-7492f img[src$='wN.png']").remove();
jQuery(".spare-pieces-7492f img[src$='wP.png']").remove();
</script>
<?php
$this->pageFooter();



// Attogram Framework - 8queens module - solve8queens v0.0.8

/**
 * Solve 8 Queens puzzle using brute force, with queens randomly placed 1 per row/column
 * modified from https://gist.github.com/Xeoncross/1015646
 * modified from http://paulbutler.org/archives/n-queens-in-a-tweet/
 * @param int $boardSize
 * @param int $attempts
 * @return string Solution in chessboad.js/JSON format
 */
function solve8queens($boardSize = 8, $attempts = 1000)
{
    $counter = 0;
    $board = range(1, $boardSize); // init the chess board
    while ($counter <= $attempts) {
        // randomly place 1 queen per row/column
        shuffle($board);
        // test for attacks on rows/columns - permutations [1..n]
        $rowsColumns = numericArrayAddition($board, range(1, $boardSize));
        // test for attacks on diagonals - permutations [n..1] with constant factor 2*n
        $diagonals = numericArrayAddition(numericArrayAddition($board, range($boardSize, 1)), 2 * $boardSize);
        // combine row/col and diagonals checks.
        $rowsColumnsDiagonals = array_merge($rowsColumns, $diagonals);
        // if there are 2*n numbers in the array, then solution is found
        if (count(array_unique($rowsColumnsDiagonals)) == 2 * $boardSize) {
            // output in chessboad.js/JSON format, for 8x8 board:
            $board[0] = 'a'.$board[0];
            $board[1] = 'b'.$board[1];
            $board[2] = 'c'.$board[2];
            $board[3] = 'd'.$board[3];
            $board[4] = 'e'.$board[4];
            $board[5] = 'f'.$board[5];
            $board[6] = 'g'.$board[6];
            $board[7] = 'h'.$board[7];
            $solution = join(":'wQ', ", $board);
            return "{ $solution:'wQ' }";
        }
        $counter++;
    }
} // end function solve8queens

/**
 * add two arrays of numbers together
 * @params array $arrayA
 * @params array $arrayB (optional)
 * @return array
 */
function numericArrayAddition($arrayA, $arrayB)
{
    if (!is_array($arrayB)) { // no second array? make one with all 0's
        $arrayB = array_fill(0, count($arrayA), $arrayB);
    }
    foreach ($arrayA as $name => $value) {
        $result[$name] = $value + $arrayB[$name];
    }
    return $result;
}
