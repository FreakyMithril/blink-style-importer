document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  let mainForm = document.getElementById('mainForm');
  let textAreaLog = document.getElementById('customCsslog');
  let currentCssArea = document.getElementById('currentCss');

  function notifyMessage(word) {
    textAreaLog.value += word + "\n";
  }

  function mainFunction() {

    let textAreaHtml = document.getElementById('cssStylesArea');
    let labelForNewCss = document.getElementById('cssStylesLabel');
    let stylesData = textAreaHtml.value;

    function sendStylesToPage(){
      labelForNewCss.innerHTML = 'Form Submitted';
      if (!stylesData) {
        labelForNewCss.innerHTML = 'Invalid text provided';
        notifyMessage( 'Please put styles');
      } else {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {greeting: "sendData", data: stylesData}, function(response) {
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
    sendStylesToPage();
  }

  mainForm.onsubmit = function(event){
    event.preventDefault();
    notifyMessage('Form Submitted');
    mainFunction();
  };
});
