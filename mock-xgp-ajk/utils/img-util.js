const cacheUtil = require('cache-util.js');

const saveToCache = function (fs, cacheKeyName, filePath, cb) {
  console.log('file to save: ', filePath);
  fs.saveFile({
    tempFilePath: filePath,
    success: function (fsres) {
      console.log('saved: ', fsres.savedFilePath);
      wx.setStorageSync(cacheKeyName, fsres.savedFilePath);
      if (cb)
        cb({
          success: true,
          savedPath: fsres.savedFilePath
        });
    },
    fail: function (err) {
      console.log('failed to save, err: ', err);
      if (cb)
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
      saveToCache(fs, cacheKeyName, replacementFile);
    },
    fail: function (e) {
      console.log('error removing existing cache file: ', e);
    }
  });
}

const updateCache = function(prodId, isThumb, url, cb) {
  wx.downloadFile({
    url,
    success: function (res) {
      if (res.statusCode == 200) {
        console.log('image downloaded: ', res.tempFilePath);
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

const downloadAndCache = function (prodId, isThumb, url, cb) {
  let cacheKeyName = cacheUtil.getImgKey(prodId, isThumb);
  let existing = wx.getStorageSync(cacheKeyName);
  if (existing) {
    console.log(`cache hit for product(id:${prodId})`);
  }
  else {
    console.log(`cache miss for product(id:${prodId}), downloading from ${url}`);
    wx.downloadFile({
      url,
      success: function (res) {
        if (res.statusCode == 200) {
          console.log('image downloaded: ', res.tempFilePath);
          const fs = wx.getFileSystemManager();
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

  }
};

module.exports = {
  downloadAndCache
};