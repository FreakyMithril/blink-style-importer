let optionsVersion = '0.2.0';
let notifyMessage = word => {
  return false;
  console.log('Blink extension content script says: ', word);
};

let logToConsoleData = (data) => {
      console.log('Real Stored ugly data: ');
      console.log(data);
};

let OptionsStorage = {
  install: () => {
    let allOptions = {
      options: {
        optionsVersion: optionsVersion,
        editorFontSize: 14,
        logTab: true,
        autoSave: true,
        autoSaveDelay: 1000,
        logToConsole: false
      }
    };
    chrome.storage.sync.set(allOptions);
    notifyMessage('Default options successfully installed in the storage!');
  },
  saveOne: (name, option) => {
    chrome.storage.sync.get(null, function (items) {
      let newOptions = {};
      newOptions.options = items.options;
      notifyMessage(newOptions);
      newOptions.options[name] = option;
      notifyMessage(newOptions);
      chrome.storage.sync.remove('options');
      chrome.storage.sync.set(newOptions);
      notifyMessage('All Fine, Saved one item');
    });
    notifyMessage('Option successfully added to the storage!');
  },
  saveAll: (object) => {
    chrome.storage.sync.get(null, function () {
      let newOptions = {};
      newOptions.options = object;
      newOptions.options['optionsVersion'] = optionsVersion;
      notifyMessage(newOptions);
      chrome.storage.sync.remove('options');
      chrome.storage.sync.set(newOptions);
      notifyMessage('All Fine, saved all new Options');
    });
    notifyMessage('Option successfully updated in the storage!');
  },
  clearAll: () => {
    chrome.storage.sync.remove('options');
    notifyMessage('Options cleared!');
  }
};

let Storage = {
  saveIn: (url, styles) => {
    let items = {};
    items[url] = styles;
    chrome.storage.sync.set(items, function() {
      if(chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError.message);
        notifyMessage('Data NOT been saved in the storage!');
        //chrome.storage.local.set(items);
        //chrome.storage.sync.remove(url);
      } else {
        notifyMessage('Data successfully saved to the storage!');
        //chrome.storage.local.remove(url);
      }
    });
  },
  readCurrent: (searchWord, fn) => {
    chrome.storage.sync.get(searchWord, function (items) {
      fn(items[searchWord] || false);
    });
    notifyMessage('Just readed searched data from storage');
  },
  readAll: () => {
    chrome.storage.sync.get(null, function (items) {
      logToConsoleData(items);
    });
  },
  clearCurrent: (wordToRemove) => {
    chrome.storage.sync.remove(wordToRemove);
    notifyMessage('Styles data for current site cleared!');
  },
  clearAll: () => {
    chrome.storage.sync.clear();
    notifyMessage('All data in Storage cleared!');
  }
};

let StyleOnPage = {
  addThem: (data) => {
    notifyMessage("Need check for Exist in HTML before add, and remove if Exist");
    StyleOnPage.removeThem();

    let styles = document.createElement('style');
    styles.type = 'text/css';
    styles.id = 'blinkStyles';
    styles.innerHTML = JSON.parse(data); /*convert to native(base) format data*/
    document.getElementsByTagName('body')[0].appendChild(styles);
    notifyMessage('Styles on Page Added');
    return true;
  },
  removeThem: () => {
    let blinkStyles = document.getElementById('blinkStyles');

    if (blinkStyles === null) {
      notifyMessage('Blink style in HTML Not exist');
      return false;
    }
    else {
      notifyMessage('Blink style Exist');
      document.getElementsByTagName('body')[0].removeChild(blinkStyles);
      notifyMessage('Styles Removed');
      return true;
    }
  },
  checkForExist: () => {
    let blinkStyles = document.getElementById('blinkStyles');

    if (blinkStyles === null) {
      notifyMessage('Blink style in HTML Not exist, cant load');
      return false;
    }
    else {
      notifyMessage('Blink style Exist, try to load');
      return blinkStyles.innerHTML;
    }
  }
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  notifyMessage("Something happening from the extension");

  let dataUrl = request.url || {};
  let data = request.styles || {};

  switch (request.greeting) {
    case 'removeAllData':
      Storage.clearAll();
      sendResponse({
        success: true
      });
      break;
    case 'removeCurrentData':
      if (StyleOnPage.removeThem()) {
        Storage.clearCurrent(request.pageUrl);
        sendResponse({
          success: true
        });
      }
      else {
        sendResponse({
          success: false
        });
      }
      break;
    case 'loadCurrentData':
      Storage.readCurrent(request.pageUrl, function (siteStyle) {
        if (siteStyle) {
          notifyMessage("There is searched key: '" + request.pageUrl + "' in Storage");
          sendResponse({
            currentData: siteStyle,
            success: true
          });
        } else {
          notifyMessage("No key in Storage");
          sendResponse({
            success: false
          });
        }
      });
      break;
    case 'loadAllData':
      Storage.readAll();
      notifyMessage("Data Loaded");
      sendResponse({
        success: true
      });
      break;
    case 'loadDataAndSave':
      Storage.readCurrent(request.pageUrl, function (siteStyle) {
        if (siteStyle) {
          notifyMessage("There is searched key: '" + request.pageUrl + "' in Storage, try to save to page");
          StyleOnPage.addThem(siteStyle);
          sendResponse({
            success: true
          });
        } else {
          notifyMessage("No key in Storage");
          sendResponse({
            success: false
          });
        }
      });
      break;
    case 'optionsClear':
      OptionsStorage.clearAll();
      sendResponse({
        success: true
      });
      break;
    case 'optionsDefault':
      OptionsStorage.install();
      sendResponse({
        success: true
      });
      break;
    case 'optionsSave':
      OptionsStorage.saveAll(request.optionsData);
      sendResponse({
        success: true
      });
      break;
    default:
      if (StyleOnPage.addThem(data)) {
        Storage.saveIn(dataUrl, data);
        sendResponse({
          currentData: data,
          success: true
        });
      }
      else {
        sendResponse({
          success: false
        });
      }
      break;
  }

  return true;
});