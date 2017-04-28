function notifyMessage(word) {
  console.info('Blink extension says: ' + word);
}

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
  notifyMessage("Something happening from the extension");

  let data = request.data || {};
  let blinkStyles = document.getElementById('blinkStyles');

  function removeStylesOnPage() {
    document.getElementsByTagName('body')[0].removeChild(blinkStyles);
    notifyMessage('Styles Removed');
  }

  if (blinkStyles  === null) {
    notifyMessage('Blink style Not exist');
  } else {
    notifyMessage('Blink style Exist');
    removeStylesOnPage();
  }

  function addStylesOnPage() {
    let styles = document.createElement('style');
    styles.type = 'text/css';
    styles.id = 'blinkStyles';
    styles.innerHTML = data;
    document.getElementsByTagName('body')[0].appendChild(styles);
    notifyMessage('Styles Added');
  }


  if (request.greeting === "sendData") {
    addStylesOnPage();
    chrome.storage.sync.set({'StoredData': data}, function() {
      notifyMessage('Saved in Storage');
    });
    sendResponse({currentData: data, success: true});
  }
});