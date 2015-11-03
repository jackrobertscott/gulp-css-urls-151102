var path = require('path');
var fs = require('fs');
var assert = require('chai').assert;
var gutil = require('gulp-util');
var cssUrls = require('..');

function makeFile() {
  var name = 'file-' + Math.floor(Math.random() * 1000);
  return new gutil.File({
    path: 'fake/file/path/' + name + '.css',
    base: 'fake/file/path',
    cwd: __dirname,
    contents: new Buffer('.' + name + ' {}'),
  });
}

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
  stream.on('data', function(file) {
    // make sure we checking correct file
    if (path.basename(file.path) === fixtureName) {
      var fix = file.contents.toString().trim();
      var exp = getExpected(expectedName).contents.toString().trim();
      assert.equal(fix, exp);
    }
  });

  stream.once('end', done);
  stream.write(getFixture(fixtureName));
  stream.end();
}

describe('gulp-css-urls', function() {
  describe('cssUrls()', function() {

    it('should allow file streaming', function(done) {
      var fakeFile = makeFile();

      var stream = cssUrls({
        prepend: 'prepend/',
      });

      var a = 0;

      stream.on('data', function(file) {
        assert.equal(file.path, fakeFile.path);
        a++;
      });

      stream.once('end', done);
      stream.write(fakeFile);
      stream.end();

      assert.equal(a, 1);
    });

    it('should throw PluginError when no parameters given', function(done) {
      assert.throw(function() {
        var fakeFile = makeFile();
        var stream = cssUrls();
        stream.once('error', function(err) {
            done();
            throw err;
          })
          .once('end', done);
        stream.write(fakeFile);
        stream.end();
      }, gutil.PluginError);
    });

    it('should alter urls with function', function(done) {
      var stream = cssUrls(function(url) {
        return 'prepend/' + url + '?version=2';
      });
      compare(stream, 'example.css', 'function.css', done);
    });

    it('should prepend to urls with options.prepend', function(done) {
      var stream = cssUrls({
        prepend: 'prepend/',
      });
      compare(stream, 'example.css', 'prepend.css', done);
    });

    it('should append to urls with options.append', function(done) {
      var stream = cssUrls({
        append: '?version=2',
      });
      compare(stream, 'example.css', 'append.css', done);
    });

    it('should allow data URIs to be altered', function(done) {
      var stream = cssUrls({
        prepend: 'prepend/',
        append: '?version=2',
        data: true,
      });
      compare(stream, 'example.css', 'data.css', done);
    });

    it('should accept function and options together', function(done) {
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
