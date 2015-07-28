'use strict';

function isFileRef(ref, schemaPath) {
    var fs = require('fs'),
        file,
        filePath,
        fd;

    file = ref.split('#')[0];
    if (file.length === 0) {
        return null;
    }
    filePath = schemaPath + '/' + file;
    try {
        fd = fs.openSync(filePath, 'r');
        fs.close(fd, null);
        return file;
    } catch (err) {
        return null;
    }
}

function pathOfRefFrom(node, path, schemaPath) {
    var p;
    switch (Object.prototype.toString.call(node)) {
    case '[object Object]':
        return Object.keys(node).reduce(function (pv, k) {
            if (pv) {
                return pv;
            }
            p = path + '/' + k;
            if ((k === '$ref') && (isFileRef(node[k], schemaPath))) {
                return p;
            }
            return pathOfRefFrom(node[k], p, schemaPath);
        }, null);
    case '[object Array]':
        return node.reduce(function (pv, i, idx) {
            // if we already found one, just return
            if (pv) {
                return pv;
            }
            p = path + '/' + idx;
            return pathOfRefFrom(i, p, schemaPath);
        }, null);
    // default:
    //     console.log("Unexpected: " + Object.prototype.toString.call(node) + ' at path ' + path);
    }
    return null;
}

exports.pathOfRefFrom = pathOfRefFrom;
exports.isFileRef = isFileRef;
