(function(chrome) {
    'use strict';

    var xhr = (function() {
        var xhr = new XMLHttpRequest();
        return function(method, url, callback) {
            if (isOnline()) {
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        callback(xhr.responseText, xhr.status);
                    }
                };
                xhr.open(method, url);
                xhr.send();
            } else {
                return function(method, url, callback) {
                    callback('Server is offline', 404);
                };
            }
        };
    })();

    function isOnline() {
        return new Date().getUTCHours() > 6;
    }

    function novelsCount(callback) {
        xhr('GET', 'https://api-wntracker.herokuapp.com/notifications', function(data, status) {
            if (status >= 400) {
                callback(-1);
                return;
            }
            var count = _countNotifications(data);
            callback(count);
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
        if (isOnline()) {
            novelsCount(function(count) {
                if (count < 0) {
                    var text;
                    if (count === -1) {
                        text = 'You have to be connected to the internet and logged into Google';
                    } else if (count === -2) {
                        text = 'Unable to find count on page';
                    }
                    window.hasNotifications = false;
                    render('?', [166, 41, 41, 255], text);
                } else {
                    if (count > 9999) {
                        count = '∞';
                    }
                    var badge = count !== 0 ? count : '';
                    window.hasNotifications = count !== 0;
                    render(badge, [65, 131, 196, 255], 'Web novels tracker');
                }
            });
        } else {
            render('zzz', [166, 41, 41, 255], 'WN tracker is currently offline (from 12AM to 6AM UTC)!');
        }
    }

    chrome.alarms.create({
        periodInMinutes: 1
    });
    chrome.alarms.onAlarm.addListener(update);
    chrome.runtime.onMessage.addListener(update);
    chrome.omnibox.onInputChanged.addListener(omniboxInputChanged);
    chrome.omnibox.onInputEntered.addListener(omniboxInputEntered);

    function omniboxInputChanged(text, suggest) {
        xhr('GET', 'https://api-wntracker.herokuapp.com/novels/search?title=' + text, function(data, status) {
            if (status >= 400) {
                return;
            }
            var result = [];
            var novels = JSON.parse(data);
            if (novels && novels.length > 0) {
                novels.forEach(function(novel) {
                    result.push({
                        content: novel.title,
                        description: novel.title
                    });
                });
            }
            suggest(result);
        });
    }

    function omniboxInputEntered(text) {
        xhr('GET', 'https://api-wntracker.herokuapp.com/novels/search?title=' + text, function(data, status) {
            if (status >= 400) {
                return;
            }
            var novels = JSON.parse(data);
            if (novels && novels.length > 0) {
                chrome.tabs.update({
                    url: novels[0].url
                });
            }
        });
    }

    update();

    function _countNotifications(data) {
        var count = 0;
        var notifications = JSON.parse(data);
        if (notifications && notifications.length > 0) {
            var alreadyDone = {};
            notifications.forEach(function(notification) {
                if (!alreadyDone[notification.link]) {
                    count++;
                    alreadyDone[notification.link] = true;
                }
            });
        }
        return count;
    }
})(chrome);
