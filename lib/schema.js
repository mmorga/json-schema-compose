'use strict';

var pointer = require('json-pointer');
var hash = require('./hash.js');
var sr = require('./schema-refs.js');

function Schema(rootSchema, schemaPath) {
    this.rootSchema = rootSchema;
    this.schemaPath = schemaPath;
}

Schema.prototype.compose = function () {
    var p = true;

    while (true) {
        p = sr.pathOfRefFrom(this.rootSchema, '', this.schemaPath);
        if (!p) {
            return this.rootSchema;
        }
        this.processRef(p);
    }
};

Schema.prototype.processRef = function (refPath) {
    var ref,
        refParts,
        file,
        path,
        content,
        defs;

    ref = pointer.get(this.rootSchema, refPath);
    refParts = ref.split('#');
    file = refParts[0];
    path = '#' + refParts[1];
    pointer.set(this.rootSchema, refPath, path);
    if (!this.rootSchema.hasOwnProperty('definitions')) {
        this.rootSchema.definitions = {};
    }
    if (!pointer.has(this.rootSchema, path) && file.length > 0) {
        content = require(this.schemaPath + '/' + file);
        defs = pointer.get(content, "/definitions");

        this.rootSchema.definitions = hash.merge(this.rootSchema.definitions, defs);
    }
};

exports.Schema = Schema;
