/* global hexo */
/* eslint no-param-reassign:0, strict:0 */
'use strict';

const log = hexo.log || log.log;
const path = require('path');
const execSync = require('child_process').execSync;
const moment = require('moment-timezone');

hexo.extend.filter.register('before_post_render', data => {
  const filePath = getFilePath(data);
  
  const originDate = data.date;
  const gitDate = getDate(filePath);
  if (gitDate < originDate) {
    data.date = gitDate;
    log.log(`Post ${filePath}  set "date" to ${gitDate.format('YYYY-MM-DD HH:mm:ss')}`);
  }

  const originUpdated = data.updated;
  const gitUpdated = getUpdated(filePath);
  if (gitUpdated < originUpdated) {
    data.updated = gitUpdated;
	log.log(`Post ${filePath}  set "updated" to ${gitUpdated.format('YYYY-MM-DD HH:mm:ss')}`);
  }

  return data;
});

function getDate(filePath) {
  const date = execSync(`git log --follow --format="%ad" -- "${filePath}" | tail -1`).toString().trim();
  // If the file is created a moment ago, it will be an untracked file, then git can not log it
  if (date === '') {
    return moment();
  }
  return moment(new Date(date));
}

function getUpdated(filePath) {
  const updated = execSync(`git log --follow -1 --format="%ad" -- "${filePath}"`).toString().trim();
  if (updated === '') {
    return moment();
  }
  return moment(new Date(updated));
}

function getFilePath(data) {
  return path.resolve(hexo.config.source_dir, data.source);
}
