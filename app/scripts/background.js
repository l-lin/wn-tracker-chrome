(function(chrome) {
    'use strict';

    var xhr = (function () {
        var xhr = new XMLHttpRequest();
        return function (method, url, callback) {
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    callback(xhr.responseText, xhr.status);
                }
            };
            xhr.open(method, url);
            xhr.send();
        };
    })();

    function novelsCount(callback) {
        xhr('GET', 'https://api-wntracker.herokuapp.com/authTest', function (data, status) {
            if (status >= 400) {
                callback(-1);
                return;
            }

            callback(1);
        });
    }

    function render(badge, color, title) {
        chrome.browserAction.setBadgeText({
            text: '' + badge
        });

        chrome.browserAction.setBadgeBackgroundColor({
            color: color
        });

        chrome.browserAction.setTitle({
            title: title
        });
    }

    function update() {
        novelsCount(function (count) {
            if (count < 0) {
                var text;
                if (count === -1) {
                    text = 'You have to be connected to the internet and logged into Google';
                } else if (count === -2) {
                    text = 'Unable to find count on page';
                }
                render('?', [166, 41, 41, 255], text);
            } else {
                if (count > 9999) {
                    count = '∞';
                }
                render(count, [65, 131, 196, 255], 'Web novels tracker');
            }
        });
    }

    chrome.alarms.create({periodInMinutes: 1});
    chrome.alarms.onAlarm.addListener(update);
    chrome.runtime.onMessage.addListener(update);

    // FIXME: DELETE ME AFTERWARDS
    chrome.extension.onConnect.addListener(function(port) {
        console.log('Connected .....');
        port.onMessage.addListener(function(msg) {
            console.log('message recieved'+ msg);
            port.postMessage('Hi Popup.js');
        });
    });

    update();
})(chrome);
