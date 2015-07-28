'use strict';

exports.merge = function (a, b) {
    var h = {};

    if (a !== undefined) {
        Object.keys(a).forEach(function (k) {
            h[k] = a[k];
        });
    }

    if (b) {
        Object.keys(b).forEach(function (k) {
            h[k] = b[k];
        });
    }

    return h;
};
