function notifyMessage(word) {
  console.info('Blink extension says: ' + word);
}

function saveToStorage(data, url) {
	chrome.storage.sync.get(null, function (obj) {
		if (obj !== undefined) {
		  let tempObj = obj.alldata;
			console.log(tempObj);
			let element = {data, url};
			tempObj.push(element);
			chrome.storage.sync.set({tempObj}, function () {
				notifyMessage('Saved in Storage');
			});
        }
        else {
			let alldata = [];
			let element = {data, url};
			alldata.push(element);
			chrome.storage.sync.set({alldata}, function () {
				notifyMessage('Saved in Storage');
			});
        }
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
  //chrome.storage.sync.clear();
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
	    readFromStorage();
    } else {
      sendResponse({success: false});
    }
  } else if (request.greeting === "removeData") {
    if (removeStylesOnPage()) {
      sendResponse({success: true});
    } else {
      sendResponse({success: false});
    }
  } else if (request.greeting === "loadData") {
    if (currentStylesOnPage()) {
	    //readFromStorage('StoredData');
      sendResponse({currentData: currentStylesOnPage(), success: true});
    } else {
      sendResponse({success: false});
	    //readFromStorage('StoredData');
    }
  }
});