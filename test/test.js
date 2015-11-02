var path = require('path');
var fs = require('fs');
var assert = require('chai').assert;
var gutil = require('gulp-util');
var cssUrls = require('..');

function getFile(filePath) {
  return new gutil.File({
    path: filePath,
    base: path.dirname(filePath),
    cwd: __dirname,
    contents: fs.readFileSync(filePath)
  });
}

function getFixture(fileName) {
  return getFile(path.join(__dirname, 'fixtures', fileName));
}

function getExpected(fileName) {
  return getFile(path.join(__dirname, 'expected', fileName));
}

function compare(stream, fixtureName, expectedName, done) {
  stream
    .on('error', done)
    .on('end', done);

  stream.on('data', function(file) {
    // make sure we checking correct file
    if (path.basename(file.path) === fixtureName) {
      var fix = String(file.contents).trim();
      var exp = String(getExpected(expectedName).contents).trim();
      assert.equal(fix, exp);
    }
  });

  stream.write(getFixture(fixtureName));

  stream.end();
}

describe('gulp-css-urls', function() {
  describe('cssUrls()', function() {
    it('should prepend to urls', function(done) {
      var stream = cssUrls({
        prepend: 'prepend/',
      });

      compare(stream, 'example.css', 'prepend.css', done);
    });
    it('should append to urls', function(done) {
      var stream = cssUrls({
        append: '?version=2',
      });

      compare(stream, 'example.css', 'append.css', done);
    });
    it('should alter urls based on function', function(done) {
      var stream = cssUrls(function(url) {
        return 'prepend/' + url + '?version=2';
      });

      compare(stream, 'example.css', 'function.css', done);
    });
  });
});
