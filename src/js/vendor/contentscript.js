let notifyMessage = word => {
	//return false;
	console.log('Blink extension content script says: ', word);
};

let OptionsStorage = {
  install: () => {
    let allOptions = {
      options: {
        logTab: true,
        modalBackground: '#3f51b5'
      }
    };
    chrome.storage.sync.set(allOptions);
    notifyMessage('Default options successfully installed in the storage!');
  },
  saveIn: (name, option) => {
    chrome.storage.sync.get(null, function (items) {
      let newOptions = items.options;
      notifyMessage(newOptions);
      newOptions[name] = option;
      notifyMessage(newOptions);
      chrome.storage.sync.remove('options');
      chrome.storage.sync.set(newOptions);
      notifyMessage('All Fine');
    });
    notifyMessage('Option successfully saved to the storage!');
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
		chrome.storage.sync.set(items);
		notifyMessage('Data successfully saved to the storage!');
	},
	readCurrent: (searchWord, fn) => {
		chrome.storage.sync.get(searchWord, function (items) {
			fn(items[searchWord] || false);
		});
		notifyMessage('Just readed searched data from storage');
	},
	readAll: () => {
		chrome.storage.sync.get(null, function (items) {
			console.log(items);
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
		styles.innerHTML = data;
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

	if (request.greeting === "removeAllData") {
    Storage.clearAll();
    sendResponse({
      success: true
    });
	}
	else if (request.greeting === "removeCurrentData") {
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
	}
	else if (request.greeting === "loadCurrentData") {
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
	}
	else if (request.greeting === "loadAllData") {
		Storage.readAll();
		notifyMessage("Data Loaded");
		sendResponse({
			success: true
		});
	}
	else if (request.greeting === "loadDataAndSave") {
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
	}
  else if (request.greeting === "optionsClear") {
    OptionsStorage.clearAll();
    sendResponse({
      success: true
    });
  }
  else if (request.greeting === "optionsDefault") {
    OptionsStorage.install();
    sendResponse({
      success: true
    });
  }
  else if (request.greeting === "optionsSave") {
    OptionsStorage.saveIn('testname', 'testoption');
    sendResponse({
      success: true
    });
  }
	else {
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
	}
	return true;
});