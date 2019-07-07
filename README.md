<p align="center">
    <img width="450" src="https://raw.githubusercontent.com/sirikon/pitch/master/github-assets/logo.svg?sanitize=true" />
</p>
<p align="center">
    ⚠️ <b>Work in progress. API might change.</b> ⚠️
</p>
<p align="center">
    <a title="Pitch Version" href="https://www.npmjs.com/package/pitch-cli">
        <img src="https://img.shields.io/npm/v/pitch-cli.svg">
    </a>
    <a title="Pitch Dependencies" href="https://david-dm.org/sirikon/pitch">
        <img src="https://david-dm.org/sirikon/pitch.svg">
    </a>
    <a title="Pitch License" href="https://github.com/sirikon/pitch/blob/master/LICENSE">
        <img src="https://img.shields.io/npm/l/pitch-cli.svg">
    </a>
</p>
<p align="center">
The Progressive & Scriptable Static Site Generator.

The objetive of pitch is to provide a powerful tool capable of building static websites progressively. Just a `src` folder should be enough to build a static website.
</p>

---

| Linux | Windows |
|-|-|
|[![CircleCI](https://circleci.com/gh/sirikon/pitch.svg?style=svg)](https://circleci.com/gh/sirikon/pitch)|[![AppVeyor](https://ci.appveyor.com/api/projects/status/8lfm0qtq7pw34ol0?svg=true)](https://ci.appveyor.com/project/sirikon/pitch)|

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

The data proxy is able to navigate into folders too.

```
MyWebsite/
    data/
        articles/
            helloWorld.md
```

```html
<article>
    <%- data.articles.helloWorld.html %>
</article>
```

Pitch understands many file formats inside it's data folder:

 - **.json**: Gets `JSON.parse()`'d.
 - **.js**: Gets `require()`'d.
 - **.md**: Parsed with `remark`.

If the file isn't any of these formats, will read it like a plain text file.

## Router ##

Documentation is on the way.

## Why ##

Got really tired of configuring stuff to build a simple website that I need **right now** because _whatever_.

Regular static site generators tie you to 'blogs' or websites with pages. Wanted something that isn't oriented to a certain type of website and gave me everything I needed, instead of requiring some extra build tasks to transpile something.

Also, many of them require you to have a default configuration file, when a single `index.html` should be enough.

Thought that gluing together a template system with some css pre-processing inside a CLI tool should do the trick. And it did.
