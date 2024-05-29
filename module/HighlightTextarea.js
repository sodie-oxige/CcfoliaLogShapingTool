export class HighlightTextarea {
	constructor(elem) {
		this.element = elem;
		this.createDOM();
	}

	createDOM() {
		this.display = document.createElement("div");
		this.display.classList.add("hilight_display");
		this.shadow = this.display.attachShadow({ mode: 'open' });
		this.element.before(this.display);

		let zindex = window.getComputedStyle(this.element).zIndex;
		this.tabsize = Number(window.getComputedStyle(this.element).tabSize);

		this.element.style.zIndex = zindex + 1;
		this.element.style.color = "transparent";
		this.element.style.backgroundColor = "transparent";
		this.element.style.caretColor = "black";
		this.onresize();

		this.shadow_p = document.createElement("p");
		this.shadow.appendChild(this.shadow_p);
		let style = document.createElement("style");
		style.innerHTML = `
			p{
				box-sizing: border-box;
				margin: 0;
				padding: ${window.getComputedStyle(this.element).padding};
				padding-bottom: calc(${window.getComputedStyle(this.element).paddingBottom} + 1em);
				height: 100%;
				overflow: auto;
				font-family: ${window.getComputedStyle(this.element).fontFamily};
				line-height: ${window.getComputedStyle(this.element).lineHeight};
				tab-size: ${this.tabsize};
				white-space: pre;
				scrollbar-width: none;
			}
			span.red{
				color: red;
			}
			span.green{
				color: green;
			}
			span.chocolate{
				color: chocolate;
			}
			span.blue{
				color: blue;
			}
			span.gray{
				color: #eee;
			}
			span.bold{
				font-weight: bold;
			}
			span.tab{
				position: relative;
				display: inline-block;
				width: 0;
			}
			span.tab::before{
				content: "|";
				position: absolute;
				bottom: 0;
				right: 5px;
				color: #eee;
			}
		`
		this.shadow.appendChild(style);
		this.oninput();

		this.element.addEventListener("input", () => {
			this.oninput();
		})
		this.element.addEventListener("scroll", () => {
			this.onscroll();
		})
		window.addEventListener("resize", () => {
			this.onresize();
		})
	}

	oninput() {
		var text = this.element.value
			.replace(/&/g, "&amp;")
			.replace(/;/g, "&#0059;")
			.replace(/&amp&#0059;/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&apos;")
			.replace(/ /g, "&#x20;");
		switch (this.element.getAttribute("highlight")) {
			case "html":
				text = text.replace(/(?<=&lt;\/?)(?!\/)([a-zA-Z\d])+(?=&gt;|&#x20;|\s)/g, "<span class='red'>$&</span>")
					.replace(/(?<=&lt;(?!&gt;)[\s\S]*)&quot;((?!&quot;)[\s\S])*&quot;/g, "<span class='green'>$&</span>")
					.replace(/(?<=&lt;(?!&gt;)[\s\S]*)&apos;((?!&apos;)[\s\S])*&apos;/g, "<span class='green'>$&</span>")
					.replace(/(?<=^|&gt;|\t)((?!&lt;)(?!&gt;)(?!\t)[\s\S])+(?=$|&lt;)/gm, "<span class='bold'>$&</span>")
				break;
			case "css":
				text = text//.replace(/white|whitesmoke|ghostwhite|aliceblue|lavender|azure|lightcyan|mintcream|honeydew|ivory|beige|lightyellow|lightgoldenrodyellow|lemonchiffon|floralwhite|oldlace|cornsilk|papayawhite|blanchedalmond|bisque|snow|linen|antiquewhite|seashell|lavenderblush|mistyrose|gainsboro|lightgray|lightsteelblue|lightblue|lightskyblue|powderblue|paleturquoise|skyblue|mediumaquamarine|aquamarine|palegreen|lightgreen|khaki|palegoldenrod|moccasin|navajowhite|peachpuff|wheat|pink|lightpink|thistle|plum|silver|darkgray|lightslategray|slategray|slateblue|steelblue|mediumslateblue|royalblue|blue|dodgerblue|cornflowerblue|deepskyblue|cyan|aqua|turquoise|mediumturquoise|darkturquoise|lightseagreen|mediumspringgreen|springgreen|lime|limegreen|yellowgreen|lawngreen|chartreuse|greenyellow|yellow|gold|orange|darkorange|goldenrod|burlywood|tan|sandybrown|darksalmon|lightcoral|salmon|lightsalmon|coral|tomato|orangered|red|deeppink|hotpink|palevioletred|violet|orchid|magenta|fuchsia|mediumorchid|darkorchid|darkviolet|blueviolet|mediumpurple|gray|mediumblue|darkcyan|cadetblue|darkseagreen|mediumseagreen|teal|forestgreen|seagreen|darkkhaki|peru|crimson|indianred|rosybrown|mediumvioletred|dimgray|black|midnightblue|darkslateblue|darkblue|navy|darkslategray|green|darkgreen|darkolivegreen|olivedrab|olive|darkgoldenrod|chocolate|sienna|saddlebrown|firebrick|brown|maroon|darkred|darkmagenta|purple|indigo/g, "<span class='bold' style='color:$&;filter:contrast(0.5)'>$&</span>")
					.replace(/(^|(?<=,\s?))[^,\n:]+(?=.*{)/gm, "<span class='red bold'>$&</span>")
					.replace(/:[^,\n]+(?=.*{)/gm, "<span class='red'>$&</span>")
					.replace(/(?<=^\s*)[^\t\s:]+(?=:)(?!.+\{)/gm, "<span class='chocolate'>$&</span>")
					.replace(/[\d\.]+(%|px|r?em)/g, "<span class='blue'>$&</span>")
					.replace(/(?<=(&#x20;|,|:|\())[\d\.]+(?=(&#x20;|,|&#0059;|\)))/g, "<span class='red'>$&</span>")
					.replace(/&quot;((?!&quot;)[\s\S])*&quot;/g, "<span class='green'>$&</span>")
					.replace(/&apos;((?!&apos;)[\s\S])*&apos;/g, "<span class='green'>$&</span>")
				/**
				 * @○○, and	赤	#d73a49
				 * ルール名(tagname)	緑	#22863a
				 * ルール名(.class, #id)	青	#005cc5
				 * プロパティ	青	#005cc5
				 * データの数値+数助詞(%|px|r?em|v[wh]|deg)、#ddd、@○○	青	#005cc5
				 * 関数	橙	#e36209
				 * "文字列"or''	紺	#032f62
				 * コメント	灰	#6a737d
				 * 色、その他	そのまま黒
				 */
				break;
		}
		text = text.replace(/(?<=\t)/g, `<span class='tab'></span>`)
			.replace(/&#x20;/g, "<span class='gray'>_</span>");
		this.shadow_p.innerHTML = text;
	}

	onscroll() {
		this.shadow_p.scrollTop = this.element.scrollTop;
		this.shadow_p.scrollLeft = this.element.scrollLeft;
	}

	onresize() {
		let zindex = window.getComputedStyle(this.element).zIndex;
		if (zindex == "auto") zindex = 0;
		let elemRect = this.element.getBoundingClientRect();
		this.display.style = `
			position: absolute;
			margin: ${window.getComputedStyle(this.element).margin};
			top: ${this.element.offsetTop}px;
			left: ${this.element.offsetLeft}px;
			width: ${elemRect.width}px;
			height: ${elemRect.height}px;
			z-index: ${zindex};
			border: ${window.getComputedStyle(this.element).border};
		`
	}
}

/*
	style
	div.html
		├div
		└textarea.hilightTextarea

	textareaを置いとくと、ソレを包むように多要素を追加
	サイズは window.getComputedStyle($1).width で取得、window.onresizeで都度更新
*/

// //入力ごとに動かすぞぞぞ
// function fitTextarea(){
// 	//高さ調整
// 	textarea.style.height = "0px";
// 	let scrollHeight = textarea.scrollHeight;
// 	textarea.style.height = `${scrollHeight}px`;
// 	let rownumber = Math.round(Number(scrollHeight/(16*1.3)));
// 	console.log(rownumber);
// 	//preに落とし込む
// 	var vals = textarea.value.split("\n");
// 	var elems = document.querySelectorAll("#editor>div>pre");
// 	var i;
// 	for(i=0; i<vals.length; i++){
// 		var text = vals[i]
// 			.replace(/&/g,"&amp;")
// 			.replace(/;/g,"&#0059;")
// 			.replace(/&amp&#0059;/g,"&amp;")
// 			.replace(/</g,"&lt;")
// 			.replace(/>/g,"&gt;")
// 			.replace(/"/g,"&quot;")//"
// 			.replace(/'/g,"&apos;")//'
// 			.replace(/ /g,"&#x20;")
// 			.replace(/(?<=&lt;\/?)(?!\/)([a-zA-Z\d])+(?=&gt;|&#x20;|\s)/g,"<span class='red'>$&</span>")
// 			.replace(/(?<=&lt;(?!&gt;)[\s\S]*)&quot;((?!&quot;)[\s\S])*&quot;/g,"<span class='green'>$&</span>")
// 			.replace(/(?<=&lt;(?!&gt;)[\s\S]*)&apos;((?!&apos;)[\s\S])*&apos;/g,"<span class='green'>$&</span>")
// 			.replace(/(?<=^|&gt;)((?!&lt;)(?!&gt;)[\s\S])+(?=$|&lt;)/g,"<span class='bold'>$&</span>")
// 			.replace(/\t/g,"<span class='tab'>｜</span>")
// 			.replace(/&#x20;/g,"<span class='tab'>_</span>")
// 		if(i < elems.length){
// 			elems[i].innerHTML = text;
// 		}else{
// 			var div = document.createElement("div");
// 			var span = document.createElement("span");
// 			span.innerHTML = i+1;
// 			var pre = document.createElement("pre");
// 			pre.innerHTML = text;
// 			div.appendChild(span);
// 			div.appendChild(pre);
// 			document.getElementById("editor").appendChild(div);
// 		}
// 	}
// 	for(; i<elems.length; i++){
// 		elems[i].parentElement.remove();
// 	}
// }

// //form送信
// function formSubmit(){
// 	const form = new FormData();
// 	var text = textarea.value;
// 	form.append('markup', text);
// 	fetch("" , {
// 		method: "POST",
// 		body: form
// 	}).then(
// 		console.log("OK!")
// 	)
// }

// //画像アップローダー
// document.querySelector('#image>input[type="file"]').addEventListener("change", function(e){
// 	var fileReader = new FileReader();
// 	fileReader.onload = (function() {
// 		document.querySelector('#image>img').src = fileReader.result;
// 	});
// 	fileReader.readAsDataURL(e.currentTarget.files[0]);
// })
