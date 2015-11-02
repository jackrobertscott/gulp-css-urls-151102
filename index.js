var path = require('path');
var through = require('through2');
var gutil = require('gulp-util');
var rework = require('rework');
var reworkUrl = require('rework-plugin-url');
var PluginError = gutil.PluginError;

/**
 * Alter urls within css files.
 *
 * @param {object/function} options - Url options or alter function.
 * @param {string} [options.prepend] - Prepend url with string.
 * @param {string} [options.append] - Append url with string.
 * @param {boolean} [options.data=false] - Include 'data:...' urls.
 * @param {boolean} [options.sourcemaps=false] - Create sourcemaps.
 */
module.exports = function(options) {
  function alter(file, enc, cb) {
    if (file.isNull()) {
      return cb(null, file);
    }
    if (file.isStream()) {
      return cb(new PluginError('gulp-css-urls', 'Streaming not supported'));
    }

    var fn;
    var data;
    var str = file.contents.toString('utf8');

    if (typeof options === 'function') {
      fn = options;
    } else if (typeof options === 'object') {
      fn = function(url) {
        if (!options.data && url.indexOf('data:') === 0) {
          return url;
        }
        if (options.prepend) {
          url = path.join(options.prepend, url);
        }
        if (options.append) {
          url = url + options.append;
        }

        return url;
      };
    } else {
      return cb(new PluginError('gulp-css-urls', 'Requires {object/function} parameter'));
    }

    try {
      data = rework(str).use(reworkUrl(fn)).toString({
        sourcemap: !!options.sourcemaps
      });
    } catch (err) {
      return cb(new PluginError('gulp-css-urls', err));
    }

    file.contents = new Buffer(data);
    cb(null, file);
  }

  return through.obj(alter);
};
