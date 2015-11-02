# [gulp](https://github.com/gulpjs/gulp)-css-urls
> Gulp plugin to alter urls in css files

Particularly helpful in situations such as with github pages. See [here](http://stackoverflow.com/questions/16316311/github-pages-and-relative-paths).

## Installation
Install with [npm](https://npmjs.org/package/gulp-css-urls)

```
$ npm install --save-dev gulp-css-urls
```

## Usage
Passing an options object:

```
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

```
var gulp = require('gulp');
var cssUrls = require('gulp-css-urls');

gulp.task('cssUrls', function() {
  return gulp.src('./src/*.css')
    .pipe(cssUrls(function(url) {
      return 'http://example.com' + url + '?version=2';
    }))
    .pipe(gulp.dest('./dist/'));
});
```

Should change:

```
div {
  background-image: url("/images/lemonade.jpg");
}
```

Into:

```
div {
  background-image: url("http://example.com/images/lemonade.jpg?version=2");
}
```

## API
### cssUrls(options)
#### options
Type: `Object|Function` Required value.

A object with options or a function that may manipulate css urls.
- **options.prepend**

Type: `String` Default value: `undefined`.

Prepend the given string to all urls.
- **options.append**

Type: `String` Default value: `undefined`.

Append the given string to all urls.
- **options.data**

Type: `Boolean` Default value: `false`.

Include data URIs such as `data:text/plain;base64,SGVsbG8sIFdvcmxkIQ%3D%3D`.
- **options.sourcemaps**

Type: `Boolean` Default value: `false`.

Write sourcemaps.

## Credits
[https://github.com/reworkcss/rework](https://github.com/reworkcss/rework) [https://github.com/reworkcss/rework-plugin-url](https://github.com/reworkcss/rework-plugin-url) [https://github.com/trentearl/gulp-css-url-adjuster](https://github.com/trentearl/gulp-css-url-adjuster)

## License
The MIT License (MIT)

Copyright (c) 2015 Jack Scott

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
