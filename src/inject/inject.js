chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);
		const httpRegex = /https?:\/\//g;
		const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
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
					while (!decoded.match(httpRegex) && decoded.search(regex) > -1 && numDecodes < 5) {
						decoded = decodeFunc(decoded);
						numDecodes++;
					}
					if (decoded.match(httpRegex)) {
						return decoded.replace(urlRegex, (url) => {
							return "<a href=\"" + url + "\" target=\"_blank\">" + url + "</a>";
						});
					}
					return match;
				});
			}
		}
	}
	}, 10);
});