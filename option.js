import { def, Pattern } from "./module/option_pattern.js";
import { Dialog } from "./module/dialog.js";
import { HighlightTextarea } from "./module/highlightTextarea.js";

let html;
let patterns = [];

//localstorageからデータ取得
try {
	chrome.storage.local.get("html", function (result) {
		if (!result.html) result = def;
		html = convert(result.html);
		setData();
	});
} catch (error) {
	html = def.html;
	setData();
}
//データの設定三銃士を連れてきたよ！
//最初に動かすsetData「画面読み込み時に一回だけ」
function setData() {
	resetData();
	document.querySelector(".css textarea").addEventListener("input", () => { upData() });
}

//データ全体のリフレッシュresetData「全部作り直す」
function resetData() {
	console.log(html)
	//cssをセット
	document.querySelector(".css textarea").value = html.css;
	document.querySelector(".css textarea").addEventListener("keydown", (e) => { (new Pattern()).advanceKey(e) })

	//pattern達を全削除・再設定
	for (let p of patterns) {
		p.deletePattern();
	}
	patterns = [];
	Pattern.viewCss = document.querySelector(".css textarea").value;

	let i = 0;
	for (let pattern of (html.pattern || [])) {
		let p;
		if (i == 0) {
			p = new Pattern(pattern, document.createElement("header"));
			p.element.id = "header_pattern";
		} else if (i == 1) {
			p = new Pattern(pattern, document.createElement("footer"));
			p.element.id = "footer_pattern";
		} else p = new Pattern(pattern);
		p.newSet();
		if (i < 2) p.element.querySelector("input").disabled = true;
		patterns.push(p);
		i++;
	}

	//option設定
	for (let elem of document.querySelectorAll("#option :is(input,textarea)")) {
		switch (elem.type) {
			case "checkbox":
				elem.checked = html.option[elem.id];
				break;
			case "text":
			case "textarea":
				elem.value = html.option[elem.id];
				break;
		}
	}

	//シンタックスハイライト
	for (let elem of document.querySelectorAll("textarea[highlight]")) {
		new HighlightTextarea(elem);
		const event = new Event('input', { bubbles: true, cancelable: true });
		elem.dispatchEvent(event);
	}
}

//プレビューをリフレッシュupData「css変わったから変更するね」
function upData() {
	Pattern.viewCss = document.querySelector(".css textarea").value;
	for (let p of patterns) {
		p.htmlView();
	}
}

//データの保存・データ取得
function getData() {
	let res = {};
	res.css = document.querySelector(".css textarea").value;

	res.option = {};
	let elem;
	for (elem of document.querySelectorAll("#option :is(input,textarea)")) {
		switch (elem.type) {
			case "checkbox":
				res.option[elem.id] = elem.checked;
				break;
			case "text":
			case "textarea":
				res.option[elem.id] = elem.value;
				break;
		}
	}

	res.pattern = [];
	for (elem of document.querySelectorAll("div.pattern")) {
		var type1 = elem.querySelector("label.cond input[type='checkbox']").checked ? 1 : 0;
		var type2 = elem.querySelector("label.regex input[type='checkbox']").checked ? 1 : 0;
		var type = type1 + type2 * 2;
		var name = elem.querySelector("input[type='text']").value;
		var text = elem.querySelector("textarea").value;
		res.pattern.push([type, name, text]);
	}
	res.ver = chrome.runtime.getManifest().version;

	return { html: res };
}

//データの保存・メイン
function saveData() {
	let data = getData();
	console.log(data)
	chrome.storage.local.set(data, () => { });

	let notion = document.createElement("div");
	notion.classList.add("notion");
	let p = document.createElement("p");
	p.textContent = "保存しました"
	notion.appendChild(p);
	document.body.appendChild(notion);
	setTimeout(() => {
		notion.remove();
	}, 1000);

}

//各ボタン等の動作
//cssのfix
document.getElementById("fixed").onclick = () => {
	let input = document.getElementById("fixed").querySelector("input");
	input.checked = !input.checked;
}
//「保存」
document.getElementById("save").addEventListener("click", () => {
	saveData();
})
//「追加」
document.getElementById("add").addEventListener("click", () => {
	let p = new Pattern();
	p.newSet();
	patterns.push(p);
})
//「ﾘｾｯﾄ」
document.getElementById("reset").addEventListener("click", () => {
	let elem = document.createElement("p");
	elem.textContent = "設定を初期化します。よろしいですか？";
	new Dialog("設定の初期化", elem, () => {
		html = def.html;
		resetData();
	});
})
//出力
document.getElementById("export").addEventListener("click", () => {
	let elem = document.createElement("div");
	let p = document.createElement("p");
	p.innerHTML = "下のテキストエリアをクリックすると内容がコピーされます。"
	elem.appendChild(p);
	let textarea = document.createElement("textarea");
	textarea.value = JSON.stringify(getData());
	textarea.style = `
		width: 100%;
		height: 5em;
		white-space: break-spaces;
		word-break: break-all;`
	textarea.addEventListener("click", () => {
		navigator.clipboard.writeText(JSON.stringify(getData()));
	})
	elem.appendChild(textarea);
	new Dialog("設定の初期化", elem, () => { });
})
//入力
document.getElementById("import").addEventListener("click", () => {
	let elem = document.createElement("div");
	let p = document.createElement("p");
	p.innerHTML = "下のテキストエリアにデータを入力してください。"
	elem.appendChild(p);
	let textarea = document.createElement("textarea");
	textarea.style = `
		width: 100%;
		height: 5em;
		white-space: break-spaces;
		word-break: break-all;`
	textarea.addEventListener("click", () => {
		navigator.clipboard.readText().then((res) => { textarea.value = res; });
	})
	elem.appendChild(textarea);
	new Dialog("設定の初期化", elem, () => {
		html = convert(JSON.parse(textarea.value).html);
		resetData();
	});
})

//その他
//ctrl+Sで保存
window.addEventListener("keydown", function (e) {
	if (e.ctrlKey && e.code == "KeyS") {
		e.preventDefault();
		saveData();
	}
})

/*
setData => 最初に設定
	//css等へのデータ入力
	//patternの削除・設置
	イベントリスナー

resetData => データの入力
	css等へのデータ入力
	patternの削除・設置
	css等のイベントリスナーはしない

upData => cssの更新
	patternのiframe更新
*/

function convert(data) {
	let ver = ((data.ver || "1.4.1") + ".0.0.0").split('.').slice(0,3).reduce((acc, num) => acc*10 + num);

	let output = data;
	if (ver < 10402) {
		output.pattern = output.comment;
		output.pattern.unshift([0, "footer", output.footer]);
		output.pattern.unshift([0, "header", output.header]);
		output.ver = chrome.runtime.getManifest().version;
		delete output.comment;
		delete output.header;
		delete output.footer;
	}
	return output;
}