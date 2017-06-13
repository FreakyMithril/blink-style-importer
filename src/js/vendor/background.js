let notifyMessage = word => {
	//return false;
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

let pageLoad = {
	init: (pageUrl) => {
		chrome.tabs.query({
			active: true,
			currentWindow: true
		}, tabs => {
			chrome.tabs.sendMessage(tabs[0].id, {
				greeting: "loadDataAndSave",
				pageUrl: pageUrl
			}, response => {
				notifyMessage('Send data to page');
				if (response.success === true) {
					notifyMessage('Loaded current styles');
				}
				else {
					notifyMessage('No Styles yet');
				}
			});
		});
	}
};

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if (tab.status === 'complete') {
		let elementUrl = extractHostname(tab.url);
		pageLoad.init(elementUrl)
	}
});