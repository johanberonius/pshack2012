$(function() {
    var webcam = $('#webcam')[0];
    var f1cvs = $('#frame1')[0];
    var f1ctx = f1cvs.getContext('2d');
    var playerWindow = $('#iframe-player')[0].contentWindow;

    if (navigator.webkitGetUserMedia) {
        navigator.webkitGetUserMedia(
            'video',
            function(stream) { webcam.src = window.webkitURL.createObjectURL(stream); },
            function(error) { alert(error); }
        );
    }

    var f2i = f1ctx.getImageData(0, 0, f1cvs.width, f1cvs.height);
    setInterval(function() {

        f1ctx.drawImage(webcam, f1cvs.width, 0, -f1cvs.width, f1cvs.height);
        var f1i = f1ctx.getImageData(0, 0, f1cvs.width, f1cvs.height), f1d = f1i.data, f2d = f2i.data;

        var c = f1d.length / 4, i = 0;
        while (c--) {
            f2d[i] = f1d[i] - f2d[i++];
            f2d[i] = f1d[i] - f2d[i++];
            f2d[i] = f1d[i] - f2d[i++];
            i++;
        }

        f1ctx.putImageData(f2i, 0, 0);
        f2i = f1i;

        detectButton('video-button-1', function() { var jwp = playerWindow.jwplayer(); jwp.play(true); });
        detectButton('video-button-2', function() { var jwp = playerWindow.jwplayer(); jwp.pause(true); });
        detectButton('video-button-3', function() { var jwp = playerWindow.jwplayer(); jwp.setVolume(jwp.getVolume() + 20); });
        detectButton('video-button-4', function() { var jwp = playerWindow.jwplayer(); jwp.setVolume(jwp.getVolume() - 20); });

        detectButton('swipe-4', function() { detectSwipe(4); });
        detectButton('swipe-3', function() { detectSwipe(3); });
        detectButton('swipe-2', function() { detectSwipe(2); });
        detectButton('swipe-1', function() { detectSwipe(1); });

        detectButton('swipe-5', function() { detectSwipe(5); });
        detectButton('swipe-6', function() { detectSwipe(6); });
        detectButton('swipe-7', function() { detectSwipe(7); });
        detectButton('swipe-8', function() { detectSwipe(8); });


    }, 200);

    var prevSwipe = 0, swipeCount = 0;
    function detectSwipe(i) {


        if (i >= 5 && i == prevSwipe + 1)
            swipeCount++;
        else if (i <= 4 && i == prevSwipe - 1)
            swipeCount--;
        else if (i != prevSwipe)
            swipeCount = 0;

        prevSwipe = i;

        if (swipeCount >= 3) {
            swipeCount = 0;
            var jwp = playerWindow.jwplayer();
            var pos = jwp.getPosition() + 30;
            jwp.seek(pos);
        }
        if (swipeCount <= -3) {
            swipeCount = 0;
            var jwp = playerWindow.jwplayer();
            var pos = jwp.getPosition() - 30;
            jwp.seek(pos);
        }



    }

    function detectButton(id, callback) {
        var $el = $('#'+id);
        var pos = $el.position();
        var bi = f1ctx.getImageData(pos.left, pos.top, $el[0].offsetWidth, $el[0].offsetHeight), bid = bi.data;
        c = bid.length / 4, i = 0, sum = 0;
        while (c--) {
            if (bid[i] + bid[i+1] + bid[i+2] > 48) sum++;
            i+=4;
        }
        var avg = sum / (bi.width * bi.height);

        var threshold = 0.1;
        if (avg > threshold) {
            if (! $el.hasClass('active')) {
                $el.addClass('active');
                if (callback) callback();
            }
        }
        else
            $el.removeClass('active');
    }

});

