function notifyMessage(word) {
  console.info('Blink extension says: ' + word);
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
      chrome.storage.sync.set({'StoredData': data}, function () {
        notifyMessage('Saved in Storage');
      });
      sendResponse({currentData: data, success: true});
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
      sendResponse({currentData: currentStylesOnPage(), success: true});
    } else {
      sendResponse({success: false});
    }
  }
});