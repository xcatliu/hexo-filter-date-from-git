/* global hexo */
/* eslint no-param-reassign:0, strict:0 */
'use strict';

const path = require('path');
const execSync = require('child_process').execSync;
const moment = require('moment-timezone');

hexo.extend.filter.register('before_post_render', data => {
  data.date = getDate(data);
  data.updated = getUpdated(data);
  return data;
});

function getDate(data) {
  const filePath = getFilePath(data);
  const date = execSync(`git log --follow --format="%ad" -- ${filePath} | tail -1`).toString().trim();
  // If the file is created a moment ago, it will be an untracked file, then git can not log it
  if (date === '') {
    return moment();
  }
  return moment(new Date(date));
}

function getUpdated(data) {
  const filePath = getFilePath(data);
  const updated = execSync(`git log --follow -1 --format="%ad" -- ${filePath}`).toString().trim();
  if (updated === '') {
    return moment();
  }
  return moment(new Date(updated));
}

function getFilePath(data) {
  return path.resolve(hexo.config.source_dir, data.source);
}
