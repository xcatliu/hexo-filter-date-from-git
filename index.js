/* global hexo */
/* eslint no-param-reassign:0, strict:0 */
'use strict';

const log = hexo.log || log.log;
const path = require('path');
const execSync = require('child_process').execSync;
const moment = require('moment-timezone');
const front = require('hexo-front-matter');

hexo.extend.filter.register('before_post_render', data => {
  const filePath = getFilePath(data);
  const [dateExist, updatedExist] = checkDateMetaExistence(data)

  if (!dateExist) {
    data.date = getDate(filePath);
    log.log(`Post ${filePath}  set "date" to ${data.date.format('YYYY-MM-DD HH:mm:ss')}`);
  }
  if (!updatedExist) {
    data.updated = getUpdated(filePath);
	  log.log(`Post ${filePath}  set "updated" to ${data.updated.format('YYYY-MM-DD HH:mm:ss')}`);
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

function checkDateMetaExistence(data) {
  const raw = front.parse(data.raw);
  if (raw == null)
    return [false, false]
  
  let dateExist = false;
  let updatedExist = false;
  if (raw.date)
    dateExist = true;
  if (raw.updated)
    updatedExist = true;
  return [dateExist, updatedExist]
}