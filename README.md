# [gulp](https://github.com/gulpjs/gulp)-css-urls [![Build Status](https://travis-ci.org/jackrobertscott/gulp-css-urls.svg?branch=master)](https://travis-ci.org/jackrobertscott/gulp-css-urls)
> Gulp plugin to alter urls in css files

Helpful in situations such as absolute URLs in [github pages](http://stackoverflow.com/questions/16316311/github-pages-and-relative-paths). Post any issues [here](https://github.com/jackrobertscott/gulp-css-urls/issues).

## Installation
Install with [npm](https://npmjs.org/package/gulp-css-urls)

```
$ npm install --save-dev gulp-css-urls
```

## Usage
Passing an options object:

```js
var gulp = require('gulp');
var cssUrls = require('gulp-css-urls');

gulp.task('cssUrls', function() {
  return gulp.src('./src/*.css')
    .pipe(cssUrls({
      prepend: 'http://example.com',
      append: '?version=2',
    }))
    .pipe(gulp.dest('./dist/'));
});
```

Or passing a function:

```js
var gulp = require('gulp');
var cssUrls = require('gulp-css-urls');

gulp.task('cssUrls', function() {
  return gulp.src('./src/*.css')
    .pipe(cssUrls(function(url) {
      return 'http://example.com' + url + '?version=2';
    }, {
      sourcemaps: true,
    }))
    .pipe(gulp.dest('./dist/'));
});
```

Should change:

```css
div {
  background-image: url("/images/lemonade.jpg");
}
```

Into:

```css
div {
  background-image: url("http://example.com/images/lemonade.jpg?version=2");
}
```

## API
### cssUrls(options) or cssUrls(function[, options])
- **function**

Type: `Function`.

Function that may manipulate the given url. It takes the url as only parameter.

Note: the function will be run *after* the options are evaluated.
- **options**

Type: `Object` Required if `function` not given.

An object with options or a function that may manipulate css urls.
- **options.prepend**

Type: `String` Default value: `undefined`.

Prepend the given string to all urls.
- **options.append**

Type: `String` Default value: `undefined`.

Append the given string to all urls.
- **options.unsafe**

Type: `Boolean` Default value: `false`.

Do not use `path.join` when prepending to urls.
- **options.data**

Type: `Boolean` Default value: `false`.

Include data URIs such as `data:text/plain;base64,SGVsbG8sIFdvcmxkIQ%3D%3D`.
- **options.sourcemaps**

Type: `Boolean` Default value: `false`.

Write sourcemaps.

## Credits
- [https://github.com/reworkcss/rework](https://github.com/reworkcss/rework)
- [https://github.com/reworkcss/rework-plugin-url](https://github.com/reworkcss/rework-plugin-url)
- [https://github.com/trentearl/gulp-css-url-adjuster](https://github.com/trentearl/gulp-css-url-adjuster)

## License
The MIT License (MIT)

Copyright (c) 2015 Jack Scott

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
