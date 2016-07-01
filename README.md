# hexo-filter-date-from-git

Read git log and overwrite the front-matter properties `date` and `updated` for each posts.

**WARNING:** This plugin will **overwrite** the front-matter, **even if** you manually set a `date` or `updated` in the front-matter.

A live site using this plugin: http://js-index.com/

And the GitHub repo for that site: https://github.com/xcatliu/js-index

## Installation

```shell
$ npm install hexo-filter-date-from-git --save
```

## Usage

The `date` property will be the date when the first time someone committed the post. Same result as:

```shell
git log --format="%ad" -- <file> | tail -1
```

The `updated` property will be the date when the last time someone committed the post. Same result as:

```shell
git log --format="%ad" -- <file> | tail -1
```

**NOTICE:** If you created a new file, before you committed the file, the `date` and `updated` will be the date when you run hexo command.

## Options

Null
