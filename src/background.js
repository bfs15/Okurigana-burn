
// last url that was on a active, loading tab
var lastActiveTabUrl = '';
// state of the script
var enabled = true;

enable();

function enable () {
	chrome.tabs.onActivated.addListener(tabsOnActivated);
	chrome.tabs.onUpdated.addListener(tabsOnUpdated);
	enabled = true;
}

function disable () {
	chrome.tabs.onActivated.removeListener(tabsOnActivated);
	chrome.tabs.onUpdated.removeListener(tabsOnUpdated);
	enabled = false;
}

/**
 * Creates window
 */
function createWindow () {
	// console.log("Creating window");
	// // TODO settings.html instead
	// chrome.windows.create(
	// 	{
	// 		url: chrome.extension.getURL('browser_action/browser_action.html'),
	// 		state: 'minimized'
	// 	}, onWindowOpen);
}

/**
 * When a tab is activated, executeScript
 * @param  {[Tab]} tabInfo
 */
function tabsOnActivated(tabInfo) {
	if (!tabInfo.url || tabInfo.url.slice(0, 9) == 'chrome://') {
		return;
	}
	lastActiveTabUrl = tabInfo.url;
	executeScript(tabInfo.tabId);
}

function tabsOnUpdated(tabId, changeInfo, tabInfo) {
	if (tabInfo.url.slice(0, 9) == 'chrome://') {
		return;
	}
	if (tabInfo.active) {
		if (tabInfo.url !== lastActiveTabUrl) {
			executeScript(tabInfo.tabId);
		}
		lastActiveTabUrl = tabInfo.url;
	}
}

function executeScript(tabId) {
	if (enabled) {
		chrome.tabs.executeScript(tabId,
			{
				file: './dist/Okurigana-burn-bundle.js',
				runAt: 'document_idle'
			});
	}
}

// Message handler
chrome.runtime.onMessage.addListener(
	function receiveMessage (message, sender, sendResponse) {
		if (enabled) {
			main(message, sender, sendResponse);
		}

		if (message.enableClick != null) {
			if (enabled) {
				disable();
			} else {
				enable();
			}
			return;
		}

		if (message.isEnabled != null) {
			sendResponse({enabled: enabled});
			return;
		}
	}
);

function main (message, sender, sendResponse) {
	// if (message.nameOfMessage != null) {
	// 	// do something
	// }
}