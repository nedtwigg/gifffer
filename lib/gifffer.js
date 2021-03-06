var Gifffer = function() {
    var images, d = document, ga = 'getAttribute', sa = 'setAttribute';
    images = d && d.querySelectorAll ? d.querySelectorAll('[data-gifffer]') : [];
    var createContainer = function(w, h, el) {
       // top container reacts to changes in width
        var reactWidth = d.createElement('DIV'), cls = el[ga]('class'), id = el[ga]('id');
        cls ? reactWidth[sa]('class', el[ga]('class')) : null;
        id ? reactWidth[sa]('id', el[ga]('id')) : null;
        reactWidth[sa]('style', 'position:relative;cursor:pointer;width:' + w + 'px;max-width:100%;');
        // next container maintains aspect ratio
        var aspectRatio = d.createElement('DIV');
        aspectRatio[sa]('style', 'width:100%;padding-bottom:' + (100 * h / w) + '%;');
        // next container is for holding content
        var con = d.createElement('DIV');
        con[sa]('style', 'position:absolute;top:0;bottom:0;left:0;right:0;');
        // creating play button
        var play = d.createElement('DIV');
        play[sa]('class','gifffer-play-button');
        play[sa]('style', 'width:60px;height:60px;border-radius:30px;background:rgba(0, 0, 0, 0.3);position:absolute;left: calc(50% - 30px);top: calc(50% - 40px);z-index:100;');
        var trngl = d.createElement('DIV');
        trngl[sa]('style', 'width:0;height: 0;border-top:14px solid transparent;border-bottom:14px solid transparent;border-left:14px solid rgba(0, 0, 0, 0.5);position:absolute;left:26px;top:16px;')
        // dom placement
        reactWidth.appendChild(aspectRatio);
        aspectRatio.appendChild(con);
        con.appendChild(play);
        play.appendChild(trngl);
        el.parentNode.replaceChild(reactWidth, el);
        return {c: con, p: play };
    },
    i = 0,
    imglen = images.length,
    process = function(el) {
        var url, con, c, w, h, duration,play, gif, playing = false, cc, isC, durationTimeout;
        url = el[ga]('data-gifffer');
        w = el[ga]('data-gifffer-width');
        h = el[ga]('data-gifffer-height');
        duration = el[ga]('data-gifffer-duration');
        el.style.display = 'block';
        c = document.createElement('canvas');
        isC = !!(c.getContext && c.getContext('2d'));
        if(w && h && isC) cc = createContainer(w, h, el);
        el.onload = function() {
            if(isC) {
                w = w || el.width;
                h = h || el.height;
                // creating the container
                if(!cc) cc = createContainer(w, h, el);
                con = cc.c;
                play = cc.p;
                con.addEventListener('click', function() {
                    clearTimeout(durationTimeout);
                    if(!playing) {
                        playing = true;
                        gif = d.createElement('IMG');
                        gif[sa]('style', 'width:100%;');
                        gif[sa]('data-uri', Math.floor(Math.random()*100000) + 1);
                        setTimeout(function() {
                            gif.src = url;
                        }, 0);                        
                        con.removeChild(play);
                        con.removeChild(c);
                        con.appendChild(gif);
                        if(parseInt(duration) > 0) {
                            durationTimeout = setTimeout(function() {
                                playing = false;
                                con.appendChild(play);
                                con.removeChild(gif);
                                con.appendChild(c);
                                gif = null;
                            }, duration);
                        }
                    } else {
                        playing = false;
                        con.appendChild(play);
                        con.removeChild(gif);
                        con.appendChild(c);
                        gif = null;
                    }
                });
                // canvas
                c.width = w;
                c.height = h;
                c[sa]('style', 'width:100%;');
                c.getContext('2d').drawImage(el, 0, 0, w, h);
                con.appendChild(c);
            }
        }
        el.src = url;
    }
    for(i; i<imglen; ++i) process(images[i]);
}