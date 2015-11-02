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
    contents: fs.readFileSync(filePath),
  });
}

function getFixture(fileName) {
  return getFile(path.join(__dirname, 'fixtures', fileName));
}

function getExpected(fileName) {
  return getFile(path.join(__dirname, 'expected', fileName));
}

function compare(stream, fixtureName, expectedName, done) {
  var called = false;

  function cb() {
    if (!called) {
      called = true;
      done();
    }
  }

  stream
    .once('error', done)
    .once('end', done);

  stream.on('data', function(file) {
    // make sure we checking correct file
    if (path.basename(file.path) === fixtureName) {
      var fix = file.contents.toString().trim();
      var exp = getExpected(expectedName).contents.toString().trim();
      assert.equal(fix, exp);
    }
  });

  stream.write(getFixture(fixtureName));
  stream.end();
}

describe('gulp-css-urls', function() {
  describe('cssUrls()', function() {

    it('should allow files to flow through', function(done) {
      var fakePath = 'fake/file/path.css';
      var fake = new gutil.File({
        path: fakePath,
        base: 'fake/file',
        cwd: __dirname,
        contents: new Buffer('.fake {}'),
      });

      var stream = cssUrls({
        prepend: 'prepend/',
      });

      var a = 0;

      stream
        .once('error', done)
        .once('end', done);

      stream.on('data', function(file) {
        assert.equal(file.path, fakePath);
        a++;
      });

      stream.write(fake);
      stream.end();

      assert.equal(a, 1);
    });

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

    it('should accept function with options', function(done) {
      var stream = cssUrls(function(url) {
        return path.join('function', url);
      }, {
        data: true,
        prepend: 'option',
      });
      compare(stream, 'example.css', 'both.css', done);
    });

  });
});
