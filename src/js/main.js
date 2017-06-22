const mainTab = document.getElementById('fixed-tab-1');
const optionsPage = document.getElementById('optionsPage');
const snackbarContainer = document.getElementById('toastLog');

let notifyMessage = (word, showBar = false) => {
  let textAreaLog = document.getElementById('customCsslog');
  if(textAreaLog) {
    textAreaLog.innerHTML += "<tr><td class='mdl-data-table__cell--non-numeric'>" + word + "</td></tr>";
  }

  if(showBar) {
    let data = {
      message: word,
      timeout: 500
    };
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
  }
};

let extractHostname = url => {
  let hostname;
  if (url.indexOf("://") > -1) {
    hostname = url.split('/')[2];
  }
  else {
    hostname = url.split('/')[0];
  }
  hostname = hostname.split(':')[0];
  return hostname;
};

// scripts for main Tab only
if (mainTab) {
  let submitStyles = document.getElementById('submitStyles');
  let clearStyles = document.getElementById('clearStyles');
  let clearCurrentSite = document.getElementById('removeCurrentSite');
  let loadAllStyles = document.getElementById('showAllStorageData');
  let labelForNewCss = document.getElementById('cssStylesLabel');
  let textAreaHtml = document.getElementById('cssStylesArea');
  let tempData = {};

  let saveTempData = (url, styles) => {
    tempData.url = url;
    tempData.styles = styles;
  };

  let myCodeMirror = CodeMirror.fromTextArea(textAreaHtml, {
    lineNumbers: true,
    showCursorWhenSelecting: false,
    autofocus: false,
    mode: "css",
    gutters: ["CodeMirror-lint-markers"],
    lint: true,
    extraKeys: {
      "Ctrl-Space": "autocomplete"
    },
    autoCloseBrackets: true,
    matchBrackets: true
  });

  let Blink = {
    sendToPage: () => {
      myCodeMirror.save();

      let stylesData = textAreaHtml.value;

      labelForNewCss.innerHTML = 'Form Submitted';
      if (!stylesData) {
        labelForNewCss.innerHTML = 'Invalid text provided';
        notifyMessage('Please put styles');
      }
      else {
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
          let elementUrl = extractHostname(tabs[0].url);
          saveTempData(elementUrl, stylesData);
          chrome.tabs.sendMessage(tabs[0].id, tempData, response => {
            labelForNewCss.innerHTML = 'Changed data in page';
            notifyMessage('Send data to extension');
            if (response.success === true) {
              notifyMessage('Show current styles');
            }
            else {
              notifyMessage('Something wrong');
            }
          });
        });
      }
    },
    clearAll: () => {
      labelForNewCss.innerHTML = 'Send submit for clearing form';

      chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        let elementUrl = extractHostname(tabs[0].url);
        chrome.tabs.sendMessage(tabs[0].id, {
          greeting: "removeAllData",
          pageUrl: elementUrl
        }, response => {
          labelForNewCss.innerHTML = 'Submit new Blink styles on page';
          notifyMessage('Send data to extension');
          if (response.success === true) {
            notifyMessage('Removed all styles from storage');
          }
          else {
            notifyMessage('Something wrong');
          }
        });
      });
    },
    clearThisPage: () => {
      labelForNewCss.innerHTML = 'Send submit for clearing site form';

      chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        let elementUrl = extractHostname(tabs[0].url);
        chrome.tabs.sendMessage(tabs[0].id, {
          greeting: "removeCurrentData",
          pageUrl: elementUrl
        }, response => {
          labelForNewCss.innerHTML = 'Submit new Blink styles on page';
          notifyMessage('Send data to extension');
          if (response.success === true) {
            notifyMessage('Removed current site styles from storage');
          }
          else {
            notifyMessage('Something wrong');
          }
        });
      });
    },
    loadThisPage: () => {
      labelForNewCss.innerHTML = 'Sending submit for load site Styles';

      chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        let elementUrl = extractHostname(tabs[0].url);
        chrome.tabs.sendMessage(tabs[0].id, {
          greeting: "loadCurrentData",
          pageUrl: elementUrl
        }, response => {
          labelForNewCss.innerHTML = 'Submit new Blink styles on page';
          notifyMessage('Send data to extension');
          if (response.success === true) {
            myCodeMirror.setValue(response.currentData); //save to blink editor
            notifyMessage('Loaded current styles');
          }
          else {
            notifyMessage('No Styles yet');
          }
        });
      });
    },
    loadAll: () => {
      labelForNewCss.innerHTML = 'Sending submit for load all Styles';

      chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, {
          greeting: "loadAllData"
        }, response => {
          labelForNewCss.innerHTML = 'Submit new Blink styles on page';
          notifyMessage('Send data to extension');
          if (response.success === true) {
            notifyMessage('Loaded all styles to console');
          }
          else {
            notifyMessage('No Styles data yet');
          }
        });
      });
    }
  };

  submitStyles.addEventListener('click', event => {
    event.preventDefault();
    notifyMessage('Sending form Submission', true);
    Blink.sendToPage();
  });

  clearStyles.addEventListener('click', event => {
    event.preventDefault();
    notifyMessage('Sending submit for clear all styles', true);
    Blink.clearAll();
  });

  clearCurrentSite.addEventListener('click', event => {
    event.preventDefault();
    notifyMessage('Sending submit for clear site styles', true);
    Blink.clearThisPage();
  });

  loadAllStyles.addEventListener('click', event => {
    event.preventDefault();
    notifyMessage('Sending submit for load all Styles', true);
    Blink.loadAll();
  });

  // load script when modal is opened
  Blink.loadThisPage();
}

// scripts for options Tab only
if(optionsPage) {
  let clearConfigButton = document.getElementById('clearOptions');
  let installDefaultConfigButton = document.getElementById('installDefaultOptions');
  let saveConfigButton = document.getElementById('saveOptions');

  let BlinkOptions = {
    needSave: () => {
      chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, {
          greeting: "optionsSave"
        }, response => {
          if (response.success === true) {
            notifyMessage('Options saved in storage', true);
          }
          else {
            notifyMessage('Something wrong', true);
          }
        });
      });
    },
    needDefault: () => {
      chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, {
          greeting: "optionsDefault"
        }, response => {
          if (response.success === true) {
            notifyMessage('Installed default options in storage', true);
          }
          else {
            notifyMessage('Something wrong', true);
          }
        });
      });
    },
    needClear: () => {
      chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, {
          greeting: "optionsClear"
        }, response => {
          if (response.success === true) {
            notifyMessage('Removed options from storage', true);
          }
          else {
            notifyMessage('Something wrong', true);
          }
        });
      });
    }
  };

  saveConfigButton.addEventListener('click', event => {
    event.preventDefault();
    notifyMessage('Sending submit for save options', true);
    BlinkOptions.needSave();
  });

  installDefaultConfigButton.addEventListener('click', event => {
    event.preventDefault();
    notifyMessage('Sending submit for default options', true);
    BlinkOptions.needDefault();
  });

  clearConfigButton.addEventListener('click', event => {
    event.preventDefault();
    notifyMessage('Sending submit for clear options', true);
    BlinkOptions.needClear();
  });
}

