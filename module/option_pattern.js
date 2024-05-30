export const def = {"html":{"css":"div,p,span{\n\tpadding: 0;\n\tmargin: 0;\n\tposition: relative;\n\tbox-sizing: border-box;\n}\nheader{\n\tposition: fixed;\n\ttop: 0;\n\tleft: 0;\n\theight: 1rem;\n\twidth: 100%;\n\tbackground: black;\n\tcolor: white;\n\tfont-size: .8em;\n\tz-index: 1;\n}\nbody{\n\tmargin: 1em auto 0;\n\tmax-width: 1000px;\n\tbackground-color: #ddd;\n\toverflow-x: hidden;\n}\n.main{\n\tpadding: .5em;\n\tdisplay: flex;\n\tgap: 10px;\n\tbackground-color: white;\n\tborder-bottom: thin solid black;\n\tborder-image: linear-gradient(to right, transparent, rgba(0,0,0,0.1) 10%, rgba(0,0,0,0.1) 90%, transparent);\n\tborder-image-slice: 1;\n}\n.main>p{\n\tmargin: auto 0;\n\theight: 100%;\n}\n.main>p:first-child{\n\twidth: 9.5em;\n\tmin-width: 9.5em;\n\tpadding-right: .5em;\n\ttext-align: end;\n\tword-break: keep-all;\n}\n.main::before{\n\tcontent: \"\";\n\tposition: absolute;\n\tleft: 10em;\n\ttop: 4px;\n\twidth: 2.5px;\n\theight: calc(100% - 8px);\n\tbackground-color: var(--c);\n\tfilter: contrast(2) saturate(2);\n}\n.chat{\n\t--bc: #eee;\n\tmargin-left: 4em;\n\tbackground-color: transparent;\n\tbackground-image: linear-gradient(to right, transparent, var(--bc) 10%);\n\tborder: none;\n\tfont-size: .8em;\n}\n.chat>p{\n\tcolor: var(--c);\n\tfilter: brightness(50%);\n}\n.secret{\n\tbackground-image: linear-gradient(to right, red, red 3px, #888 1%, #888);\n\tborder-image: linear-gradient(to right, transparent, silver 10%, silver 90%, transparent);\n\tborder-image-slice: 1;\n}\n.secret>p{\n\tcolor: var(--c);\n\tfont-weight: bold;\n\tfilter: brightness(200%);\n}\n.secret>p:first-child{\n\tline-height: 1.1;\n}\n.secret>p:first-child>span{\n\tfont-size: .5em;\n}\n.strategy{\n\tbackground-image: none;\n\tmargin-left: 5em;\n}\n.strategy>p{\n\tcolor: var(--c);\n\tfilter: brightness(50%);\n}\n.rp{\n\tmargin-left: 3em;\n\tfont-size: .5em;\n\tbackground-color: #f8f8f8;\n}\n.rp>p{\n\tcolor: var(--c);\n\tfilter: brightness(50%);\n}\n.info{\n\tmargin: 5px;\n\tletter-spacing: .1em;\n\tfont-weight: bold;\n\tfont-family: system-ui;\n}\n.info>span{\n\tfont-size: .8em;\n}\n.info>p{\n\tmargin: 0 min(25%, 30px);\n\tdisplay: block;\n\twidth: fit-content;\n}\n.system>p{\n\tmargin: 0 auto;\n}\n\n.memo{\n\t--name: attr(name);\n\tmargin: .5em;\n\tpadding: 1em 2em;\n\toverflow: hidden;\n\tborder-radius: 5px;\n\tbackground-color: #eee;\n\tfont-family: \"UD デジタル 教科書体 N-R\";\n\tline-height: 1.5;\n}\n.memo p:first-child{\n\ttext-align: end;\n}\n.memo p:first-child::after{\n\tcontent: var(--name);\n\tposition: absolute;\n\tleft: -1em;\n\tbottom: .2em;\n\twidth: fit-content;\n\theight: 3px;\n\tbackground-color: var(--c);\n}\n.memo::after{\n\tcontent: var(--name);\n\tposition: absolute;\n\ttop: .66em;\n\tleft: 1em;\n\tfont-size: 1.2em;\n}\n.memo::before{\n\tcontent: \"\";\n\tposition: absolute;\n\ttop: .8em;\n\tleft: 1em;\n\twidth: calc(100% - 2em);\n\theight: 100%;\n\tbackground-image: repeating-linear-gradient(to bottom, #eee, #eee calc(1.5em - 1px), silver, #eee 1.5em);\n}\n.other{\n\tpadding: .5em .5em .5em 1.5em;\n\tbackground-color: transparent;\n\tcolor: var(--c);\n\tfilter: brightness(50%);\n}\n.other::before{\n\tdisplay: none;\n}","option":{"option_rubyCut":true,"option_diceSuccess":"\\([^(]+(成功|成功数\\D*?([1-9]+[0-9]|[1-9])|スペシャル)\\D*?$","option_diceFailure":"\\([^(]+(失敗|成功数\\D*?0)\\D*?$"},"pattern":[[0,"header","<p>{filename}</p>"],[0,"footer",""],[0,"header","<p>{filename}</p>"],[0,"footer",""],[1,"system","\t<div class=\"info system\" style=\"--c:{color}\">\n\t\t<p>{text}</p>\n\t</div>"],[0,"メイン","\t<div class=\"main\" style=\"--c:{color}\">\n\t\t<p>{author}</p>\n\t\t<p>{text}</p>\n\t</div>"],[0,"雑談","\t<div class=\"main chat\" style=\"--c:{color}\">\n\t\t<p>{author}</p>\n\t\t<p>{text}</p>\n\t</div>"],[0,"情報","\t<div class=\"info\" style=\"--c:{color}\">\n\t\t<span>{author}</span>\n\t\t<p>{text}</p>\n\t</div>"],[2,"メモ.*","\t<div class=\"memo\" name=\"{tab}\" style=\"--c:{color}\">\n\t\t<p>{author}</p>\n\t\t<p>{text}</p>\n\t</div>"],[2,"秘匿\\((.+?),(.+?)\\)","\t<div class=\"main chat secret\" style=\"--c:{color}\">\n\t\t<p>{author}<br><span>$1 - $2</span></p>\n\t\t<p>{text}</p>\n\t</div>"],[2,"作戦|会議|作戦会議","\t<div class=\"main chat strategy\" style=\"--c:{color}\">\n\t\t<p>{author}</p>\n\t\t<p>{text}</p>\n\t</div>"],[0,"演出","\t<div class=\"main rp\" style=\"--c:{color}\">\n\t\t<p>{author}</p>\n\t\t<p>{text}</p>\n\t</div>"],[2,"(その他)?.*","\t<div class=\"main other\" style=\"--c:{color}\" tab=\"{tab}\">\n\t\t<p>[{tab}]{author}：</p>\n\t\t<p>{text}</p>\n\t</div>"]],"ver":"1.5"}};
export class Pattern {
	static viewCss = "";

