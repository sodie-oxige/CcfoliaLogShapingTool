(async () => {
	const src = chrome.runtime.getURL("./module/option_pattern.js");
	const { def } = await import(src);

	if (document.title == "ccfolia - logs") {
		chrome.storage.local.get(null, function (result) {
			if (result.html == undefined) result = def;
			const req = result.html;
			console.log(req)
			let css = req.css,
				header = req.pattern[0][2],
				footer = req.pattern[1][2],
				pattern = req.pattern.slice(2),
				option = req.option;
			const tf = document.createElement("div");
			tf.id = "testField";
			tf.innerHTML = option.option_exElem;
			for (var elem of tf.querySelectorAll("#testField>*")) {
				document.body.appendChild(elem.cloneNode(true));
			}
			header = decodeURI(header.replace(/\{filename\}/g, location.href.match(/(?<=\/)[^\/]+$/)));
			footer = decodeURI(footer.replace(/\{filename\}/g, location.href.match(/(?<=\/)[^\/]+$/)));
			document.head.innerHTML = document.head.innerHTML.replace(/(?<=<title>).+(?=<\/title>)/, decodeURI(location.href.match(/(?<=\/)[^\/\.]+(?=\.[^\/\.]+)/))) + "<style>" + css + "</style>";
			document.body.innerHTML = "<header>" + header + "</header>" + document.body.innerHTML + "<footer>" + footer + "</footer>";
			let p = document.querySelector("body>p");
			while (p.tagName == "P") {
				let row = p.outerHTML.replace(/\t/g, "\t").replace(/\r?\n/g, "\n");
				tab = p.children[0].textContent.replace(/\s\[|\]/g, ""),
					author = p.children[1].textContent.replace(/[\(（]/g, "<wbr>$&").replace(/[・\)）]/g, "$&<wbr>"),
					text = p.children[2].innerHTML,
					color = p.style.color;
				text = text
					.replace(/(?!^)\r?\n(?!$)/g, "<br>\n")
					.replace(new RegExp(option.option_diceSuccess, "mg"), "<span style='color:blue;'>$&</span>")
					.replace(new RegExp(option.option_diceFailure, "mg"), "<span style='color:red;'>$&</span>");
				if (option.option_rubyCut) author = author.replace(/[\(（][a-zA-Zぁ-んァ-ンｦ-ﾟ・ー\s]+[）\)]/, "")
				var div = document.createElement("div");
				div.classList.add("container");
				div.setAttribute("row", row);
				for (var j = 0; j < pattern.length; j++) {
					var cond = false;
					var rt = "", reg = "";
					switch (pattern[j][0]) {
						case 0:
							cond = (tab == pattern[j][1]);
							break;
						case 1:
							cond = (author == pattern[j][1]);
							break;
						case 2:
							cond = (new RegExp(pattern[j][1]).test(tab));
							rt = tab;
							reg = new RegExp(pattern[j][1]);
							break;
						case 3:
							cond = (new RegExp(pattern[j][1]).test(author));
							rt = author;
							reg = new RegExp(pattern[j][1]);
							break;
					}
					if (cond) {
						var resultText = pattern[j][2].replace(/\{tab\}/g, tab)
							.replace(/\{author\}/g, author)
							.replace(/\{text\}/g, text)
							.replace(/\{color\}/g, color);
						if (reg != "") resultText = rt.match(reg)[0].replace(reg, resultText);
						div.innerHTML = resultText;
						break;
					}
				}
				if (!div.innerHTML) div.innerHTML = p.innerHTML;
				if (p.nextElementSibling != null) {
					var temp = p;
					p = p.nextElementSibling;
					document.body.insertBefore(div, temp);
					temp.remove();
				} else {
					document.body.insertBefore(div, p);
					p.remove();
					break;
				}
			}
		});
	}
})()
