<p align="center">
    <img width="450" src="https://raw.githubusercontent.com/Sirikon/pitch/master/github-assets/logo.svg?sanitize=true" />
</p>

# pitch #
[![Pitch Version](https://img.shields.io/npm/v/pitch-cli.svg)](https://www.npmjs.com/package/pitch-cli) 
[![Pitch Dependencies](https://david-dm.org/sirikon/pitch.svg)](https://david-dm.org/sirikon/pitch)
[![Pitch License](https://img.shields.io/npm/l/pitch-cli.svg)](https://github.com/Sirikon/pitch/blob/master/LICENSE)


| Linux | Windows |
|-|-|
|[![CircleCI](https://circleci.com/gh/Sirikon/pitch.svg?style=svg)](https://circleci.com/gh/Sirikon/pitch)|[![AppVeyor](https://ci.appveyor.com/api/projects/status/8lfm0qtq7pw34ol0?svg=true)](https://ci.appveyor.com/project/Sirikon/pitch)|

⚠️**Work in progress**⚠️

Zero-Configuration Convention-Driven Progressive Static Site Generator.

The objetive of pitch is to provide a tool capable of building static websites without any configuration. Just a `src` folder should be enough to build a static website.

## Install ##

```bash
npm install -g pitch-cli
```

## Usage ##

Create a file structure like this:

```
MyWebsite/
    src/
        index.html
        style.css
```

Running `pitch serve` inside `MyWebsite` will run a web server in http://127.0.0.1:3000. Access it from the browser check that it's working.

Now change the `index.html` extension to `.ejs` and the style's to `.scss`, change the contents of the files, add new styles and reference them from `index.ejs`, or create some partials.

As you can see, pitch takes care of building the needed resources as you request them. It just works.

## Data ##

To include data into your website, just create a `data` folder with some JSON files in it:

```
MyWebsite/
    src/
        index.ejs
        style.scss
    data/
        people.json
```

Inside `people.json`:
```json
["John", "Charles", "Thomas"]
```

Inside `index.ejs`:
```html
<p>People: <%= data.people.join(", "); %></p>
```

And that's all you need to do to include data into your website. Change any file's contents and reload the page in the browser, it gets re-compiled automatically.

## Why ##

Got really tired of configuring stuff to build a simple website that I need **right now** because _whatever_.

Wanted something that isn't oriented to a certain type of website (like blogs) and gave me everything I needed, instead of requiring some extra build tasks to transpile something.

Thought that gluing together a template system with some css pre-processing inside a CLI tool should do the trick. And it did.

## License ##

```
MIT License

Copyright (c) 2018 Carlos Fernández

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
