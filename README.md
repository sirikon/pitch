# pitch #

![Pitch Dependencies](https://david-dm.org/sirikon/pitch.svg)

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

Running `pitch serve` inside `MyWebsite` will run a web server in http://127.0.0.1:3000. Accessing you'll see it works.

Now change the `index.html` extension to `.ejs`. And the style's to `.scss`. (You may need to stop and run `pitch serve` again at the moment... remember, work in progress ^^). And it works, too.

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

And that's all you need to do to include data into your website. Change any file's contents and just reload the page in the browser, it gets re-compiled automatically.

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