	constructor(arr, elem) {
		this.type = !!(arr && arr[0]) ? arr[0] : 0;
		this.name = !!(arr && arr[1]) ? arr[1] : "";
		this.context = !!(arr && arr[2]) ? arr[2] : "";
		this.element = document.createElement("div");
		this.element.classList.add("pattern", "flex");
		if (!!elem) {
			this.contaienr = elem.cloneNode();
		} else {
			this.contaienr = document.createElement("div");
			this.contaienr.classList.add("container");
		}
		this.element.getPattern = () => {
			return this;
		}
	}

	newSet() {
		var a = false, b = false;
		if (this.type % 2 == 1) a = true;
		if (this.type >= 2) b = true;

		let div = document.createElement("div");
		div.classList.add("vflex");
		let div2 = document.createElement("div");
		div2.classList.add("head", "flex");
		let input = document.createElement("input");
		input.type = "text";
		input.value = this.name;
		div2.appendChild(input);
		let label = document.createElement("label");
		label.classList.add("regex");
		let input2 = document.createElement("input");
		input2.type = "checkbox";
		input2.checked = b;
		label.appendChild(input2);
		let p = document.createElement("p");
		p.textContent = "正規表現";
		label.appendChild(p);
		div2.appendChild(label);
		let label2 = document.createElement("label");
		label2.classList.add("cond");
		let input3 = document.createElement("input");
		input3.type = "checkbox";
		input3.checked = a;
		label2.appendChild(input3);
		let div3 = document.createElement("div");
		div3.classList.add("flex", "check");
		let p2 = document.createElement("p");
		p2.textContent = "タブ";
		div3.appendChild(p2);
		let p3 = document.createElement("p");
		p3.textContent = "発言者";
		div3.appendChild(p3);
		label2.appendChild(div3);
		div2.appendChild(label2);
		let button = document.createElement("button");
		button.classList.add("up");
		div2.appendChild(button);
		let button2 = document.createElement("button");
		button2.classList.add("down");
		div2.appendChild(button2);
		let button3 = document.createElement("button");
		button3.classList.add("delete");
		div2.appendChild(button3);
		div.appendChild(div2);
		let div4 = document.createElement("div");
		div4.classList.add("textarea");
		let textarea = document.createElement("textarea");
		textarea.setAttribute("highlight", "html");
		textarea.value = this.context;
		div4.appendChild(textarea);
		div.appendChild(div4);
		this.element.appendChild(div);
		let iframe = document.createElement("iframe");
		this.element.appendChild(iframe);

		button.addEventListener("click", () => { this.moveUp() });
		button2.addEventListener("click", () => { this.moveDown() });
		button3.addEventListener("click", () => { this.deletePattern() });
		textarea.addEventListener("input", () => { this.htmlView() });
		textarea.addEventListener("keydown", (e) => { this.advanceKey(e) });

		document.getElementById("html").insertBefore(this.element, document.getElementById("buttons"));

		let style = document.createElement("style");
		style.textContent = "body{overflow-y:hidden;}";
		iframe.contentDocument.head.appendChild(style);

		this.htmlView();
	}

