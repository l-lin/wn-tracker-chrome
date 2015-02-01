'use strict';

jQuery.extend(jQuery.fn.dataTableExt.oSort, {
    'link-pre': function(a) {
        var match = /<span.*>(.*?)<\/span>/g.exec(a);
        return match[1];
    },

    'link-asc': function(a, b) {
        console.log('a', a);
        console.log('b', a);
        console.log('a < b', a < b);

        return ((a < b) ? -1 : ((a > b) ? 1 : 0));
    },

    'link-desc': function(a, b) {
        console.log('a', a);
        console.log('b', a);
        console.log('a < b', a < b);
        return ((a < b) ? 1 : ((a > b) ? -1 : 0));
    }
});
