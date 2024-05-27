import { def, Pattern } from "./module/option_pattern.js";
import { Dialog } from "./module/dialog.js";

//データの構成を変更したら基準バージョンも更新せよ=======================//

const border = "1.4.2";

//================================================================//
let html;
let patterns = [];

//localstorageからデータ取得
try {
	chrome.storage.local.get("html", function (result) {
		if (!result.html) result = def;
		html = result.html;
		console.log(html);
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
	//cssをセット
	document.querySelector(".css textarea").value = html.css;
	document.querySelector(".css textarea").addEventListener("keydown", (e) => {(new Pattern()).advanceKey(e)})

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

	//convert設定
	document.getElementById("convert_input").addEventListener("input", function () {
		let safe = 1;// 0:out, 1:safe, -1:error
		let data = {};
		try {
			data = JSON.parse(document.getElementById("convert_input").value).html;
		} catch {
			safe = -1;
		}
		console.log(data)
		i = 0;
		let ver = ((data.ver ? data.ver : "1.4.1") + ".0.0.0").split('.').reduce((acc, num, i) => acc + num * Math.pow(10, 2 - i), 0);
		let ver_ = (border + ".0.0.0").split('.').reduce((acc, num, i) => acc + num * Math.pow(10, 2 - i), 0);
		if (ver < ver_ && safe == 1) safe = 0;
		document.getElementById("convert_check").textContent = safe == 1 ? "◎ 最新バージョンです" : safe == 0 ? "↓ 新しいバージョンにコンバートします" : "データエラー";

		if (safe == 0) {
			let output = data;
			if (ver < 142) {
				console.log(ver)
				data.pattern = data.comment;
				data.pattern.unshift([0, "footer", data.footer]);
				data.pattern.unshift([0, "header", data.header]);
				data.ver = chrome.runtime.getManifest().version;
				delete data.comment;
				delete data.header;
				delete data.footer;
			}
			document.getElementById("convert_output").value = JSON.stringify({ html: data });
		} else {
			document.getElementById("convert_output").value = "";
		}
	})
	document.getElementById("convert_input").value = JSON.stringify({ html: html });
	const event = new Event('input', { bubbles: true, cancelable: true });
	document.getElementById("convert_input").dispatchEvent(event);
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
		console.log(JSON.parse(textarea.value));
		html = JSON.parse(textarea.value).html;
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