chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);
		let regex = undefined;
		let regexHtml = undefined;
		let decodeFunc = undefined;
		if (document.body.innerHTML.search("base64")) {
			regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/g;
			regexHtml = /\<code\>[\t\n ]*((?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?)[\t\n ]*\<\/code\>/g;
			decodeFunc = atob;
		}
		if (regex && regexHtml && decodeFunc && document.body.innerHTML.search(regexHtml) > -1) {
			document.body.innerHTML = document.body.innerHTML.replaceAll(regexHtml, (match, p1) => {
				let decoded = decodeFunc(p1);
				while (decoded.search(regex) > -1) {
					decoded = decodeFunc(decoded);
				}
				return "<code>" + p1 + "\n<a href=\"" + decoded + "\" target=\"_blank\">" + decoded + "</a></code>";
			});
		}
	}
	}, 10);
});