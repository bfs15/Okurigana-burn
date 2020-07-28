
var enabled;
var enableButton = document.getElementById('enable');

function fixState() {
	if (enabled) {
		// Activated button
		enableButton.innerText = "On";
		enableButton.style.background = "blue";
	} else {
		// Grayed out button
		enableButton.innerText = "Off";
		enableButton.style.background = "gray";
	}
}

function checkState(){
	chrome.runtime.sendMessage({
			isEnabled: true
		},
		function (r) {
			enabled = r.enabled;
			fixState();
		}
	);
}

enableButton.addEventListener('click', function () {
	enabled = !enabled;
	
	chrome.runtime.sendMessage({
		enableClick: enabled
	});

	checkState();
});


checkState();