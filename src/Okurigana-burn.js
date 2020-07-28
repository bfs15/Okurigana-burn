// ==UserScript==
// @name        Load on Hover
// @namespace   *
// @version     1
// @grant       none
// ==/UserScript==

var queries = ['p', 'h1', 'a', 'yt-formatted-string', 'span'];
var queriesString = ['p, h1, a, yt-formatted-string, span'];

var executed = false;

if (!executed) {
	executed = true;
} else {
	throw new Error("Quit execution");
}

var HCdiv;

import Kuroshiro from "kuroshiro";

const kuroshiro = new Kuroshiro();

import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";
// const KuromojiAnalyzer = require("kuroshiro-analyzer-kuromoji");

if (document.getElementById("Okurigana-burn")) {
	// console.warn('Okurigana-burn already ran on this page');
	throw new Error("Quit execution");
}

createHCdiv();

// observe changes to document to add events as needed
var observer = new MutationObserver(function (mutations) {
	for (var i = 0; i < mutations.length; i++) {
		// if (mutations[i].type === 'attributes') {
		// 	console.log('\n\t~~~~~ mutation of type attributes ~~~~~\n , mutations[i]);
		// }
		for (var j = 0; j < mutations[i].addedNodes.length; j++) {
			handleChildElems(mutations[i].addedNodes[j]);
		}
	}
});

async function main() {
	// await kuroshiro.init(new KuromojiAnalyzer());
	await kuroshiro.init(new KuromojiAnalyzer({
		// dictPath: "https://github.com/takuyaa/kuromoji.js/tree/master/dict"
		dictPath: "node_modules/kuromoji/dict"
	}));
	handleChildElems(document.body);

	observer.observe(document.body, {
		characterData: true,
		childList: true,
		subtree: true
	});
}

main();

// div to insert content to load
// and to prove script is loaded
function createHCdiv () {
	HCdiv = document.createElement('div');
	HCdiv.id = 'Okurigana-burn';
	HCdiv.style = 'display: none;';

	document.body.appendChild(HCdiv);
}
/* tool */
function stripHtml(html) {
	var tmp = document.createElement("DIV");
	tmp.innerHTML = html;
	return tmp.textContent || tmp.innerText || "";
}

function elementChildsQuery(elem, query) {
	// add events to elements with links
	var elems = elem.querySelectorAll(query);

	for (var i = 0; i < elems.length; i++) {
		handleElement(elems[i]);
	}
}

/**
 * adds events to elem & elem childs, if they have valid links
 * @param {Object} elem
 */
function handleChildElems(elem) {
	if (elem.querySelectorAll == null) {
		return;	// TODO this test is prob unnecessary if you don't call this on certain mutations (attributes?)
	}
	for (var i = 0; i < queries.length; i++) {
		elementChildsQuery(elem, queries[i]);
	}
}

/**
 * adds events elem, if they have valid links
 * @param {Object} elem
 */
async function handleElement(elem) {
	// var text = stripHtml(elem.innerHTML);
	var text = elem.innerText;
	if (!text || !stripHtml(elem.innerHTML) || elem.firstElementChild || !Kuroshiro.Util.hasJapanese(text)) {
		if (text && elem.firstElementChild) {
			// elementChildsQuery(elem, queriesString);
			// var elems = elem.querySelectorAll(queriesString);
			// console.warn(text);
			// console.log(elem);
			// console.log(elems);
		}
		return;
	}

	const result = await kuroshiro.convert(text, {
		to: "romaji",
		mode: "spaced",
		romajiSystem: "hepburn"
	});
	var concatResult = "\n【 " + result + " 】";
	elem.innerHTML = elem.innerHTML + concatResult;
	// elem.innerText = elem.innerText + concatResult;
}
