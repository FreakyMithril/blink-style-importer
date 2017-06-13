let notifyMessage = word => {
	//return false;
	console.log('Blink extension content script says: ', word);
};



let Storage = {
	checkForExistKey: (word) => {
		chrome.storage.sync.get(word, function (obj) {
			let exist;
			if (obj[word] !== undefined) {
				notifyMessage("There is searched key: '" + word + "' in Storage");
				exist = true;
			} else  {
				notifyMessage("No key in Storage");
				exist = false;
			}
			return exist;
		});
	},
	saveIn: (url, styles) => {
		let items = {};
		items[url] = styles;
		chrome.storage.sync.set(items);
		notifyMessage('Data successfully saved to the storage!');
	},
	readFrom: (searchWord, fn) => {
		chrome.storage.sync.get(searchWord, function (items) {
			fn(items[searchWord] || {});
		});
		notifyMessage('Just readed data from storage'); /*need make check for exist data in storage*/
	},
	readAndSaveFrom: (pageUrl) => {
		Storage.readFrom(pageUrl, function (siteStyle) {
			StyleOnPage.addThem(siteStyle);
		});
		notifyMessage('Data readed from storage and try to save to page');
	},
	clearAll: () => {
		chrome.storage.sync.clear();
		notifyMessage('All data in Storage cleared!');
	}
};

let StyleOnPage = {
	addThem: (data) => {
		notifyMessage("Need check for Exist before add, and remove if Exist");
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
		// if (StyleOnPage.checkForExist()) {
		// 	Storage.readFrom();
		// 	sendResponse({
		// 		currentData: StyleOnPage.checkForExist(),
		// 		success: true
		// 	});
		// }
		// else {
		// 	notifyMessage('No HTML Styles on site, status: success - false');
		// 	Storage.readFrom();
		// 	sendResponse({
		// 		success: false
		// 	});
		// }
		if (Storage.checkForExistKey(request.pageUrl)) {
			console.log ('yes')
		} else {
			console.log('no')
		}

		Storage.readFrom(request.pageUrl, function (siteStyle) {
			sendResponse({
				currentData: siteStyle,
				success: true  /*need make check for exist data in storage*/
			});
		});
	}
	else if (request.greeting === "loadDataAndSave") {
		Storage.readAndSaveFrom(request.pageUrl);
		sendResponse({
			success: true  /*need make check for exist data in storage*/
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