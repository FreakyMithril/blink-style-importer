let notifyMessage = word => {
	//return false;
	console.log('Blink extension content script says: ', word);
};



let Storage = {
	saveIn: (url, styles) => {
		let items = {};
		items[url] = styles;
		chrome.storage.sync.set(items);
		notifyMessage('Data successfully saved to the storage!');
	},
	readFrom: (searchWord, fn) => {
		chrome.storage.sync.get(searchWord, function (items) {
			fn(items[searchWord] || false);
		});
		notifyMessage('Just readed data from storage'); /*need make check for exist data in storage when use function*/
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

	if (request.greeting === "removeData") {
		if (StyleOnPage.removeThem()) {
			Storage.clearAll();
			sendResponse({
				success: true
			});
		}
		else {
			Storage.clearAll();
			sendResponse({
				success: false
			});
		}
	}
	else if (request.greeting === "loadData") {
		Storage.readFrom(request.pageUrl, function (siteStyle) {
			if (siteStyle) {
				notifyMessage("There is searched key: '" + request.pageUrl + "' in Storage");
				sendResponse({
					currentData: siteStyle,
					success: true
				});
			} else  {
				notifyMessage("No key in Storage");
				sendResponse({
					success: false
				});
			}
		});
	}
	else if (request.greeting === "loadDataAndSave") {
		Storage.readFrom(request.pageUrl, function (siteStyle) {
			if (siteStyle) {
				notifyMessage("There is searched key: '" + request.pageUrl + "' in Storage, try to save to page");
				StyleOnPage.addThem(siteStyle);
				sendResponse({
					success: true
				});
			} else  {
				notifyMessage("No key in Storage");
				sendResponse({
					success: false
				});
			}
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