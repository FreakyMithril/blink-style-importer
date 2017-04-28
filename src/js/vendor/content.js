chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
  notifyMessage("Something happening from the extension");

  function notifyMessage(word) {
    console.log('Blink extension says: ' + word);
  }

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

  let data = request.data || {};

  function addStylesOnPage() {
    let styles = document.createElement('style');
    styles.type = 'text/css';
    styles.id = 'blinkStyles';
    styles.innerHTML = data;
    document.getElementsByTagName('body')[0].appendChild(styles);
    notifyMessage('Styles Added');
  }
  addStylesOnPage();

  sendResponse({data: data, success: true});
});