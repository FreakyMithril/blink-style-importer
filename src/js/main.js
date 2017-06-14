let submitStyles = document.getElementById('submitStyles');
let clearStyles = document.getElementById('clearStyles');
let clearCurrentSite = document.getElementById('removeCurrentSite');
let loadStyles = document.getElementById('loadStyles');
let loadAllStyles = document.getElementById('showAllStorageData');
let textAreaLog = document.getElementById('customCsslog');
let labelForNewCss = document.getElementById('cssStylesLabel');
let snackbarContainer = document.getElementById('toastLog');
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

let notifyMessage = word => {
	textAreaLog.innerHTML += "<tr><td class='mdl-data-table__cell--non-numeric'>" + word + "</td></tr>";
	let data = {
		message: 'Log: ' + word,
		timeout: 1000
	};
	snackbarContainer.MaterialSnackbar.showSnackbar(data);
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
	notifyMessage('Sending form Submission');
	Blink.sendToPage();
});

clearStyles.addEventListener('click', event => {
	event.preventDefault();
	notifyMessage('Sending submit for clear form and all styles');
	Blink.clearAll();
});

clearCurrentSite.addEventListener('click', event => {
	event.preventDefault();
	notifyMessage('Sending submit for clear form and site styles');
	Blink.clearThisPage();
});

loadStyles.addEventListener('click', event => {
	event.preventDefault();
	notifyMessage('Sending submit for load Styles');
	Blink.loadThisPage();
});

loadAllStyles.addEventListener('click', event => {
	event.preventDefault();
	notifyMessage('Sending submit for load all Styles');
	Blink.loadAll();
});

chrome.tabs.executeScript(null, {
	code: Blink.loadThisPage()
});