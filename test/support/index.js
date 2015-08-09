'use strict';

var utils = module.exports;

utils.arrayKeys = function arrayKeys(arr) {
  return Object.keys(arr[0]);
};

utils.hasKeys = function hasKeys(keys, arr) {
  var arrKeys = utils.arrayKeys(arr);
  var len = keys.length;

  while (len--) {
    if (arrKeys.indexOf(keys[len]) === -1) {
      return false;
    }
  }
  return true;
};
