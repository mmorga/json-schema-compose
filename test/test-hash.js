/*global
    describe, it
*/
'use strict';

var assert = require("assert");
var hash = require('../lib/hash.js');

describe('hash', function () {
    describe('#merge()', function () {
        it('should return an empty hash if both inputs are undefined2', function () {
            assert.deepEqual({}, hash.merge(undefined, undefined));
        });

        it('should return a the non-empty hash if either input is undefined', function () {
            assert.deepEqual({a: 5}, hash.merge({a: 5}, undefined));
            assert.deepEqual({a: 5}, hash.merge(undefined, {a: 5}));
        });

        it('should return a merge of both hashes', function () {
            assert.deepEqual({a: 5, b: {c: 6, d: 7}}, hash.merge({a: 5}, {b: {c: 6, d: 7}}));
        });
    });
});