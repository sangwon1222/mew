//import screenfull from 'screenfull'


//https://github.com/willmcpo/body-scroll-lock
// https://stackoverflow.com/questions/1207008/how-do-i-lock-the-orientation-to-portrait-mode-in-a-iphone-web-application


// 풀스크린 관련
// https://developers.google.com/web/fundamentals/native-hardware/fullscreen?hl=ko
export function isIOS(){
    const toMatch = [
        /Macintosh/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
    ];
    // console.error(navigator.userAgent)
    return toMatch.some((toMatchItem) => {
        // alert( toMatchItem+":"+navigator.userAgent+":"+navigator.userAgent.match(toMatchItem) )
        return navigator.userAgent.match(toMatchItem);
    });
}
export function isMobilePlatform() {
    // const filter = "win16|win32|win64|mac";
    // if (navigator.platform) {
    //     if (0 > filter.indexOf(navigator.platform.toLowerCase())) {
    //         //alert("Mobile");
    //         return true;
    //     } else {
    //         //alert("PC");
    //         return false;
    //     }
    // }
    const toMatch = [
        /Android/i,
        /webOS/i,
        /Macintosh/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ];
    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    });
}

// https://developer.mozilla.org/ko/docs/Web/API/Screen/lockOrientation
export function scrollLock(direction, cb) {
    //https://www.w3.org/TR/screen-orientation/
    //모바일인경우는 수행하지 않는다.(모바일은 지원하지 않는다.)
    if (!isMobilePlatform()) return;

    if (screen.orientation.lock) {
        screen.orientation
            .lock(direction)
            .then(() => {
                if (cb) cb();
                // _LOCK_BUTTON.style.display = 'none';
                // _UNLOCK_BUTTON.style.display = 'block';
            })
            .catch(function (error) {
                console.error(error);
            });
    }
}

export function isFullscreen() {
    return false;
    //return document.fullscreen || document.webkitCurrentFullScreenElement;
    //return document.fullscreen;
}

export function setFullScreenMode(flag, cb) {
    //모바일인경우는 수행하지 않는다.
    if (!isMobilePlatform()) {
        console.warn(" This Device is not mobile");
        return;
    }

    if (flag == true) {
        const options = {
            //"hide" : full dimensions of the screen of the output device
            //"show" : dimensions of the screen of the output device clamped to allow the user agent to show page navigation controls
            //"auto" : user-agent defined, but matching one of the above
            navigationUI: ("hide" as FullscreenNavigationUI)
        };
        if (isFullscreen() == true) return;

        // let cb = ()=>{
        //     scrollLock( ScreenDirection.portrait )
        // }
        //alert( window["webkitEnterFullscreen"] );

        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen(options).then(() => {
                /* 스크롤락관련 처리 201103
                scrollLock("portrait-primary", () => {
                    if (cb) cb();
                });
                */
            });
            
        } else if (document.documentElement["webkitRequestFullscreen"])
            document.documentElement["webkitRequestFullscreen"](options).then(cb);
        else if (document.documentElement["mozRequestFullScreen"])
            document.documentElement["mozRequestFullScreen"](options).then(cb);
        else if (document.documentElement["msRequestFullscreen"])
            document.documentElement["msRequestFullscreen"](options).then(cb);
    } else {
        if (!isFullscreen()) return;
        const exitFullscreen =
            document["exitFullscreen"] ||
            document["mozCancelFullScreen"] ||
            document["webkitExitFullscreen"] ||
            document["msExitFullscreen"];
        exitFullscreen.call(document).then(() => {
            if (cb) cb();
        });
    }
}
