const cacheUtil = require('cache-util.js');

const saveToCache = function (fs, cacheKeyName, filePath) {
  fs.saveFile({
    tempFilePath: filePath,
    success: function (fsres) {
      console.log('saved: ', fsres.savedFilePath);
      wx.setStorageSync(cacheKeyName, fsres.savedFilePath);
      cb({
        success: true,
        savedPath: fsres.savedFilePath
      });
    },
    fail: function (err) {
      console.log('failed to save, err: ', err);
      cb({
        success: false,
        err
      });
    }
  })

}

const replaceCache = function (fs, cacheKeyName, filePath, replacementFile) {
  console.log('removing cached image: ', filePath);
  fs.removeSavedFile({
    filePath,
    success: function (r) {
      console.log('removed existing cache file: ', filePath);
      saveToCache(fs, replacementFile);
    },
    fail: function (e) {
      console.log('error removing existing cache file: ', e);
    }
  });
}

const downloadAndCache = function(prodId, isThumb, url, cb) {
  wx.downloadFile({
    url,
    success: function (res) {
      if (res.statusCode == 200) {
        console.log('image download: ', res.tempFilePath);
        const fs = wx.getFileSystemManager();
        let cacheKeyName = cacheUtil.getImgKey(prodId, isThumb);
        let existing = wx.getStorageSync(cacheKeyName);
        let fileToSave = res.tempFilePath;
        if (existing)
          replaceCache(fs, cacheKeyName, existing, fileToSave);
        else
          saveToCache(fs, cacheKeyName, fileToSave);
      }
    },
    fail: function (err) {
      console.log('error downloading file, err:', err)
    }
  })
};

module.exports = {
  downloadAndCache
};