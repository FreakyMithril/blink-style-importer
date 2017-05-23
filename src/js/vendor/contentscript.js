function notifyMessage(word) {
	return false;
	console.info('Blink extension says: ' + word);
}

let Storage = {
	saveIn: (styles, url) => {
		return false;
		chrome.storage.sync.get(function (items) {
			if (Object.keys(items).length > 0 && items.data) {
				notifyMessage('Find data, adding new');
				items.data.push({pageUrl: url, blinkStyle: styles});

				chrome.storage.sync.set(items, function () {
					notifyMessage('Data successfully saved to the storage!');
				});
			} else {
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
		notifyMessage('Storage data:');
		chrome.storage.sync.get(null, function (obj) {
			console.log(obj);
		});
	},
	clearIt: () => {
		return false;
		chrome.storage.sync.clear();
		notifyMessage('Storage cleared!');
	}
};

function removeStylesOnPage() {
	let blinkStyles = document.getElementById('blinkStyles');

	if (blinkStyles === null) {
		notifyMessage('Blink style Not exist');
		return false;
	} else {
		notifyMessage('Blink style Exist');
		document.getElementsByTagName('body')[0].removeChild(blinkStyles);
		notifyMessage('Styles Removed');
		return true;
	}
}

function currentStylesOnPage() {
	let blinkStyles = document.getElementById('blinkStyles');

	if (blinkStyles === null) {
		notifyMessage('Blink style Not exist, cant load');
		return false;
	} else {
		notifyMessage('Blink style Exist, try to load');
		return blinkStyles.innerHTML;
	}
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	notifyMessage("Something happening from the extension");
	let dataUrl = request.dataUrl || {};
	let data = request.data || {};

	function addStylesOnPage() {
		removeStylesOnPage();
		let styles = document.createElement('style');
		styles.type = 'text/css';
		styles.id = 'blinkStyles';
		styles.innerHTML = data;
		document.getElementsByTagName('body')[0].appendChild(styles);
		notifyMessage('Styles Added');
		return true;
	}


	if (request.greeting === "sendData") {
		if (addStylesOnPage()) {
			Storage.saveIn(data, dataUrl);
			sendResponse({currentData: data, success: true});
		} else {
			sendResponse({success: false});
		}
	} else if (request.greeting === "removeData") {
		if (removeStylesOnPage()) {
			Storage.clearIt();
			sendResponse({success: true});
		} else {
			Storage.clearIt();
			sendResponse({success: false});
		}
	} else if (request.greeting === "loadData") {
		if (currentStylesOnPage()) {
			Storage.readFrom();
			sendResponse({currentData: currentStylesOnPage(), success: true});
		} else {
			Storage.readFrom();
			sendResponse({success: false});
		}
	}
});