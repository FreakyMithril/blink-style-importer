let notifyMessage = (word) => {
	return false;
	console.log('Blink extension says: ', word);
};

let checkForExistSite = (items, url) => {
	let exist = false;
	if (Object.keys(items).length > 0 && items.data) {
		for (let item = 0; item < items.data.length; item++) {
			if (items.data[item].pageUrl === url) {
				notifyMessage('Site ' + items.data[item].pageUrl + ' in Storage exist');
				exist = items.data[item];
			}
		}
	}
	else {
		notifyMessage('No Data in Storage');
	}
	return exist;
};

let Storage = {
	saveIn: (styles, url) => {
		return false;
		chrome.storage.sync.get(items => {
			if (Object.keys(items).length > 0 && items.data) {
				notifyMessage('Find some data in Storage, try adding new');
				if (!checkForExistSite(items, url)) {
					items.data.push({pageUrl: url, blinkStyle: styles});

					chrome.storage.sync.set(items, function () {
						notifyMessage('New Data successfully saved to the storage!');
					});
				}

			}
			else {
				notifyMessage('No Data in Storage, create new');
				items.data = [{pageUrl: url, blinkStyle: styles}];

				chrome.storage.sync.set(items, function () {
					notifyMessage('First Data successfully added to the Storage!');
				});
			}
		});
	},
	readFrom: (searchWord) => {
		return false;
		if (!searchWord) {
			chrome.storage.sync.get(null, obj => {
				notifyMessage('All Storage data:');
				notifyMessage(obj);
			});
		}
		else {
			chrome.storage.sync.get(null, obj => {
				notifyMessage('Searched Storage site styles:' + checkForExistSite(obj, searchWord).blinkStyle);
			});
		}
	},
	clearAll: () => {
		return false;
		chrome.storage.sync.clear();
		notifyMessage('Storage cleared!');
	}
};

let StyleOnPage = {
	addThem: (data) => {
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

	let dataUrl = request.pageUrl || {};
	let data = request.data || {};

	if (request.greeting === "sendData") {
		if (StyleOnPage.addThem(data)) {
			Storage.saveIn(data, dataUrl);
			sendResponse({currentData: data, success: true});
		}
		else {
			sendResponse({success: false});
		}
	}
	else if (request.greeting === "removeData") {
		if (StyleOnPage.removeThem()) {
			Storage.clearAll();
			sendResponse({success: true});
		}
		else {
			Storage.clearAll();
			sendResponse({success: false});
		}
	}
	else if (request.greeting === "loadData") {
		if (StyleOnPage.checkForExist()) {
			Storage.readFrom(dataUrl);
			sendResponse({currentData: StyleOnPage.checkForExist(), success: true});
		}
		else {
			notifyMessage('No HTML Styles on site, status: success - false');
			Storage.readFrom(dataUrl);
			sendResponse({success: false});
		}
	}
});