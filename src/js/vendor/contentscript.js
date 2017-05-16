function notifyMessage(word) {
  console.info('Blink extension says: ' + word);
}
function extractHostname(url) {
	let hostname;
	if (url.indexOf("://") > -1) {
		hostname = url.split('/')[2];
	}
	else {
		hostname = url.split('/')[0];
	}
	hostname = hostname.split(':')[0];
	return hostname;
}

function saveToStorage(styles, url) {
	chrome.storage.sync.get(function(items) {
		if (Object.keys(items).length > 0 && items.data) {
			notifyMessage('Find data, adding new');
			items.data.push({pageUrl: url, blinkStyle: styles});
		} else {
			notifyMessage('No Data, create new');
			items.data = [{pageUrl: url, blinkStyle: styles}];
		}
		chrome.storage.sync.set(items, function() {
			notifyMessage('Data successfully saved to the storage!');
		});
	});
}

function readFromStorage() {
	chrome.storage.sync.get(null, function (obj) {
		console.log(obj);
	});
}

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
      saveToStorage(data, dataUrl);
      sendResponse({currentData: data, success: true});
    } else {
      sendResponse({success: false});
    }
  } else if (request.greeting === "removeData") {
    if (removeStylesOnPage()) {
	    chrome.storage.sync.clear();
      sendResponse({success: true});
    } else {
	    chrome.storage.sync.clear();
      sendResponse({success: false});
    }
  } else if (request.greeting === "loadData") {
    if (currentStylesOnPage()) {
	    readFromStorage();
      sendResponse({currentData: currentStylesOnPage(), success: true});
    } else {
	    readFromStorage();
      sendResponse({success: false});
    }
  }
});