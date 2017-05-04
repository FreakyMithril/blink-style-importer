document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  const submitStyles = document.getElementById('submitStyles');
  const clearStyles = document.getElementById('clearStyles');
  const loadStyles = document.getElementById('loadStyles');
  const textAreaLog = document.getElementById('customCsslog');
  const currentCssArea = document.getElementById('currentCss');
  const labelForNewCss = document.getElementById('cssStylesLabel');

  function notifyMessage(word) {
    textAreaLog.value += word + "\n";
  }

  function sendStylesToPage() {
    let textAreaHtml = document.getElementById('cssStylesArea');
    let stylesData = textAreaHtml.value;

    labelForNewCss.innerHTML = 'Form Submitted';
    if (!stylesData) {
      labelForNewCss.innerHTML = 'Invalid text provided';
      notifyMessage('Please put styles');
    } else {
      chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {greeting: "sendData", data: stylesData}, function (response) {
          labelForNewCss.innerHTML = 'Changed data in page';
          notifyMessage('Send data to extension');
          if (response.success === true) {
            currentCssArea.value = response.currentData;
            notifyMessage('Show current styles');
          } else {
            notifyMessage('Something wrong');
          }
        });
      });
    }
  }

  function clearStylesOnPage() {
    let blinkStyles = document.getElementById('blinkStyles');

    labelForNewCss.innerHTML = 'Send submit for clearing form';

    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {greeting: "removeData"}, function (response) {
        labelForNewCss.innerHTML = 'Submit new Blink styles on page';
        notifyMessage('Send data to extension');
        if (response.success === true) {
          currentCssArea.value = '';
          notifyMessage('Removed current styles');
        } else {
          notifyMessage('Something wrong');
        }
      });
    });
  }

  function loadStylesFromPage() {
    let blinkStyles = document.getElementById('blinkStyles');

    labelForNewCss.innerHTML = 'Sending submit for load Styles';

    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {greeting: "loadData"}, function (response) {
        labelForNewCss.innerHTML = 'Submit new Blink styles on page';
        notifyMessage('Send data to extension');
        if (response.success === true) {
          currentCssArea.value = response.currentData;
          notifyMessage('Loaded current styles');
        } else {
          notifyMessage('Something wrong');
        }
      });
    });
  }

  submitStyles.onclick = function (event) {
    event.preventDefault();
    notifyMessage('Sending form Submission');
    sendStylesToPage();
  };

  clearStyles.onclick = function (event) {
    event.preventDefault();
    notifyMessage('Sending submit for clear form');
    clearStylesOnPage();
  };

  loadStyles.onclick = function (event) {
    event.preventDefault();
    notifyMessage('Sending submit for load Styles');
    loadStylesFromPage();
  };
});
