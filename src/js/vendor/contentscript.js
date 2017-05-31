let notifyMessage = (word) => {
	return false;
	console.info('Blink extension says: ' + word);
};

let checkForExistSite = (items, url) => {
	for (let item = 0; item < items.data.length; item++) {
		if (items.data[item].pageUrl === url) {
			notifyMessage('Site ' + items.data[item].pageUrl + ' exist');
			return true;
		}
	}
};

let Storage = {
	saveIn: (styles, url) => {
		return false;
		chrome.storage.sync.get(items => {
			if (Object.keys(items).length > 0 && items.data) {
				notifyMessage('Find some data, try adding new');
				if (!checkForExistSite(items, url)) {
					items.data.push({pageUrl: url, blinkStyle: styles});

					chrome.storage.sync.set(items, function () {
						notifyMessage('Data successfully saved to the storage!');
					});
				}

			}
			else {
				notifyMessage('No Data, create new');
				items.data = [{pageUrl: url, blinkStyle: styles}];

				chrome.storage.sync.set(items, function () {
					notifyMessage('Data successfully saved to the storage!');
				});
			}
		});
	},
	readFrom: () => {
		return false;
		chrome.storage.sync.get(null, obj => {
			notifyMessage('Storage data:');
			console.log(obj);
		});
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
		notifyMessage('Styles Added');
		return true;
	},
	removeThem: () => {
		let blinkStyles = document.getElementById('blinkStyles');

		if (blinkStyles === null) {
			notifyMessage('Blink style Not exist');
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
			notifyMessage('Blink style Not exist, cant load');
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

	let dataUrl = request.dataUrl || {};
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
			Storage.readFrom();
			sendResponse({currentData: StyleOnPage.checkForExist(), success: true});
		}
		else {
			Storage.readFrom();
			sendResponse({success: false});
		}
	}
});