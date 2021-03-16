chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);
		let regex = undefined;
		let regexHtml = undefined;
		let decodeFunc = undefined;
		if (document.body.innerHTML.search("base64") || true) {
			regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/g;
			regexHtml = /(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?/g;
			decodeFunc = atob;
		}
		const tagElems = ["code", "dd"];
		let elements = [];
		for (const tag of tagElems) {
			elements = elements.concat([...document.getElementsByTagName(tag)]);
		}
		if (regex && regexHtml && decodeFunc) {
			for (const ele of elements) {
				ele.innerHTML = ele.innerHTML.replaceAll(regexHtml, (match) => {
					if (match.length < 24) {
						return match;
					}
					let numDecodes = 0
					let decoded = decodeFunc(match);
					while (!(decoded.includes("http://") || decoded.includes("https://")) && decoded.search(regex) > -1 && numDecodes < 5) {
						decoded = decodeFunc(decoded);
						numDecodes++;
					}
					if (decoded.includes("http://") || decoded.includes("https://")) {
						return "<a href=\"" + decoded + "\" target=\"_blank\">" + decoded + "</a>";
					}
					return match;
				});
			}
		}
	}
	}, 10);
});