	moveUp() {
		let elem1 = this.element.previousSibling;
		let elem2 = this.element;
		if (elem1.id != "footer_pattern") this.moveChange(elem1, elem2);
	}
	moveDown() {
		let elem1 = this.element;
		let elem2 = this.element.nextElementSibling;
		if (elem2.id != "buttons") this.moveChange(elem1, elem2);
	}
	moveChange(elem1, elem2) {
		elem1.parentNode.insertBefore(elem2, elem1);
		elem2.getPattern().htmlView();
	}

	deletePattern() {
		this.element.remove();
	}

	htmlView() {
		let style;
		const iframe = this.element.querySelector("iframe");
		if (!(style = iframe.contentDocument.head.querySelector("#viewCss"))) {
			style = document.createElement("style");
			style.id = "viewCss";
			iframe.contentDocument.head.appendChild(style);
		}
		style.textContent = Pattern.viewCss;

		this.contaienr.innerHTML = this.element.querySelector("textarea").value.replace(/\{tab\}/g, "タブ").replace(/\{author\}/g, "発言者").replace(/\{text\}/g, "これはデモテキストです。\n発言はこのように表示されます。").replace(/\{color\}/g, "#00ffff");
		iframe.contentDocument.body.appendChild(this.contaienr);
	}

	advanceKey(e) {
		let check = true;
		switch (e.code) {
			case "Tab":
				e.preventDefault();
				insertText(e.currentTarget, "\t");
				break;
			case "Enter":
				e.preventDefault();
				var val = e.currentTarget.value,
					pos = e.currentTarget.selectionStart,
					c = 0;
				while (val.substr(pos - 1, 1) != "\n" && pos != 0) {
					if (val.substr(pos - 1, 1) == "\t") { c++; } else { c = 0; }
					pos--;
				}
				insertText(e.currentTarget, "\n");
				for (var i = 1; i <= c; i++) insertText(e.currentTarget, "\t");
				break;
			default:
				check = false;
		}
		if(check){
			const event = new Event('input', { bubbles: true, cancelable: true });
			e.target.dispatchEvent(event);
		}
	}
}
function insertText(target,text){
	const selectionStart = target.selectionStart;
	const selectionEnd = target.selectionEnd;
	const startText = target.value.slice(0, selectionStart);
	const endText = target.value.slice(selectionEnd);
	target.value = startText + text + endText;
	// 挿入文字列の末尾にカーソルを移動させる
	target.selectionEnd = selectionStart + text.length;
}