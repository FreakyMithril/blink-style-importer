const READY = () => {
	let submitStyles = document.getElementById('submitStyles');
	let clearStyles = document.getElementById('clearStyles');
	let loadStyles = document.getElementById('loadStyles');
	let textAreaLog = document.getElementById('customCsslog');
	let currentCssArea = document.getElementById('currentCss');
	let labelForNewCss = document.getElementById('cssStylesLabel');
	let snackbarContainer = document.getElementById('toastLog');
	let textAreaHtml = document.getElementById('cssStylesArea');

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
			} else {
				chrome.tabs.query({active: true, currentWindow: true}, tabs => {
					let elementUrl = extractHostname(tabs[0].url);
					chrome.tabs.sendMessage(tabs[0].id, {
						greeting: "sendData",
						data: stylesData,
						dataUrl: elementUrl
					}, response => {
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
		},
		clearOnPage: () => {
			let blinkStyles = document.getElementById('blinkStyles');

			labelForNewCss.innerHTML = 'Send submit for clearing form';

			chrome.tabs.query({active: true, currentWindow: true}, tabs => {
				chrome.tabs.sendMessage(tabs[0].id, {greeting: "removeData"}, response => {
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
		},
		loadFromPage: () => {
			let blinkStyles = document.getElementById('blinkStyles');

			labelForNewCss.innerHTML = 'Sending submit for load Styles';

			chrome.tabs.query({active: true, currentWindow: true}, tabs => {
				chrome.tabs.sendMessage(tabs[0].id, {greeting: "loadData"}, response => {
					labelForNewCss.innerHTML = 'Submit new Blink styles on page';
					notifyMessage('Send data to extension');
					if (response.success === true) {
						currentCssArea.value = response.currentData;
						notifyMessage('Loaded current styles');
					} else {
						notifyMessage('No Styles yet');
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
		notifyMessage('Sending submit for clear form');
		Blink.clearOnPage();
	});

	loadStyles.addEventListener('click', event => {
		event.preventDefault();
		notifyMessage('Sending submit for load Styles');
		Blink.loadFromPage();
	});
	
	chrome.tabs.executeScript(null, {
		code: Blink.loadFromPage()
	});
};
document.addEventListener("DOMContentLoaded", READY);