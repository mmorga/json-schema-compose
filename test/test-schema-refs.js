/*global
    describe, it
*/
'use strict';

var assert = require("assert");
var sr = require('../lib/schema-refs.js');

describe('schema-refs', function () {
    describe('#isFileRef()', function () {
        it('should return null if the ref has no file part', function () {
            assert.equal(sr.isFileRef('#/else', 'test'), null);
        });

        it('should return sample1.json for file only ref', function () {
            assert.equal(sr.isFileRef('sample1.json', 'test'), 'sample1.json');
        });

        it('should return sample1.json for file and path ref', function () {
            assert.equal(sr.isFileRef('sample1.json#/something', 'test'), 'sample1.json');
        });

        it('should return null for file and path ref if json file does not exist', function () {
            assert.equal(sr.isFileRef('sample2.json#/something', 'test'), null);
        });
    });

    describe("#pathOfRefFrom()", function () {
        it('should return null if there are no refs left', function () {
            assert.equal(null, sr.pathOfRefFrom({}, '#', 'test'));
        });

        it('should return path for top level ref', function () {
            assert.equal('#/$ref', sr.pathOfRefFrom({
                '$ref': 'sample1.json#/something'
            }, '#', 'test'));
        });

        it('should return path for nested ref', function () {
            assert.equal('#/nested/$ref', sr.pathOfRefFrom({
                'nested': {
                    '$ref': 'sample1.json#/something'
                }
            }, '#', 'test'));
        });

        it('should return path for array item ref', function () {
            assert.equal(
                '#/nested/0/$ref',
                sr.pathOfRefFrom({
                    '$ref': '#/not/me',
                    'nested': [{
                        '$ref': 'sample1.json#/something'
                    }]
                },
                    '#', 'test')
            );
        });

        it('should return path for nested array item ref', function () {
            assert.equal(
                '#/nested/1/alsonotaref/$ref',
                sr.pathOfRefFrom({
                    'nested': [{
                        'notaref': '#/something',
                        '$ref': '#/local/ref'
                    }, {
                        'alsonotaref': {
                            '$ref': 'sample1.json#/something'
                        }
                    }]
                },
                    '#', 'test')
            );
        });
    });
});
