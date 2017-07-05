let notifyMessage = word => {
  return false;
  console.log('Blink extension background script says: ', word);
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

let enableIcon = (id) => {
  chrome.browserAction.setIcon({
    tabId: id,
    path: {
      '128': 'img/icons/icon128on.png'
    }
  });
};
let disableIcon = (id) => {
  chrome.browserAction.setIcon({
    tabId: id,
    path: {
      '128': 'img/icons/icon128.png'
    }
  });
};

let pageLoad = {
  init: (pageUrl, tabId) => {
    chrome.tabs.sendMessage(tabId, {
      greeting: "loadDataAndSave",
      pageUrl: pageUrl
    }, response => {
      notifyMessage('Send data to page');
      if (response !==undefined && response.success === true) {
        enableIcon(tabId);
        notifyMessage('Loaded current ' + pageUrl + ' styles');
      }
      else {
        disableIcon(tabId);
        notifyMessage('No styles yet for ' + pageUrl);
      }
    });
  }
};

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (!/^http?.*$/.test(tab.url)) {
    notifyMessage('Page not correct ' + tab.url);
    return true;
    /*run only of page is correct*/
  }
  if (tab.status === 'complete') {
    let pageUrl = extractHostname(tab.url);
    pageLoad.init(pageUrl, tabId);
  }
});

let testing = () => {
  console.log('test');
};
testing();