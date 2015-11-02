var path = require('path');
var through = require('through2');
var gutil = require('gulp-util');
var rework = require('rework');
var reworkUrl = require('rework-plugin-url');
var PluginError = gutil.PluginError;

/**
 * Alter urls within css files.
 *
 * Used either as cssUrls(options) or cssUrls(function[, options]).
 *
 * @param {object} fn - Function used to manipulate url.
 * @param {object} opts - Url opts or alter function.
 * @param {string} [opts.prepend] - Prepend url with string.
 * @param {string} [opts.append] - Append url with string.
 * @param {boolean} [opts.unsafe=false] - Do not use path.join for prepend url.
 * @param {boolean} [opts.data=false] - Include 'data:...' urls.
 * @param {boolean} [opts.sourcemaps=false] - Create sourcemaps.
 */
module.exports = function(fn, opts) {
  function alter(file, enc, cb) {
    if (file.isNull()) {
      return cb(null, file);
    }
    if (file.isStream()) {
      return cb(new PluginError('gulp-css-urls', 'Streaming not supported'));
    }
    if (!fn && !opts) {
      return cb(new PluginError('gulp-css-urls', 'Parameters are required'));
    }
    if (typeof fn === 'object') {
      opts = fn;
      fn = null;
    } else if (!opts) {
      opts = {};
    }

    function urlfn(url) {
      if (!opts.data && url.indexOf('data:') === 0) {
        return url;
      }
      if (opts.prepend) {
        if (opts.unsafe) {
          url = opts.prepend + url;
        } else {
          url = path.join(opts.prepend, url);
        }
      }
      if (opts.append) {
        url = url + opts.append;
      }
      if (fn) {
        url = fn(url);
      }

      return url;
    }

    var data;
    var str = file.contents.toString();

    try {
      data = rework(str).use(reworkUrl(urlfn)).toString({
        sourcemap: !!opts.sourcemaps
      });
    } catch (err) {
      return cb(new PluginError('gulp-css-urls', err));
    }

    file.contents = new Buffer(data);
    cb(null, file);
  }

  return through.obj(alter);
};
