/*
 * The MIT License
 *
 * Copyright (c) 2012 Petar Petrov
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
Crafty.scene("splash", function() {
    Crafty.background('#000');
    Crafty.background('transparent');

    $("#left-frame").hide();
    $("#right-frame").hide();
    $("#bottom-frame").hide();
    $("#stats").hide();
    $("#in-menu").hide();
    $("#fps").hide();

    var isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
    if (isSafari) {
        $('.safari').show();
    }

    var hitEvent = 'click';

    var bgX = 128, bgY = 34;
    if (_Globals.conf.get('mobile')) {
        bgY = 0;

        $("#menu").css("top", "632px");
        hitEvent = 'touchstart';
    }

    var bg = Crafty.e("2D, " + _Globals.conf.get('renderType') + ", Image")
        .attr({x: bgX, y: bgY})
        .image("../web/raging-gardens/art/stuz_splash.png", "no-repeat");

    $("#menu-start").bind(hitEvent, function() {
        $("#version").hide();
        $("#menu").hide();
        Crafty.scene('main');
    });

    $("#version").text('v' + _Globals.version);
    $("#version").show();

    $("#menu-howto").bind(hitEvent, function() {
        // show dialog
        $("#dialog-howto").dialog({
            resizable: false,
            "width": 720,
            "height": 440,
            modal: true,
            "title": "How to play",
            buttons: {
                "Sounds legit": function() {
                    $(this).dialog("close");
                }
            },
        });
    });

    $("#menu-hiscore").bind(hitEvent, function() {
        Crafty.trigger('ShowHiscore', {text: undefined, refresh: false});
    });

    $('#menu-credits').bind(hitEvent, function() {
        // show dialog
        $("#dialog-credits").dialog({
            resizable: false,
            "width": 480,
            "height": 280,
            modal: true,
            "title": "Credits",
            buttons: {
                "Ok": function() {
                    $(this).dialog("close");
                }
            },
        });
    });
    $("#menu").show();
});
